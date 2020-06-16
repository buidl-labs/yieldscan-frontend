import { Modal, ModalBody, ModalOverlay, ModalContent } from '@chakra-ui/core';
import { createContext } from 'react';
import { create } from 'zustand';

const [useWalletConnect] = create(set => ({
	isOpen: false,
	toggle: () => set(state => ({ isOpen: !state.isOpen })),
	close: () => set(state => ({ isOpen: false })),
	open: () => set(state => ({ isOpen: true })),
}));

const WalletConnectPopover = () => {
	const isOpen = useWalletConnect(state => state.isOpen);
	console.log(isOpen);
	return (
		<Modal isOpen={isOpen} onClose={}>
			<ModalOverlay />
			<ModalContent>
				<ModalBody>
					<h1>Hello</h1>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export { WalletConnectPopover, useWalletConnect };