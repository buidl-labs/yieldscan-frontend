import { useState } from 'react';
import { create } from 'zustand';
import { ChevronLeft } from 'react-feather';
import { Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, Button, ModalHeader } from '@chakra-ui/core';
import withSlideIn from '@components/common/withSlideIn';
import IntroPage from './Intro';
import CreateWallet from './CreateWallet';
import WalletConnected from './WalletConnected';
import WalletDisclaimer from './WalletDisclaimer';

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