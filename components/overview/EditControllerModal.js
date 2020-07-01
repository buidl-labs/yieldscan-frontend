import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";

const EditControllerModal = withSlideIn(({ styles }) => {
	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="40rem" height="36rem" {...styles}>
				<ModalHeader>
				<h1>Edit Controller</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody>
					<div className="px-20 py-5">

					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditControllerModal;
