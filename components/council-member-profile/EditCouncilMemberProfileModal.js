import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Button,
	useToast
} from "@chakra-ui/core";
import { useState } from "react";
import withSlideIn from "@components/common/withSlideIn";
import axios from "@lib/axios";

const EditCouncilMemberProfileModal = withSlideIn(({ styles, onClose, onSuccess, name, accountId }) => {
	const toast = useToast();
	const [newVision, setVision] = useState('');
	const [updating, setUpdating] = useState(false);

	const updateProfile = () => {
		setUpdating(true);
		axios.put(
			`council/member/${accountId}/update`,
			{ vision: newVision },
		).then(({ data }) => {
			if (data.status === 200) {
				toast({
					title: 'Success',
					description: 'Profile updated!',
					duration: 2000,
					status: 'success',
					position: 'top-right',
				});
				onClose();
				onSuccess();
			}
		}).catch(() => {
			toast({
				title: 'Error!',
				description: 'Something went wrong!',
				duration: 2000,
				status: 'error',
				position: 'top-right',
			});
		}).finally(() => {
			setUpdating(false);
		});
	};

	return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="70vw" height="60vh" {...styles}>
				<ModalHeader>
					<h3 className="text-gray-700 font-semibold text-xs">Manage Profile</h3>
					<div className="flex">
					{false && <img src="http://placehold.it/300" className="w-16 h-16 mr-5 rounded-full" />}
					<div className="flex flex-col">
						<h3 className="text-2xl text-gray-700 font-semibold">{name}</h3>
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
								onClick={updateProfile}
								isLoading={updating}
								loadingText="Updating profile"
							>
								Update Profile
							</Button>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditCouncilMemberProfileModal;
