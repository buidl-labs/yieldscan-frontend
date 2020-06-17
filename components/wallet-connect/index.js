import { useState } from 'react';
import { Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, Button, ModalHeader } from '@chakra-ui/core';
import { create } from 'zustand';
import withSlideIn from '@components/common/withSlideIn';
import { ChevronLeft } from 'react-feather';

const [useWalletConnect] = create(set => ({
	isOpen: true,
	toggle: () => set(state => ({ isOpen: !state.isOpen })),
	close: () => set(() => ({ isOpen: false })),
	open: () => set(() => ({ isOpen: true })),
}));

const IntroPage = ({ onConnected, onDisclaimer }) => (
	<div className="mx-10 my-10 flex flex-col text-center items-center">
		<img src="images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-2xl">Connect to the PolkaJS Wallet to Stake your KSM Tokens</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
		<button className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg" onClick={onConnected}>Connect my wallet</button>
		<button className="mt-2 px-12 py-4 bg-white text-teal-500 rounded-lg border border-teal-500" onClick={onDisclaimer}>Create a wallet for my account</button>
		<a href="#" className="mt-8 text-gray-500">How can I obtain KSM tokens?</a>
	</div>
);

const WalletConnected = () => (
	<div className="mx-10 my-10 flex flex-col text-center items-center">
		<img src="images/polkadot-wallet-connect-success.png" width="100px" />
		<h3 className="mt-4 px-5 text-2xl">Cheers, your wallet is successfully connected.</h3>
		<h3 className="mt-10 text-2xl font-semibold">Import your account</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
		<div className="mt-16 flex justify-end">
			<button className="px-6 py-3 mr-4 bg-white text-teal-500 rounded-lg border border-teal-500">Create an account</button>
			<button className="px-12 py-3 bg-teal-500 text-white rounded-lg">Proceed</button>
		</div>
	</div>
);

const WalletDisclaimer = ({ onCreate }) => (
	<div className="mx-10 my-10 flex flex-col text-center items-center">
		<img src="images/polkadot-wallet-connect-info.png" width="120px" />
		<h3 className="mt-4 px-5 text-xl">Ensure that you have an account with KSM tokens that can be connect to the PolkaJS Wallet.</h3>
		<button className="mt-10 px-24 py-3 bg-teal-500 text-white rounded-lg" onClick={onCreate}>Yes, Proceed</button>
		<button className="mt-4 px-4 py-3 bg-white text-teal-500 rounded-lg border border-teal-500 mb-12">No, how can I obtain KSM tokens?</button>
	</div>
);

const CreateWallet = ({ onPrevious, onNext }) => (
	<div className="mx-10 my-10 flex flex-col items-start">
		<h3 className="my-4 text-2xl">Create a wallet</h3>
		<div className="rounded-lg h-48 w-full bg-gray-300"></div>
		<div>
			<h3 className="my-4 text-xl">Step 1 Title</h3>
			<p className="text-sm text-gray-600 text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		</div>
		<div className="w-full mt-16 flex justify-end">
			<button className="px-6 py-3 mr-4 bg-white text-teal-500 rounded-lg border border-teal-500" onClick={onPrevious}>Previous</button>
			<button className="px-12 py-3 bg-teal-500 text-white rounded-lg" onClick={onNext}>Next</button>
		</div>
	</div>
);

const WalletConnectStates = {
	INTRO: 'intro',
	CONNECTED: 'connected',
	DISCLAIMER: 'disclaimer',
	CREATE: 'create',
};

const WalletConnectPopover = withSlideIn(({ styles }) => {
	const { close } = useWalletConnect();
	const [state, setState] = useState(WalletConnectStates.INTRO);

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="33rem" height="42rem" {...styles}>
				<ModalHeader>
					{[
							WalletConnectStates.DISCLAIMER,
							WalletConnectStates.CREATE
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
								onConnected={() => setState(WalletConnectStates.CONNECTED)}
								onDisclaimer={() => setState(WalletConnectStates.DISCLAIMER)}
							/>
						)}
						{state === WalletConnectStates.CONNECTED && <WalletConnected />}
						{state === WalletConnectStates.DISCLAIMER && (
							<WalletDisclaimer
								onCreate={() => setState(WalletConnectStates.CREATE)}
							/>
						)}
						{state === WalletConnectStates.CREATE && (
							<CreateWallet
								onPrevious={() => setState(WalletConnectStates.DISCLAIMER)}
							/>
						)}
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export { WalletConnectPopover, useWalletConnect };