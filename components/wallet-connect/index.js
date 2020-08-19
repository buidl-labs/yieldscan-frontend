import { useState, useEffect } from "react";
import { create } from "zustand";
import { ChevronLeft } from "react-feather";
import {
	Modal,
	ModalBody,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
} from "@chakra-ui/core";
import IntroPage from "./Intro";
import CreateWallet from "./CreateWallet";
import ImportAccount from "./ImportAccount";
import WalletConnected from "./WalletConnected";
import WalletDisclaimer from "./WalletDisclaimer";
import getPolkadotExtensionInfo from "@lib/polkadot-extension";
import { useAccounts, usePolkadotApi } from "@lib/store";
import { trackEvent, Events } from "@lib/analytics";

const [useWalletConnect] = create((set) => ({
	isOpen: false,
	toggle: () => set((state) => ({ isOpen: !state.isOpen })),
	close: () => set(() => ({ isOpen: false })),
	open: () => set(() => ({ isOpen: true })),
}));

const WalletConnectStates = {
	INTRO: "intro",
	CONNECTED: "connected",
	DISCLAIMER: "disclaimer",
	CREATE: "create",
	IMPORT: "import",
};

const WalletConnectPopover = ({ styles }) => {
	const { isOpen, close } = useWalletConnect();
	const [ledgerLoading, setLedgerLoading] = useState(false);
	const setApiInstance = usePolkadotApi((state) => state.setApiInstance);
	const {
		accounts,
		setAccounts,
		setStashAccount,
		setAccountState,
	} = useAccounts();
	const [state, setState] = useState(WalletConnectStates.INTRO);

	useEffect(() => {
		trackEvent(Events.INTENT_CONNECT_WALLET);
	}, []);

	const onConnected = () => {
		getPolkadotExtensionInfo()
			.then(({ isExtensionAvailable, accounts = [] }) => {
				if (!isExtensionAvailable) throw new Error("Extension not available.");
				if (!accounts.length) throw new Error("No Accounts found.");

				setState(WalletConnectStates.CONNECTED);
				setAccounts(accounts);

				trackEvent(Events.WALLET_CONNECTED, {
					userAccounts: accounts.map((account) => account.address),
				});
			})
			.catch((error) => {
				// TODO: handle error properly using UI toast
				alert(error);
			});
	};

	const onStashSelected = async (stashAccount) => {
		if (stashAccount) close();
		setStashAccount(stashAccount);
	};

	return (
		<Modal isOpen={isOpen} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent
				rounded="lg"
				maxWidth={state === WalletConnectStates.INTRO ? "33rem" : "40rem"}
				{...styles}
				py={4}
			>
				<ModalHeader>
					{[
						WalletConnectStates.DISCLAIMER,
						WalletConnectStates.CREATE,
						WalletConnectStates.IMPORT,
					].includes(state) ? (
						<div
							className="text-sm flex-center px-2 py-1 text-gray-700 bg-gray-200 rounded-xl w-40 font-normal cursor-pointer"
							onClick={() => setState(WalletConnectStates.INTRO)}
						>
							<ChevronLeft />
							<span>Wallet Connect</span>
						</div>
					) : (
						state === WalletConnectStates.CONNECTED && (
							<h3 className="px-3 text-2xl text-left self-start">
								Select Account for Staking
							</h3>
						)
					)}
				</ModalHeader>
				<ModalCloseButton
					onClick={close}
					boxShadow="0 0 0 0 #fff"
					color="gray.400"
					backgroundColor="gray.100"
					rounded="1rem"
					mt={4}
					mr={4}
				/>
				<ModalBody>
					{state === WalletConnectStates.INTRO ? (
						<IntroPage
							onConnected={onConnected}
							onDisclaimer={() => setState(WalletConnectStates.DISCLAIMER)}
						/>
					) : (
						state === WalletConnectStates.CONNECTED && (
							<WalletConnected
								accounts={accounts}
								ledgerLoading={ledgerLoading}
								onStashSelected={onStashSelected}
							/>
						)
					)}
					{/* {state === WalletConnectStates.DISCLAIMER && (
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
					)} */}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export { WalletConnectPopover, useWalletConnect };
