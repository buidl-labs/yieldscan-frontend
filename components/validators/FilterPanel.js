import { set, cloneDeep, get } from "lodash";
import { Select, Input } from "@chakra-ui/core";
import { Percent } from "react-feather";

const FilterPanel = ({ filterOptions, setFilterOptions }) => {
	const onChange = (ev) => {
		const { name, value } = ev.target;
		if (name !== "riskScore" && isNaN(Number(value))) return;
		set(
			filterOptions,
			name.split("."),
			name === "riskScore" ? value : value === "" ? "" : Number(value)
		);
		setFilterOptions(cloneDeep(filterOptions));
	};

	return (
		<div className="flex items-inherit rounded-lg">
			<div className="flex flex-col border border-gray-200 rounded-l-lg px-4 py-2">
				<h1 className="text-gray-900 mb-1">Nominators</h1>
				<div className="flex">
					<label
						htmlFor="numOfNominators.min"
						className="absolute ml-2 mt-1 z-10 tracking-widest text-xxs font-semibold"
					>
						MIN
					</label>
					<Input
						name="numOfNominators.min"
						placeholder="min"
						width="5rem"
						pt={4}
						pl={2}
						height="3rem"
						value={get(filterOptions, "numOfNominators.min")}
						onChange={onChange}
					/>
					<span className="self-center mx-2">-</span>
					<span>
						<label
							htmlFor="numOfNominators.max"
							className="absolute ml-2 mt-1 z-10 tracking-widest text-xxs font-semibold"
						>
							MAX
						</label>
						<Input
							name="numOfNominators.max"
							placeholder="max"
							width="5rem"
							pl={2}
							pt={4}
							height="3rem"
							value={get(filterOptions, "numOfNominators.max")}
							onChange={onChange}
						/>
					</span>
				</div>
			</div>
			<div className="flex flex-col border border-gray-200 px-4 py-2">
				<h1 className="text-gray-900 mb-1">Risk Level</h1>
				<div className="flex">
					<Select
						name="riskScore"
						height="3rem"
						rounded="full"
						defaultValue={get(filterOptions, "riskScore")}
						placeholder="All"
						onChange={onChange}
					>
						{["Low", "Medium", "High"].map((option) => (
							<option key={option} value={option}>
								Upto {option}
							</option>
						))}
					</Select>
				</div>
			</div>
			<div className="flex flex-col border border-gray-200 px-4 py-2">
				<h1 className="text-gray-900 mb-1">Own Stake</h1>
				<div className="flex">
					<label
						htmlFor="ownStake.min"
						className="absolute ml-2 mt-1 z-10 tracking-widest text-xxs font-semibold"
					>
						MIN
					</label>
					<Input
						placeholder="min"
						name="ownStake.min"
						width="6rem"
						pt={4}
						pl={2}
						height="3rem"
						value={get(filterOptions, "ownStake.min")}
						onChange={onChange}
					/>
					<span className="self-center mx-2">-</span>
					<span>
						<label
							htmlFor="ownStake.max"
							className="absolute ml-2 mt-1 z-10 tracking-widest text-xxs font-semibold"
						>
							MAX
						</label>
						<Input
							placeholder="max"
							name="ownStake.max"
							width="6rem"
							pt={4}
							pl={2}
							height="3rem"
							value={get(filterOptions, "ownStake.max")}
							onChange={onChange}
						/>
					</span>
				</div>
			</div>
			<div className="flex flex-col border border-gray-200 px-4 py-2">
				<h1 className="text-gray-900 mb-1">Other Stake</h1>
				<div className="flex">
					<label
						htmlFor="totalStake.min"
						className="absolute ml-2 mt-1 z-10 tracking-widest text-xxs font-semibold"
					>
						MIN
					</label>
					<Input
						placeholder="min"
						name="totalStake.min"
						width="8rem"
						pt={4}
						pl={2}
						height="3rem"
						value={get(filterOptions, "totalStake.min")}
						onChange={onChange}
					/>
					<span className="self-center mx-2">-</span>
					<span>
						<label
							htmlFor="totalStake.max"
							className="absolute ml-2 mt-1 z-10 tracking-widest text-xxs font-semibold"
						>
							MAX
						</label>
						<Input
							placeholder="max"
							name="totalStake.max"
							width="8rem"
							pt={4}
							pl={2}
							height="3rem"
							value={get(filterOptions, "totalStake.max")}
							onChange={onChange}
						/>
					</span>
				</div>
			</div>
			<div className="flex flex-col border border-gray-200 rounded-r-lg px-4 py-2">
				<h1 className="text-gray-900 mb-1">Max Commission</h1>
				<div className="flex">
					<label
						htmlFor="commission"
						className="absolute ml-2 mt-1 z-10 tracking-widest text-xxs font-semibold"
					>
						MAX
					</label>
					<Input
						name="commission"
						placeholder="100"
						width="5rem"
						pt={4}
						pl={2}
						height="3rem"
						value={get(filterOptions, "commission")}
						onChange={onChange}
					/>
					<span className="text-gray-600 self-center ml-2">%</span>
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
