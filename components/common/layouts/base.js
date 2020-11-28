import dynamic from "next/dynamic";
import {
	useAccounts,
	usePolkadotApi,
	useTransaction,
	useSelectedNetwork,
} from "@lib/store";
import createPolkadotAPIInstance from "@lib/polkadot-api";
import convertCurrency from "@lib/convert-currency";
import { get, isNil, pick } from "lodash";
import { useEffect } from "react";
import { trackEvent, Events, setUserProperties } from "@lib/analytics";
import Footer from "../footer";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

const Header = dynamic(
	() => import("@components/common/header").then((mod) => mod.default),
	{ ssr: false }
);

import { getNetworkInfo } from "yieldscan.config";

const withBaseLayout = (children) => {
	const { setApiInstance } = usePolkadotApi();
	const { selectedNetwork, setSelectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const {
		accounts,
		accountsWithBalances,
		setAccountsWithBalances,
		stashAccount,
		setAccountInfoLoading,
		setAccountState,
	} = useAccounts((state) =>
		pick(state, [
			"accounts",
			"accountsWithBalances",
			"setAccountsWithBalances",
			"stashAccount",
			"setAccountInfoLoading",
			"setAccountState",
		])
	);
	const { stakingAmount, setTransactionState } = useTransaction((state) =>
		pick(state, ["stakingAmount", "setTransactionState"])
	);
	useEffect(() => {
		if (accounts && accounts.length > 0) {
			createPolkadotAPIInstance(selectedNetwork)
				.then(async (api) => {
					setApiInstance(api);
					const queries = accounts.map((account) => [
						api.query.staking.ledger,
						account.address,
					]);

					const accountsWithBalances = await Promise.all(
						accounts.map(async (account) => {
							const balanceInfo = await api.derive.balances.all(
								account.address.toString()
							);
							account.address = encodeAddress(
								decodeAddress(account.address.toString()),
								networkInfo.addressPrefix
							);
							account.balances = balanceInfo;
							return account;
						})
					);
					setAccountsWithBalances(accountsWithBalances);
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
							bondedAmountInSubCurrency = await convertCurrency(
								bondedAmount,
								networkInfo.denom
							);
							activeStake = Number(
								parseInt(active) / 10 ** networkInfo.decimalPlaces
							);
							activeStakeInSubCurrency = await convertCurrency(
								activeStake,
								networkInfo.denom
							);
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
							freeAmountInSubCurrency = await convertCurrency(
								freeAmount,
								networkInfo.denom
							);
						}

						const setStateAndTrack = (details) => {
							setUserProperties({
								stashId: address,
								bondedAmount: `${get(details, "bondedAmount.currency")} ${get(
									networkInfo,
									"denom"
								)} ($${get(details, "bondedAmount.subCurrency")})`,
								// accounts: accountsWithBalances,
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
							// freeAmount: {
							// 	currency: freeAmount,
							// 	subCurrency: freeAmountInSubCurrency,
							// },
							activeStake: {
								currency: activeStake,
								subCurrency: activeStakeInSubCurrency,
							},
							unlockingBalances,
							accountInfoLoading: false,
						});
						setAccountInfoLoading(false);
					}
				);
			});
		}
	}, [stashAccount]);

	return () => (
		<div>
			<Header isBase />
			<div className="flex">
				<div className="min-h-full h-fit-content w-full">{children()}</div>
			</div>
		</div>
	);
};

export default withBaseLayout;
