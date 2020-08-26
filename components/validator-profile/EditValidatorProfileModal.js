import { Input, Button, InputGroup, useToast } from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import { MinusCircle, ChevronLeft } from "react-feather";
import { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import axios from "@lib/axios";
import Identicon from "@components/common/Identicon";
import LimitedTextarea from "./LimitedTextArea";

const MemberInput = ({
	memberInfo = {},
	onAdd,
	onRemove,
	onUpdate,
	newMember,
}) => {
	const [name, setName] = useState(memberInfo.member || "");
	const [twitter, setTwitter] = useState(memberInfo.twitter || "");

	useEffect(() => {
		if (!newMember) onUpdate({ member: name, twitter });
	}, [name, twitter]);

	const onAddMember = () => {
		onAdd({ member: name, twitter });
		setName("");
		setTwitter("");
	};

	return (
		<React.Fragment>
			<div className="flex items-center justify-between px-5 py-2 border border-gray-200 rounded-lg">
				{/* <Avatar size="sm" /> */}
				<InputGroup flex flexDirection="column" width="-webkit-fill-available">
					<label className="text-sm mb-2">Member Name</label>
					<Input
						value={name}
						onChange={(ev) => setName(ev.target.value)}
						placeholder="Name"
						isRequired
						_focus={{ outline: "none" }}
						isDisabled={!newMember}
					/>
				</InputGroup>
				{newMember ? (
					<InputGroup
						flex
						flexDirection="column"
						width="-webkit-fill-available"
						ml={4}
					>
						<React.Fragment>
							<label className="text-sm mb-2">Twitter</label>
							<Input
								value={twitter}
								onChange={(ev) => setTwitter(ev.target.value)}
								placeholder="Twitter"
								_focus={{ outline: "none" }}
							/>
						</React.Fragment>
					</InputGroup>
				) : (
					twitter && (
						<InputGroup
							flex
							flexDirection="column"
							width="-webkit-fill-available"
							mx={4}
						>
							<React.Fragment>
								<label className="text-sm mb-2">Twitter</label>
								<Input
									value={twitter}
									onChange={(ev) => setTwitter(ev.target.value)}
									placeholder="Twitter"
									_focus={{ outline: "none" }}
									isDisabled
								/>
							</React.Fragment>
						</InputGroup>
					)
				)}

				{!newMember && (
					<button className="mt-6 ml-2" onClick={() => onRemove()}>
						<MinusCircle color="red" />
					</button>
				)}
			</div>
			{newMember && name && (
				<div className="w-full flex justify-end">
					<button
						className="text-gray-900 rounded-full border border-gray-500 mt-4 px-4 py-2 font-normal"
						onClick={() => onAddMember()}
						isDisabled={!name}
					>
						Add Member
					</button>
				</div>
			)}
		</React.Fragment>
	);
};

const EditProfileModal = withSlideIn(
	({
		stashId,
		socialInfo,
		vision,
		members,
		transparencyScore,
		onSuccess,
		styles,
		goBack,
		toggleScoreModal,
	}) => {
		const toast = useToast();
		const [newMembers, setMembers] = useState(members || []);
		const [newVision, setVision] = useState(vision || "");
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
			axios
				.put(`/validator/${stashId}/update`, {
					members: newMembers,
					vision: newVision,
				})
				.then(({ data }) => {
					if (data.status === 200) {
						toast({
							title: "Success",
							description: "Profile updated!",
							duration: 2000,
							status: "success",
							position: "top-right",
						});
						onClose();
						onSuccess();
					}
				})
				.catch((error) => {
					toast({
						title: "Error!",
						description: "Something went wrong!",
						duration: 2000,
						status: "error",
						position: "top-right",
					});
				})
				.finally(() => {
					setUpdating(false);
				});
		};

		return (
			<>
				<button
					onClick={goBack}
					className="flex bg-gray-200 rounded-full pl-2 pr-4 py-2 -mt-12 mb-8"
				>
					<ChevronLeft /> <span>Back</span>
				</button>
				<div className="flex justify-between">
					<div className="flex px-4">
						<div className="mr-4">
							<Identicon address={stashId} size="4rem" />
						</div>
						<div className="flex flex-col">
							<h3 className="text-gray-900 font-semibold tracking-widest text-sm">
								MANAGE PROFILE
							</h3>
							<h3 className="text-xl text-gray-900 font-semibold">
								{socialInfo.name ||
									stashId.slice(0, 6) + "..." + stashId.slice(-6) ||
									"-"}
							</h3>
							<p className="text-gray-600 font-normal text-xs">{stashId}</p>
						</div>
					</div>
					<div className="flex">
						<button
							className="text-sm text-gray-600 mr-2"
							onClick={toggleScoreModal}
						>
							Improve your score?
						</button>
						<button
							className="flex border border-gray-200 rounded-lg items-center pl-2 pr-6 py-2"
							onClick={toggleScoreModal}
						>
							<div className="mr-2 border border-gray-200 rounded-md">
								<img src="/images/badges/gray-badge.svg" />
							</div>
							<div className="-mt-2">
								<label className="text-teal-500 text-xs font-medium">
									Transparency Score
								</label>
								<h3 className="-mt-1">{transparencyScore.total} PTS</h3>
							</div>
						</button>
					</div>
				</div>
				<div className="px-4 mt-12">
					<div>
						<h5 className="text-gray-900 mb-2 font-normail text-base">
							Description
						</h5>
						<LimitedTextarea
							rows={3}
							value={newVision}
							limit={1000}
							className="w-full px-8 py-4 outline-none text-gray-600 font-normal text-sm"
							placeholder="Enter description about your validator here"
							setVision={setVision}
						/>
					</div>
					<div className="mt-8">
						<h5 className="text-gray-900 mb-2 font-normail text-base">
							Team Members
						</h5>
						{newMembers.map((member, index) => (
							<div key={index} className="my-4">
								<MemberInput
									memberInfo={member}
									onUpdate={(newInfo) => updateMember(index, newInfo)}
									onRemove={() => removeMember(member)}
								/>
							</div>
						))}
						<div className="my-4">
							<MemberInput
								onAdd={(newMember) => addMember(newMember)}
								newMember
							/>
						</div>
					</div>
					<div className="flex-center">
						<Button
							px="8"
							py="4"
							mt="5"
							rounded="0.5rem"
							backgroundColor="teal.500"
							color="white"
							fontWeight="normal"
							onClick={updateProfile}
							isLoading={updating}
						>
							Save Changes
						</Button>
					</div>
				</div>
			</>
		);
	}
);

export default EditProfileModal;
