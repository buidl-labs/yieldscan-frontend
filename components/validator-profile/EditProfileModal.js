import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";

const EditProfileModal = withSlideIn(({ styles, onClose }) => {
	return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="50vw" height="70vh" {...styles}>
				<ModalHeader>
					<h3 className="text-gray-700 font-normal text-2xl">Edit Profile</h3>
				</ModalHeader>
				<ModalCloseButton onClick={onClose} />
				<ModalBody>
					<div className="mt-10">

					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditProfileModal;
