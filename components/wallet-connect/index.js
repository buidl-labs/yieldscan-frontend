import { useState } from 'react';
import { create } from 'zustand';
import { get } from 'lodash';
import { ChevronLeft } from 'react-feather';
import { Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader } from '@chakra-ui/core';
import withSlideIn from '@components/common/withSlideIn';
import IntroPage from './Intro';
import CreateWallet from './CreateWallet';
import ImportAccount from './ImportAccount';
import WalletConnected from './WalletConnected';
import WalletDisclaimer from './WalletDisclaimer';
import getPolkadotExtensionInfo from '@lib/polkadot-extension';
import { useAccounts, usePolkadotApi } from '@lib/store';
import createPolkadotAPIInstance from '@lib/polkadot-api';
import convertCurrency from '@lib/convert-currency';

const [useWalletConnect] = create(set => ({
	isOpen: false,
	toggle: () => set(state => ({ isOpen: !state.isOpen })),
	close: () => set(() => ({ isOpen: false })),
	open: () => set(() => ({ isOpen: true })),
}));

const WalletConnectStates = {
	INTRO: 'intro',
	CONNECTED: 'connected',
	DISCLAIMER: 'disclaimer',
	CREATE: 'create',
	IMPORT: 'import',
};

const WalletConnectPopover = withSlideIn(({ styles }) => {
	const { close } = useWalletConnect();
	const [ledgerLoading, setLedgerLoading] = useState(false);
	const setApiInstance = usePolkadotApi(state => state.setApiInstance);
	const { accounts, setAccounts, setStashAccount, setAccountState } = useAccounts();
	const [state, setState] = useState(WalletConnectStates.INTRO);

	const onConnected = () => {
		getPolkadotExtensionInfo().then(({ isExtensionAvailable, accounts = [] }) => {
			if (!isExtensionAvailable) throw new Error('Extension not available.');
			if (!accounts.length) throw new Error('No Accounts found.');

			setState(WalletConnectStates.CONNECTED);
			setAccounts(accounts);
		}).catch(error => {
			// TODO: handle error properly using UI toast
			alert(error);
		});
	};

	const onStashSelected = async (stashAccount) => {
		// wallet connected state:
		// when `stashAccount` is selected, fetch ledger for the account and save it.
		if (stashAccount) {
			setLedgerLoading(true);
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
				});

				setLedgerLoading(false);
				close();
			});
		}
		setStashAccount(stashAccount);
	};

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="33rem" height="42rem" {...styles}>
				<ModalHeader>
					{[
						WalletConnectStates.DISCLAIMER,
						WalletConnectStates.CREATE,
						WalletConnectStates.IMPORT
					].includes(state) && (
						<div
							className="text-sm flex-center px-2 py-1 text-gray-700 bg-gray-200 rounded-xl w-40 font-normal cursor-pointer"
							onClick={() => setState(WalletConnectStates.INTRO)}
						>
							<ChevronLeft />
							<span>Wallet Connect</span>
						</div>
					)}
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody>
					<div>
						{state === WalletConnectStates.INTRO && (
							<IntroPage
								onConnected={onConnected}
								onDisclaimer={() => setState(WalletConnectStates.DISCLAIMER)}
							/>
						)}
						{state === WalletConnectStates.CONNECTED && (
							<WalletConnected
								accounts={accounts}
								ledgerLoading={ledgerLoading}
								onStashSelected={onStashSelected}
							/>
						)}
						{state === WalletConnectStates.DISCLAIMER && (
							<WalletDisclaimer
								onCreate={() => setState(WalletConnectStates.CREATE)}
							/>
						)}
						{state === WalletConnectStates.CREATE && (
							<CreateWallet
								onPrevious={() => setState(WalletConnectStates.DISCLAIMER)}
								onNext={() => setState(WalletConnectStates.IMPORT)}
							/>
						)}
						{state === WalletConnectStates.IMPORT && (
							<ImportAccount
								onPrevious={() => setState(WalletConnectStates.CREATE)}
								onNext={() => setState(WalletConnectStates.CONNECTED)}
							/>
						)}
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export { WalletConnectPopover, useWalletConnect };