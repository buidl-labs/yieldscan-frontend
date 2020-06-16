import { Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton } from '@chakra-ui/core';
import { create } from 'zustand';

const [useWalletConnect] = create(set => ({
	isOpen: true,
	toggle: () => set(state => ({ isOpen: !state.isOpen })),
	close: () => set(state => ({ isOpen: false })),
	open: () => set(state => ({ isOpen: true })),
}));

const IntroPage = () => (
	<div className="mx-10 my-10 flex flex-col text-center items-center">
		<img src="images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-2xl">Connect to the PolkaJS Wallet to Stake your KSM Tokens</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
		<button className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg">Connect my wallet</button>
		<button className="mt-2 px-12 py-4 bg-white text-teal-500 rounded-lg border border-teal-500">Create a wallet for my account</button>
		<a href="#" className="mt-8 text-gray-500">How can I obtain KSM tokens?</a>
	</div>
);

const WalletConnectPopover = () => {
	const { isOpen, close } = useWalletConnect();
	return (
		<Modal isOpen={isOpen} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="33rem">
				<ModalCloseButton />
				<ModalBody>
					<IntroPage />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export { WalletConnectPopover, useWalletConnect };