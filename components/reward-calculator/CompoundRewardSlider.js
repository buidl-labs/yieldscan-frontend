import { Switch } from "@chakra-ui/core";

const CompoundRewardSlider = ({
	checked,
	setChecked,
	trackRewardCalculatedEvent,
}) => {
	return (
		<div className="flex items-center">
			<Switch
				mb={-1}
				color="teal"
				isChecked={checked}
				onChange={(e) => {
					setChecked(e.target.checked);
					trackRewardCalculatedEvent({ compounding: e.target.checked });
				}}
			/>
			<span
				className={`
					text-sm font-semibold ml-2
					${checked ? 'text-teal-500' : 'text-gray-600'}
				`}
			>
				{checked ? "Yes" : "No"}
			</span>
		</div>
	);
};

export default CompoundRewardSlider;
