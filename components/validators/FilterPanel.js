const { Select, Input } = require("@chakra-ui/core")

const FilterPanel = () => {
	return (
		<div className="flex items-center rounded-lg">
			<div className="flex flex-col border rounded-l-lg px-4 py-2">
				<h1 className="text-gray-800 mb-1">Nominators</h1>
				<div className="flex">
					<Input placeholder="min" width="4rem" />
					<Input placeholder="max" width="4rem" />
				</div>
			</div>
			<div className="flex flex-col border px-4 py-2">
				<h1 className="text-gray-800 mb-1">Risk Score</h1>
				<div className="flex">
					<Select
						defaultValue="Low"
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
					<Input placeholder="min" width="8rem" />
					<Input placeholder="max" width="8rem" />
				</div>
			</div>
			<div className="flex flex-col border px-4 py-2">
				<h1 className="text-gray-800 mb-1">Other Stake</h1>
				<div className="flex">
					<Input placeholder="min" width="8rem" />
					<Input placeholder="max" width="8rem" />
				</div>
			</div>
			<div className="flex flex-col border rounded-r-lg px-4 py-2">
				<h1 className="text-gray-800 mb-1">Commission</h1>
				<div className="flex">
					<Input placeholder="%" width="4rem" />
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
