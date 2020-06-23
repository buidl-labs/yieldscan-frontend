import dynamic from 'next/dynamic';
import SideMenu from '@components/common/sidemenu';
import { useAccounts, usePolkadotApi, useTransaction } from '@lib/store';
import createPolkadotAPIInstance from '@lib/polkadot-api';
import convertCurrency from '@lib/convert-currency';
import { pick } from 'lodash';
import { useEffect } from 'react';

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

				// check if `stashAccount` already has bonded on some controller
				const { isSome: isBonded } = await api.query.staking.bonded(stashAccount.address);
				const { data: { free: freeBalance, miscFrozen: lockedBalance } } = await api.query.system.account(stashAccount.address);

				let bondedAmount = 0, bondedAmountInSubCurrency = 0, freeAmount = 0, freeAmountInSubCurrency = 0;
				if (isBonded && !lockedBalance.isEmpty) {
					bondedAmount = Number((lockedBalance.toNumber() / (10 ** 12)).toFixed(4));
					bondedAmountInSubCurrency = await convertCurrency(bondedAmount);
				}

				if (freeBalance) {
					/**
					 * `freeBalance` here includes `locked` balance also - that's how polkadot API is currently working
					 *  so we need to subtract the `bondedBalance``
					 */
					freeAmount = Number(((freeBalance.toNumber() / (10 ** 12))  - bondedAmount).toFixed(4));
					freeAmountInSubCurrency = await convertCurrency(freeAmount);
				}

				const newStakingAmount = Math.max((stakingAmount || 0) - bondedAmount, 0);
				setTransactionState({ stakingAmount: newStakingAmount });

				setAccountState({
					ledgerExists: isBonded,
					bondedAmount: {
						currency: bondedAmount,
						subCurrency: bondedAmountInSubCurrency,
					},
					freeAmount: {
						currency: freeAmount,
						subCurrency: freeAmountInSubCurrency,
					},
					accountInfoLoading: false,
				});
			});
		}
	}, [stashAccount]);

	return () => (
		<div>
			<Header />
			<div className="dashboard-content fixed flex">
				<div className="h-full relative sidemenu-container py-10">
					<SideMenu />
				</div>
				<div className="h-full core-content overflow-y-scroll">
					{children()}
				</div>
			</div>
			<style jsx>{`
				.dashboard-content {
					height: calc(100vh - 4rem);
					animation: fadein 100ms;
				}
				.sidemenu-container {
					width: 13rem;
					background: #F7FBFF;
				}
				.core-content {
					width: calc(100vw - 13rem);
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
