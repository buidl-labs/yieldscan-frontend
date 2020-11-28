import { useState, useEffect } from "react";
import create from "zustand";
import { isNil } from "lodash";
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
import RejectedPage from "./RejectedPage";
import SelectAccount from "./SelectAccount";
import getPolkadotExtensionInfo from "@lib/polkadot-extension";
import { useAccounts } from "@lib/store";
import { trackEvent, Events, setUserProperties } from "@lib/analytics";
import { setCookie } from "nookies";

const [useWalletConnect] = create((set) => ({
	isOpen: false,
	toggle: () => set((state) => ({ isOpen: !state.isOpen })),
	close: () => set(() => ({ isOpen: false })),
	open: () => set(() => ({ isOpen: true })),
}));

const WalletConnectStates = {
	REJECTED: "rejected",
	CONNECTED: "connected",
};

const WalletConnectPopover = ({ styles, networkInfo, cookies }) => {
	const { isOpen, close } = useWalletConnect();
	const [extensionEvent, setExtensionEvent] = useState();
	const {
		accounts,
		stashAccount,
		accountsWithBalances,
		setAccounts,
		setStashAccount,
	} = useAccounts();
	const [state, setState] = useState("");

	const handlers = {
		onEvent: (eventInfo) => {
			setExtensionEvent(eventInfo.message);
		},
	};

	useEffect(() => {
		getPolkadotExtensionInfo()
			.then(({ isExtensionAvailable, accounts = [] }) => {
				if (!isExtensionAvailable) {
					setUserProperties({ hasExtension: false });
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
					setUserProperties({hasExtension: true})
				}
			})
			.catch((error) => {
				// TODO: handle error properly using UI toast
				alert(error);
			});
	}, [networkInfo]);

	useEffect(() => {
		getPolkadotExtensionInfo(handlers)
			.then(({ isExtensionAvailable, accounts = [] }) => {
				if (!isExtensionAvailable) {
					setState(WalletConnectStates.REJECTED);
					setUserProperties({ hasExtension: false });
				} else {
					setCookie(null, "isAuthorized", true);
					if (!accounts.length)
						throw new Error("Couldn't find any stash or unnassigned accounts.");

					accounts.map((x) => {
						x.address = encodeAddress(
							decodeAddress(x.address.toString()),
							networkInfo.addressPrefix
						);
					});
					// setState(WalletConnectStates.CONNECTED);
					setAccounts(accounts);

					setUserProperties({ hasExtension: true });
				}
			})
			.catch((error) => {
				// TODO: handle error properly using UI toast
				alert(error);
			});
	}, [networkInfo]);

	useEffect(() => {
		let previousAccountAvailable = false;
		if (!stashAccount && accounts) {
			if (!isNil(cookies.kusamaDefault) || !isNil(cookies.polkadotDefault)) {
				networkInfo.name == "Kusama"
					? accounts
							.filter((account) => account.address == cookies.kusamaDefault)
							.map((account) => {
								previousAccountAvailable = true;
								setStashAccount(account);
							})
					: accounts
							.filter((account) => account.address == cookies.polkadotDefault)
							.map((account) => {
								previousAccountAvailable = true;
								setStashAccount(account);
							});
			}
			if (!previousAccountAvailable) {
				setState(WalletConnectStates.CONNECTED);
			} else close();
		}
	}, [accounts]);

	const onStashSelected = async (stashAccount) => {
		if (stashAccount) close();
		setStashAccount(stashAccount);
		networkInfo.name == "Kusama"
			? setCookie(null, "kusamaDefault", stashAccount.address)
			: setCookie(null, "polkadotDefault", stashAccount.address);
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
				maxWidth={state === WalletConnectStates.REJECTED ? "33rem" : "40rem"}
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
							onClick={() => setState(WalletConnectStates.REJECTED)}
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
					{state === WalletConnectStates.REJECTED ? (
						<RejectedPage />
					) : !accounts ? (
						<div className="flex-center w-full h-full min-h-26-rem">
							<div className="flex-center flex-col">
								<Spinner size="xl" color="teal.500" thickness="4px" />
								<span className="text-sm text-gray-600 mt-5">
									{extensionEvent}
								</span>
							</div>
						</div>
					) : (
						state === WalletConnectStates.CONNECTED && (
							<SelectAccount
								accounts={
									accountsWithBalances !== null
										? accountsWithBalances
										: accounts
								}
								onStashSelected={onStashSelected}
								networkInfo={networkInfo}
							/>
						)
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export { WalletConnectPopover, useWalletConnect };
