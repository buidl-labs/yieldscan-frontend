import { Avatar, AvatarGroup } from "@chakra-ui/core";

const LinkedValidatorsGroup = ({ validators = [] }) => {
	return (
		<div className="flex items-center">
			<span className="text-gray-700 text-xs mr-2 font-semibold">LINKED VALIDATORS</span>
			<AvatarGroup size="md" max={3}>
				{validators.map(validator => (
					<Avatar
						key={validator.stashId}
						name={validator.name}
					/>
				))}
			</AvatarGroup>
			{!validators.length && <span className="text-gray-700 text-xs mr-2 font-semibold">: 0</span>}
		</div>
	);
};

export default LinkedValidatorsGroup;
