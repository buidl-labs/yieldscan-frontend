import dynamic from "next/dynamic";
import SideMenu from "@components/common/sidemenu";
import {
	useAccounts,
	usePolkadotApi,
	useTransaction,
	useSelectedNetwork,
} from "@lib/store";
import createPolkadotAPIInstance from "@lib/polkadot-api";
import convertCurrency from "@lib/convert-currency";
import { isNil, pick } from "lodash";
import { useEffect } from "react";
import { trackEvent, Events } from "@lib/analytics";
import Footer from "../footer";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

const Header = dynamic(
	() => import("@components/common/header").then((mod) => mod.default),
	{ ssr: false }
);

import { getNetworkInfo } from "yieldscan.config";

const withDashboardLayout = (children) => {
	const { setApiInstance } = usePolkadotApi();
	const { selectedNetwork, setSelectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const {
		accounts,
		setFilteredAccounts,
		stashAccount,
		setAccountInfoLoading,
		setIsFilteringAccounts,
		setAccountState,
	} = useAccounts((state) =>
		pick(state, [
			"accounts",
			"setFilteredAccounts",
			"stashAccount",
			"setAccountState",
			"setAccountInfoLoading",
			"setIsFilteringAccounts",
		])
	);
	const { stakingAmount, setTransactionState } = useTransaction((state) =>
		pick(state, ["stakingAmount", "setTransactionState"])
	);

	useEffect(() => {
		setIsFilteringAccounts(true);
		if (accounts && accounts.length > 0) {
			createPolkadotAPIInstance(selectedNetwork)
				.then(async (api) => {
					setApiInstance(api);
					const queries = accounts.map((account) => [
						api.query.staking.ledger,
						account.address,
					]);

					api.queryMulti(queries, async (queryResults) => {
						const ledgerArray = await queryResults;
						const accountLedgers = accounts.map((account, index) => ({
							account,
							ledger: ledgerArray[index],
						}));
						const filteredAccounts = accountLedgers.filter(
							({ account: { address }, ledger }) => {
								const encodedAddress = encodeAddress(
									decodeAddress(address.toString()),
									2
								);
								return (
									ledger &&
									((ledger.value.stash &&
										ledger.value.stash.toString() === encodedAddress) ||
										ledger.isNone)
								);
							}
						);
						const parsedFilteredAccounts = filteredAccounts.map(
							({ account }) => account
						);
						setFilteredAccounts(parsedFilteredAccounts);
						setIsFilteringAccounts(false);
					});
				})
				.catch((err) => {
					throw err;
				});
		}
	}, [accounts]);

	useEffect(() => {
		// wallet connected state:
		// when `stashAccount` is selected, fetch ledger for the account and save it.
		if (stashAccount) {
			setAccountInfoLoading(true);
			createPolkadotAPIInstance(selectedNetwork).then(async (api) => {
				setApiInstance(api);

				const { address } = stashAccount;

				api.queryMulti(
					[
						[api.query.staking.bonded, address], // check if `stashAccount` already has bonded on some controller
						[api.query.system.account, address],
					],
					async ([controller, accountQueryResult]) => {
						let isController = false;
						const {
							data: { free: freeBalance, miscFrozen: lockedBalance },
						} = accountQueryResult;
						const unlockingBalances = [];

						let bondedAmount = 0,
							bondedAmountInSubCurrency = 0,
							freeAmount = 0,
							freeAmountInSubCurrency = 0,
							activeStake = 0,
							activeStakeInSubCurrency = 0;

						if (controller.isNone) {
							const ledgerQueryResult = await api.query.staking.ledger(address);
							if (ledgerQueryResult.isSome) isController = true;
						}
						if (controller.isSome) {
							const ledgerQueryResult = await api.query.staking.ledger(
								controller.toString()
							);
							const {
								value: { unlocking, total, active },
							} = ledgerQueryResult;
							if (unlocking && !unlocking.isEmpty && unlocking.length > 0) {
								unlocking.forEach((unlockingBalance) => {
									const { era, value } = unlockingBalance;
									unlockingBalances.push({
										era: Number(era.toString()),
										value: Number(value.toString()),
									});
								});
							}

							bondedAmount = Number(
								parseInt(total) / 10 ** networkInfo.decimalPlaces
							);
							bondedAmountInSubCurrency = await convertCurrency(bondedAmount);
							activeStake = Number(
								parseInt(active) / 10 ** networkInfo.decimalPlaces
							);
							activeStakeInSubCurrency = await convertCurrency(activeStake);
						}

						if (freeBalance) {
							/**
							 * `freeBalance` here includes `locked` balance also - that's how polkadot API is currently working
							 *  so we need to subtract the `bondedBalance``
							 */
							freeAmount = Number(
								parseInt(freeBalance) / 10 ** networkInfo.decimalPlaces -
									bondedAmount
							);
							freeAmountInSubCurrency = await convertCurrency(freeAmount);
						}

						const setStateAndTrack = (details) => {
							trackEvent(Events.USER_ACCOUNT_SELECTION, {
								user: {
									...details,
									stashId: address,
								},
							});
							setAccountState(details);
						};

						setStateAndTrack({
							isController,
							ledgerExists: !!controller,
							bondedAmount: {
								currency: bondedAmount,
								subCurrency: bondedAmountInSubCurrency,
							},
							freeAmount: {
								currency: freeAmount,
								subCurrency: freeAmountInSubCurrency,
							},
							activeStake: {
								currency: activeStake,
								subCurrency: activeStakeInSubCurrency,
							},
							unlockingBalances,
							accountInfoLoading: false,
						});
					}
				);
			});
		}
	}, [stashAccount]);

	return () => (
		<div>
			<Header />
			<div className="dashboard-content fixed flex w-full">
				<div className="h-full hidden xl:block relative sidemenu-container xl:w-2/12 py-8">
					<SideMenu />
				</div>

				<div className="h-full xl:w-10/12 overflow-y-scroll">
					{children()}
					<Footer />
				</div>
			</div>
			<style jsx>{`
				.dashboard-content {
					height: calc(100vh - 4rem);
				}
				.sidemenu-container {
					background: #f7fbff;
					z-index: 10;
				}
				.core-content {
					width: calc(100vw - 13rem);
					animation: fadein 100ms;
				}
				@keyframes fadein {
					from {
						opacity: 0;
						transform: scale(0.7);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
			`}</style>
		</div>
	);
};

export default withDashboardLayout;
