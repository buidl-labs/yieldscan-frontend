import dynamic from 'next/dynamic';
import SideMenu from '@components/common/sidemenu';
import { useAccounts, usePolkadotApi, useTransaction } from '@lib/store';
import createPolkadotAPIInstance from '@lib/polkadot-api';
import convertCurrency from '@lib/convert-currency';
import { pick } from 'lodash';
import { useEffect } from 'react';
import { trackEvent, Events } from '@lib/analytics';
import Footer from '../footer';

const Header = dynamic(
	() => import('@components/common/header').then(mod => mod.default),
	{ ssr: false },
);

const withDashboardLayout = (children) => {
	const { setApiInstance } = usePolkadotApi();
	const { stashAccount, setAccountInfoLoading, setAccountState } = useAccounts(
		state => pick(state, ['stashAccount', 'setAccountState', 'setAccountInfoLoading'])
	);
	const { stakingAmount, setTransactionState } = useTransaction(
		state => pick(state, ['stakingAmount', 'setTransactionState'])
	);

	useEffect(() => {
		// wallet connected state:
		// when `stashAccount` is selected, fetch ledger for the account and save it.
		if (stashAccount) {
			setAccountInfoLoading(true);
			createPolkadotAPIInstance().then(async api => {
				setApiInstance(api);

				const { address } = stashAccount;

				api.queryMulti(
					[
						[api.query.staking.bonded, address], // check if `stashAccount` already has bonded on some controller
						[api.query.system.account, address],
					],
					async ([
						controller,
						accountQueryResult,
					]) => {
						const ledgerQueryResult = await api.query.staking.ledger(controller.toString())
						const {
							data: { free: freeBalance, miscFrozen: lockedBalance },
						} = accountQueryResult;
						const {
							value: { unlocking, total, active },
						} = ledgerQueryResult;

						console.log(ledgerQueryResult);

						let bondedAmount = 0,
							bondedAmountInSubCurrency = 0,
							freeAmount = 0,
							freeAmountInSubCurrency = 0,
							activeStake = 0,
							activeStakeInSubCurrency = 0;
						if (controller) {
							bondedAmount = Number(
								(parseInt(total) / 10 ** 12).toFixed(4)
							);
							bondedAmountInSubCurrency = await convertCurrency(bondedAmount);
							activeStake = Number((parseInt(active) / 10 ** 12).toFixed(4));
							activeStakeInSubCurrency = await convertCurrency(activeStake);
						}

						if (freeBalance) {
							/**
							 * `freeBalance` here includes `locked` balance also - that's how polkadot API is currently working
							 *  so we need to subtract the `bondedBalance``
							 */
							freeAmount = Number(
								(parseInt(freeBalance) / 10 ** 12 - bondedAmount).toFixed(4)
							);
							freeAmountInSubCurrency = await convertCurrency(freeAmount);
						}

						const unlockingBalances = [];

						if (unlocking && !unlocking.isEmpty && unlocking.length > 0) {
							unlocking.forEach((unlockingBalance) => {
								const { era, value } = unlockingBalance;
								unlockingBalances.push({
									era: Number(era.toString()),
									value: Number(value.toString()),
								});
							});
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
								subCurrency: activeStakeInSubCurrency
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
					background: #F7FBFF;
					z-index: 10;
				}
				.core-content {
					width: calc(100vw - 13rem);
					animation: fadein 100ms;
				}
				@keyframes fadein {
					from { opacity: 0; transform: scale(0.7); }
					to   { opacity: 1; transform: scale(1); }
				}
			`}</style>
		</div>
	);
};

export default withDashboardLayout;
