import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Textarea
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";

const EditProfileModal = withSlideIn(({ styles, onClose }) => {
	return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="50vw" height="70vh" {...styles}>
				<ModalHeader>
					<h3 className="text-gray-700 font-normal text-2xl">Manage Profile</h3>
				</ModalHeader>
				<ModalCloseButton onClick={onClose} />
				<ModalBody>
					<div className="mt-2 p-4 rounded-lg border border-gray-300">
						<div className="flex">
							<img src="http://placehold.it/300" className="w-16 h-16 mr-5 rounded-full" />
							<div className="flex flex-col">
								<h3 className="text-2xl text-gray-700 font-semibold">{'Validator Name'}</h3>
								<p className="text-gray-600 text-sm">5D5FrhPca4LiKzCmbRiFqK3rMfTwwi7hxqaugyUdcvFyX13p</p>
							</div>
						</div>
						<div className="mt-5">
							<h5 className="text-gray-800 mb-2">Description</h5>
							<textarea
								rows={4}
								className="w-full p-2 outline-none border border-gray-400 text-gray-600 rounded-lg"
								placeholder="Enter description about your validator here"
							/>
						</div>
						<div className="mt-5">
							<h5 className="text-gray-800 mb-2">Team Members</h5>
							
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditProfileModal;
