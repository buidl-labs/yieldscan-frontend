import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Avatar,
	Input,
	Button,
	InputLeftElement,
	InputGroup,
	Icon,
	useToast
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import { Twitter, Feather } from "react-feather";
import { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import axios from "@lib/axios";

const MemberInput = ({ memberInfo = {}, onAdd, onRemove, onUpdate, newMember }) => {
	const [name, setName] = useState(memberInfo.name || '');
	const [twitter, setTwitter] = useState(memberInfo.twitter || '');

	useEffect(() => {
		if (!newMember) onUpdate({ name, twitter });
	}, [name, twitter]);

	const onAddMember = () => {
		onAdd({ name, twitter });
		setName('');
		setTwitter('');
	};

	return (
		<div className="flex items-center justify-between px-5 py-2 border border-gray-200 rounded-lg">
			<Avatar size="sm" />
			<InputGroup width="30%">
				<InputLeftElement children={<Feather className="text-gray-300" />} />
				<Input
					value={name}
					onChange={ev => setName(ev.target.value)}
					placeholder="Name"
					_focus={{ outline: 'none' }}
				/>
			</InputGroup>
			<InputGroup width="30%">
				<InputLeftElement children={<Twitter className="text-gray-300" />} />
				<Input
					value={twitter}
					onChange={ev => setTwitter(ev.target.value)}
					placeholder="Twitter"
					_focus={{ outline: 'none' }}
				/>
			</InputGroup>
			{newMember ? (
				<Button
					leftIcon="add"
					variantColor="teal"
					variant="outline"
					onClick={() => onAddMember()}
					_focus={{outline:'none'}}
				>
					Add New
				</Button>
			) : (
				<Button
					leftIcon="delete"
					variantColor="red"
					variant="outline"
					onClick={() => onRemove()}
					_focus={{outline:'none'}}
				>
					Remove
				</Button>
			)}
		</div>
	);
};

const EditProfileModal = withSlideIn(({
	stashId,
	socialInfo,
	vision,
	members,
	styles,
	onClose,
}) => {
	const toast = useToast();
	const [newMembers, setMembers] = useState(members || []);
	const [newVision, setVision] = useState(vision || '');
	const [updating, setUpdating] = useState(false);

	const updateMember = (memberIndex, memberInfo) => {
		const members = cloneDeep(newMembers);
		members.splice(memberIndex, 1, memberInfo);
		setMembers(members);
	};

	const addMember = (member) => {
		const members = cloneDeep(newMembers);
		members.push(member);
		setMembers(members);
	};

	const removeMember = (memberIndex) => {
		const members = cloneDeep(newMembers);
		members.splice(memberIndex, 1);
		setMembers(members);
	};

	const updateProfile = () => {
		setUpdating(true);
		axios.put(
			`/validator/${stashId}/update`,
			{ members: newMembers, vision: newVision },
		).then(({ data }) => {
			if (data.status === 200) {
				toast({
					title: 'Success',
					description: 'Profile updated!',
					duration: 2000,
					status: 'success'
				});
				onClose();
			}
		}).catch((error) => {
			toast({
				title: 'Error!',
				description: 'Something went wrong!',
				duration: 2000,
				status: 'error'
			});
		}).finally(() => {
			setUpdating(false);
		});
	};

	return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="70vw" height="85vh" {...styles}>
				<ModalHeader>
					<h3 className="text-gray-700 font-semibold text-xs">Manage Profile</h3>
					<div className="flex">
					{false && <img src="http://placehold.it/300" className="w-16 h-16 mr-5 rounded-full" />}
					<div className="flex flex-col">
						<h3 className="text-2xl text-gray-700 font-semibold">{socialInfo.name}</h3>
						<p className="text-gray-600 text-sm">{stashId}</p>
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
								value={newVision}
								className="w-full p-2 outline-none border border-gray-400 text-gray-600 rounded-lg"
								placeholder="Enter description about your validator here"
								onChange={ev => setVision(ev.target.value)}
							/>
						</div>
						<div className="mt-5">
							<h5 className="text-gray-600 mb-2 font-bold text-lg">Team Members</h5>
							{newMembers.map((member, index) => (
								<div key={member.name} className="my-4">
									<MemberInput
										memberInfo={member}
										onUpdate={(newInfo) => updateMember(index, newInfo)}
										onRemove={() => removeMember(index)}
									/>
								</div>
							))}
							<div className="my-4">
								<MemberInput
									onAdd={newMember => addMember(newMember)}
									newMember
								/>
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
								onClick={updateProfile}
								isLoading={updating}
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
