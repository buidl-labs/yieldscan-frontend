import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button } from "@chakra-ui/core";
import { useState } from "react";

const EditCouncilMemberProfileModal = ({ styles, onClose, accountId }) => {
	const [newVision, setVision] = useState('');
	
	return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="70vw" height="60vh" {...styles}>
				<ModalHeader>
					<h3 className="text-gray-700 font-semibold text-xs">Manage Profile</h3>
					<div className="flex">
					{false && <img src="http://placehold.it/300" className="w-16 h-16 mr-5 rounded-full" />}
					<div className="flex flex-col">
						<h3 className="text-2xl text-gray-700 font-semibold">Council Member Name</h3>
						<p className="text-gray-600 text-sm">{accountId}</p>
					</div>
				</div>
				</ModalHeader>
				<ModalCloseButton onClick={onClose} />
				<ModalBody overflowY="scroll">
					<div className="px-4">
						<div>
							<h5 className="text-gray-600 mb-2 font-bold text-lg">Profile Summary</h5>
							<textarea
								rows={6}
								value={newVision}
								className="w-full p-2 outline-none border border-gray-400 text-gray-600 rounded-lg"
								placeholder="Enter your profile summary here"
								onChange={ev => setVision(ev.target.value)}
							/>
						</div>
						<div className="flex-center">
							<Button
								px="8"
								py="2"
								mt="5"
								rounded="0.5rem"
								backgroundColor="teal.500"
								color="white"
							>
								Update Profile
							</Button>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default EditCouncilMemberProfileModal;
