import { set, cloneDeep } from "lodash";
import { Select, Input } from "@chakra-ui/core";

const FilterPanel = ({ filterOptions, setFilterOptions }) => {
	const onChange = (ev) => {
		const { name, value } = ev.target;
		set(filterOptions, name.split('.'), name === 'riskScore' ? value : Number(value));
		setFilterOptions(cloneDeep(filterOptions));
	};

	return (
		<div className="flex items-center rounded-lg">
			<div className="flex flex-col border rounded-l-lg px-4 py-2">
				<h1 className="text-gray-800 mb-1">Nominators</h1>
				<div className="flex">
					<Input
						name="numOfNominators.min"
						type="number"
						placeholder="min"
						width="4rem"
						onChange={onChange}
					/>
					<Input
						name="numOfNominators.max"
						type="number"
						placeholder="max"
						width="4rem"
						onChange={onChange}
					/>
				</div>
			</div>
			<div className="flex flex-col border px-4 py-2">
				<h1 className="text-gray-800 mb-1">Risk Score</h1>
				<div className="flex">
					<Select
						name="riskScore"
						onChange={onChange}
					>
						<option value="Low" selected>Low</option>
						<option value="Medium">Medium</option>
						<option value="High">High</option>
					</Select>
				</div>
			</div>
			<div className="flex flex-col border px-4 py-2">
				<h1 className="text-gray-800 mb-1">Own Stake</h1>
				<div className="flex">
					<Input
						placeholder="min"
						name="ownStake.min"
						type="number"
						width="8rem"
						onChange={onChange}
					/>
					<Input
						placeholder="max"
						name="ownStake.max"
						type="number"
						width="8rem"
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
						type="number"
						width="8rem"
						onChange={onChange}
					/>
					<Input
						placeholder="max"
						name="totalStake.max"
						type="number"
						width="8rem"
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
						type="number"
						onChange={onChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
