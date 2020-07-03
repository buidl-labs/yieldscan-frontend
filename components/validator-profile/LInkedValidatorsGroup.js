import { Avatar, AvatarGroup } from "@chakra-ui/core";

const LinkedValidatorsGroup = () => {
	return (
		<div className="flex items-center">
			<span className="text-gray-700 text-xs mr-2 font-semibold">LINKED VALIDATORS</span>
			<AvatarGroup size="md" max={3}>
				<Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
				<Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
				<Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
				<Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
				<Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
			</AvatarGroup>
		</div>
	);
};

export default LinkedValidatorsGroup;
