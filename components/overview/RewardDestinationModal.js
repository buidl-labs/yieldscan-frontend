import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";

const RewardDestinationModal = withSlideIn(({ close, styles }) => {
	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="33rem" height="42rem" {...styles}>
				<ModalCloseButton onClick={close} />
				<ModalBody>
					<div>
						<h1>Reward Destination</h1>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default RewardDestinationModal;
