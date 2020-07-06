import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Textarea,
	Avatar,
	Input,
	Button,
	InputLeftElement,
	InputGroup,
	Icon
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import { Twitter, Feather } from "react-feather";

const MemberInput = ({ newMember }) => {
	return (
		<div className="flex items-center justify-between px-5 py-2 border border-gray-200 rounded-lg">
			<Avatar size="sm" />
			<InputGroup width="30%">
				<InputLeftElement children={<Feather className="text-gray-300" />} />
				<Input _focus={{ outline: 'none' }} placeholder="Name" />
			</InputGroup>
			<InputGroup width="30%">
				<InputLeftElement children={<Twitter className="text-gray-300" />} />
				<Input _focus={{ outline: 'none' }} placeholder="Twitter" />
			</InputGroup>
			{newMember ? (
				<Button leftIcon="add" variantColor="teal" variant="outline" _focus={{outline:'none'}}>
					Add New
				</Button>
			) : (
				<Button leftIcon="delete" variantColor="red" variant="outline" _focus={{outline:'none'}}>
					Remove
				</Button>
			)}
		</div>
	);
};

const EditProfileModal = withSlideIn(({ styles, onClose }) => {
	return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="70vw" height="85vh" {...styles}>
				<ModalHeader>
					<h3 className="text-gray-700 font-semibold text-xs">Manage Profile</h3>
					<div className="flex">
					{false && <img src="http://placehold.it/300" className="w-16 h-16 mr-5 rounded-full" />}
					<div className="flex flex-col">
						<h3 className="text-2xl text-gray-700 font-semibold">{'Validator Name'}</h3>
						<p className="text-gray-600 text-sm">5D5FrhPca4LiKzCmbRiFqK3rMfTwwi7hxqaugyUdcvFyX13p</p>
					</div>
				</div>
				</ModalHeader>
				<ModalCloseButton onClick={onClose} />
				<ModalBody overflowY="scroll">
					<div className="px-4">
						<div>
							<h5 className="text-gray-600 mb-2 font-bold text-lg">Description</h5>
							<textarea
								rows={4}
								className="w-full p-2 outline-none border border-gray-400 text-gray-600 rounded-lg"
								placeholder="Enter description about your validator here"
							/>
						</div>
						<div className="mt-5">
							<h5 className="text-gray-600 mb-2 font-bold text-lg">Team Members</h5>
							<div className="my-4">
								<MemberInput />
							</div>
							<div className="my-4">
								<MemberInput />
							</div>
							<div className="my-4">
								<MemberInput />
							</div>
							<div className="my-4">
								<MemberInput newMember />
							</div>
						</div>
						<div className="flex-center">
							<Button
								px="8"
								py="2"
								mt="5"
								rounded="0.5rem"
								backgroundColor="teal.500"
								color="white"
								onClick={() => {}}
								isLoading={false}
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

export default EditProfileModal;
