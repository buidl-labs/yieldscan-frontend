import { set, cloneDeep, get } from "lodash";
import { Select, Input } from "@chakra-ui/core";

const FilterPanel = ({ filterOptions, setFilterOptions }) => {
	const onChange = (ev) => {
		const { name, value } = ev.target;
		if (name !== 'riskScore' && isNaN(Number(value))) return;
		set(filterOptions, name.split('.'), name === 'riskScore' ? value : (value === '' ? '' : Number(value)));
		setFilterOptions(cloneDeep(filterOptions));
	};

	return (
		<div className="flex items-center rounded-lg">
			<div className="flex flex-col border rounded-l-lg px-4 py-2">
				<h1 className="text-gray-800 mb-1">Nominators</h1>
				<div className="flex">
					<Input
						name="numOfNominators.min"
						placeholder="min"
						width="6rem"
						value={get(filterOptions, 'numOfNominators.min')}
						onChange={onChange}
					/>
					<Input
						name="numOfNominators.max"
						placeholder="max"
						width="6rem"
						value={get(filterOptions, 'numOfNominators.max')}
						onChange={onChange}
					/>
				</div>
			</div>
			<div className="flex flex-col border px-4 py-2">
				<h1 className="text-gray-800 mb-1">Risk Score</h1>
				<div className="flex">
					<Select
						name="riskScore"
						defaultValue={get(filterOptions, 'riskScore')}
						placeholder="Select Risk"
						onChange={onChange}
					>
						{['Low', 'Medium', 'High'].map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</Select>
				</div>
			</div>
			<div className="flex flex-col border px-4 py-2">
				<h1 className="text-gray-800 mb-1">Own Stake</h1>
				<div className="flex">
					<Input
						placeholder="min"
						name="ownStake.min"
						width="8rem"
						value={get(filterOptions, 'ownStake.min')}
						onChange={onChange}
					/>
					<Input
						placeholder="max"
						name="ownStake.max"
						width="8rem"
						value={get(filterOptions, 'ownStake.max')}
						onChange={onChange}
					/>
				</div>
			</div>
			<div className="flex flex-col border px-4 py-2">
				<h1 className="text-gray-800 mb-1">Other Stake</h1>
				<div className="flex">
					<Input
						placeholder="min"
						name="totalStake.min"
						width="8rem"
						value={get(filterOptions, 'totalStake.min')}
						onChange={onChange}
					/>
					<Input
						placeholder="max"
						name="totalStake.max"
						width="8rem"
						value={get(filterOptions, 'totalStake.max')}
						onChange={onChange}
					/>
				</div>
			</div>
			<div className="flex flex-col border rounded-r-lg px-4 py-2">
				<h1 className="text-gray-800 mb-1">Max Commission</h1>
				<div className="flex">
					<Input
						name="commission"
						placeholder="%"
						width="4rem"
						value={get(filterOptions, 'commission')}
						onChange={onChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
