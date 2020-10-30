import { useState, useEffect } from "react";
import create from "zustand";
import { ChevronLeft } from "react-feather";
import {
	Modal,
	ModalBody,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
	Spinner,
} from "@chakra-ui/core";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import IntroPage from "./Intro";
import CreateWallet from "./CreateWallet";
import ImportAccount from "./ImportAccount";
import WalletConnected from "./WalletConnected";
import WalletDisclaimer from "./WalletDisclaimer";
import getPolkadotExtensionInfo from "@lib/polkadot-extension";
import { useAccounts } from "@lib/store";
import { trackEvent, Events } from "@lib/analytics";
import { setCookie } from "nookies";

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

const WalletConnectPopover = ({ styles, networkInfo }) => {
	const { isOpen, close } = useWalletConnect();
	const [ledgerLoading, setLedgerLoading] = useState(false);
	const {
		accounts,
		accountsWithBalances,
		setAccounts,
		setStashAccount,
		setAccountState,
	} = useAccounts();
	const [state, setState] = useState(WalletConnectStates.INTRO);

	useEffect(() => {
		trackEvent(Events.INTENT_CONNECT_WALLET);
	}, []);

	useEffect(() => {
		getPolkadotExtensionInfo()
			.then(({ isExtensionAvailable, accounts = [] }) => {
				if (!isExtensionAvailable) {
				} else {
					if (!accounts.length)
						throw new Error("Couldn't find any stash or unnassigned accounts.");

					accounts.map((x) => {
						x.address = encodeAddress(
							decodeAddress(x.address.toString()),
							networkInfo.addressPrefix
						);
					});
					setState(WalletConnectStates.CONNECTED);
					setAccounts(accounts);

					trackEvent(Events.WALLET_CONNECTED, {
						userAccounts: accounts.map((account) => account.address),
					});
				}
			})
			.catch((error) => {
				// TODO: handle error properly using UI toast
				alert(error);
			});
	}, []);

	const onConnected = () => {
		getPolkadotExtensionInfo()
			.then(({ isExtensionAvailable, accounts = [] }) => {
				if (!isExtensionAvailable) throw new Error("Extension not available.");
				if (!accounts.length)
					throw new Error("Couldn't find any stash or unnassigned accounts.");

				accounts.map((x) => {
					x.address = encodeAddress(
						decodeAddress(x.address.toString()),
						networkInfo.addressPrefix
					);
				});
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
		networkInfo.name == "Kusama"
			? setCookie(null, "kusamaDefault", account.address)
			: setCookie(null, "polkadotDefault", account.address);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={close}
			isCentered
			closeOnEsc={true}
			closeOnOverlayClick={true}
		>
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
								Select Account
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
					) : !accounts ? (
						<div className="flex-center w-full h-full min-h-26-rem">
							<div className="flex-center flex-col">
								<Spinner size="xl" color="teal.500" thickness="4px" />
								<span className="text-sm text-gray-600 mt-5">
									Fetching your accounts...
								</span>
							</div>
						</div>
					) : (
						state === WalletConnectStates.CONNECTED && (
							<WalletConnected
								accounts={
									accountsWithBalances !== null
										? accountsWithBalances
										: accounts
								}
								ledgerLoading={ledgerLoading}
								onStashSelected={onStashSelected}
								networkInfo={networkInfo}
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
