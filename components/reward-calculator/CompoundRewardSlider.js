import { Switch } from '@chakra-ui/core';

const CompoundRewardSlider = ({ checked, setChecked }) => {
	return (
		<div className="flex">
			<Switch
				size="lg"
				color="teal"
				isChecked={checked}
				onChange={e => setChecked(e.target.checked)}
			/>
			<span
				className={`
					text-lg font-semibold ml-5
					${checked ? 'text-teal-500' : 'text-gray-600'}
				`}
			>
				{checked ? 'Yes' : 'No'}
			</span>
		</div>
	);
};

export default CompoundRewardSlider;