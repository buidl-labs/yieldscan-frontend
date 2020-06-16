import { useState } from 'react';
import { Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, Button } from '@chakra-ui/core';
import { create } from 'zustand';
import withSlideIn from '@components/common/withSlideIn';

const [useWalletConnect] = create(set => ({
	isOpen: true,
	toggle: () => set(state => ({ isOpen: !state.isOpen })),
	close: () => set(() => ({ isOpen: false })),
	open: () => set(() => ({ isOpen: true })),
}));

const IntroPage = ({ onConnected }) => (
	<>
		<img src="images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-2xl">Connect to the PolkaJS Wallet to Stake your KSM Tokens</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
		<button className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg" onClick={onConnected}>Connect my wallet</button>
		<button className="mt-2 px-12 py-4 bg-white text-teal-500 rounded-lg border border-teal-500">Create a wallet for my account</button>
		<a href="#" className="mt-8 text-gray-500">How can I obtain KSM tokens?</a>
	</>
);

const WalletConnected = () => (
	<>
		<img src="images/polkadot-wallet-connect-success.png" width="100px" />
		<h3 className="mt-4 px-5 text-2xl">Cheers, your wallet is successfully connected.</h3>
		<h3 className="mt-10 text-2xl font-semibold">Import your account</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
		<div className="mt-16 flex justify-end">
			<button className="px-6 py-3 mr-4 bg-white text-teal-500 rounded-lg border border-teal-500">Create an account</button>
			<button className="px-12 py-3 bg-teal-500 text-white rounded-lg">Proceed</button>
		</div>
	</>
);

const WalletConnectStates = {
	INTRO: 'intro',
	CONNECTED: 'connected',
};

const WalletConnectPopover = withSlideIn(({ styles }) => {
	const { close } = useWalletConnect();
	const [state, setState] = useState(WalletConnectStates.INTRO);

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="33rem" {...styles}>
				<ModalCloseButton onClick={close} />
				<ModalBody>
					<div className="mx-10 my-10 flex flex-col text-center items-center root">
						{state === WalletConnectStates.INTRO && (
							<IntroPage onConnected={() => setState(WalletConnectStates.CONNECTED)} />
						)}
						{state === WalletConnectStates.CONNECTED && <WalletConnected />}
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export { WalletConnectPopover, useWalletConnect };