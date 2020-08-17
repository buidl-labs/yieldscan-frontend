import { useState } from "react";
import { noop } from "lodash";
import { Edit2 } from "react-feather";
import { Switch, Select } from "@chakra-ui/core";
import CompoundRewardSlider from "@components/reward-calculator/CompoundRewardSlider";

const ValidatorsResult = ({
	stakingAmount,
	bondedAmount,
	compounding,
	timePeriodValue,
	timePeriodUnit,
	result = {},
	advancedMode = false,
	onTimePeriodValueChange = noop,
	onTimePeriodUnitChange = noop,
	onCompoundingChange = noop,
	onEditAmount = noop,
}) => {
	const [timePeriodEditable, setTimePeriodEditable] = useState(false);
	
	const {
		returns = {},
		yieldPercentage,
	} = result;
	
	return (
		<div className="flex justify-between items-center">
			<div className="flex flex-col">
				{advancedMode && (
					<span className="font-semibold text-sm text-gray-600">
						ADVANCED SELECTIONS
					</span>
				)}
				<span className="text-3xl font-bold">Validators</span>
			</div>
			<div className="flex">
				<div className="flex flex-col px-3 py-1 border border-gray-200 rounded-lg mr-2 h-20">
					<span className="text-sm text-teal-500 font-semibold mb-2">
						Staking Amount
					</span>
					<h3 className="flex justify-between items-center text-xl">
						{stakingAmount && <span className="mr-5">{stakingAmount} KSM</span>}
						{!stakingAmount && "-"}
						<Edit2
							size="20px"
							strokeWidth="2px"
							className="mb-1 cursor-pointer"
							onClick={onEditAmount}
						/>
					</h3>
					<span hidden className="text-gray-600 text-xs">
						${stakingAmount * 2}
					</span>
				</div>
				<div className="flex flex-col px-3 py-1 border border-gray-200 rounded-lg mr-2 h-20">
					<span className="text-sm text-teal-500 font-semibold mb-2">
						Time Period
					</span>
					{!timePeriodEditable && (
						<h3 className="flex justify-between items-center text-xl">
							{timePeriodValue ? (
								<span className="mr-5">
									{timePeriodValue || "-"} {timePeriodUnit}
								</span>
							) : (
								<span className="mr-5">-</span>
							)}
							<Edit2
								size="20px"
								strokeWidth="2px"
								className="mb-1 cursor-pointer"
								onClick={() => setTimePeriodEditable(true)}
							/>
						</h3>
					)}
					{timePeriodEditable && (
						<div className="flex">
							<input
								type="number"
								placeholder="12"
								className="w-16 rounded border border-gray-200 text-lg py-1 px-1 mr-2"
								value={timePeriodValue}
								onChange={({ target: { value } }) =>
									onTimePeriodValueChange(value === "" ? value : Number(value))
								}
							/>
							<Select
								backgroundColor="gray.100"
								rounded="full"
								alignSelf="center"
								height="2rem"
								fontSize="0.75rem"
								cursor="pointer"
								color="gray.500"
								border="none"
								value={timePeriodUnit}
								onChange={({ target: { value } }) =>
									onTimePeriodUnitChange(value)
								}
							>
								<option value="months">months</option>
								<option value="days">days</option>
								<option value="eras">eras</option>
							</Select>
						</div>
					)}
				</div>
				<div className="flex flex-col px-3 py-1 border border-gray-200 rounded-lg mr-2 h-20">
					<span className="text-sm text-teal-500 font-semibold mb-2">
						Expected Yield
					</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">
							{yieldPercentage ? `${yieldPercentage} %` : "-"}
						</span>
					</h3>
				</div>
				<div className="flex flex-col px-3 py-1 border border-gray-200 rounded-lg mr-2 h-20 w-32">
					<span className="text-sm text-teal-500 font-semibold mb-2">
						Compounding
					</span>
					<div className="py-1">
						<CompoundRewardSlider
							checked={compounding}
							setChecked={onCompoundingChange}
						/>
					</div>
				</div>
				<div className="flex flex-col px-3 py-1 bg-teal-500 shadow-teal text-white rounded-lg h-20">
					<span className="text-sm font-semibold mb-2">Expected Returns</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">
							{!returns.currency ? "-" : `${returns.currency} KSM`}
						</span>
					</h3>
					<span hidden className="text-gray-600 text-xs">
						${returns.subCurrency}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ValidatorsResult;
