import { useState } from "react";
import { noop } from "lodash";
import { Edit2 } from "react-feather";
import { Switch } from "@chakra-ui/core";
import CompoundRewardSlider from "@components/reward-calculator/CompoundRewardSlider";

const ValidatorsResult = ({
	stakingAmount,
	bondedAmount,
	compounding,
	timePeriodValue,
	timePeriodUnit,
	result = {},
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
		<div className="flex justify-around items-center">
			<h1 className="text-3xl">Validators</h1>
			<div className="flex">
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Staking Amount</span>
					<h3 className="flex justify-between items-center text-xl">
						{stakingAmount && <span className="mr-5">{stakingAmount} KSM</span>}
						{!stakingAmount && '-'}
						<Edit2 size="20px" strokeWidth="2px" className="mb-1 cursor-pointer" onClick={onEditAmount} />
					</h3>
					<span hidden className="text-gray-600 text-xs">${stakingAmount * 2}</span>
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Time Period</span>
					{!timePeriodEditable && (
						<h3 className="flex justify-between items-center text-xl">
							{timePeriodValue ? (
								<span className="mr-5">
									{timePeriodValue || '-'} {timePeriodUnit}
								</span>
							) : (
								<span className="mr-5">-</span>
							)}
							<Edit2 size="20px" strokeWidth="2px" className="mb-1 cursor-pointer" onClick={() => setTimePeriodEditable(true)} />
						</h3>
					)}
					{timePeriodEditable && (
						<div>
							<input
								type="number"
								placeholder="Duration"
								className="w-24 outline-none text-lg"
								value={timePeriodValue}
								onChange={({ target: { value }}) => onTimePeriodValueChange(value === '' ? value : Number(value))}
							/>
							<select
								value={timePeriodUnit}
								onChange={({ target: { value }}) => onTimePeriodUnitChange(value === '' ? value : Number(value))}
							>
								<option value="months">months</option>
								<option value="days">days</option>
								<option value="eras">eras</option>
							</select>
						</div>
					)}
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Expected Yield</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">
							{yieldPercentage ? `${yieldPercentage} %` : '-'}
						</span>
					</h3>
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16 w-32">
					<span className="text-sm text-teal-500">Compounding</span>
					<div className="py-1">
						<CompoundRewardSlider checked={compounding} setChecked={onCompoundingChange} />
					</div>
				</div>
				<div className="flex flex-col px-3 py-1 bg-teal-500 text-white rounded-lg h-16">
					<span className="text-sm">Expected Returns</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">
							{!returns.currency ? '-' : `${returns.currency} KSM`}
						</span>
					</h3>
					<span hidden className="text-gray-600 text-xs">${returns.subCurrency}</span>
				</div>
			</div>
		</div>
	);
};

export default ValidatorsResult;
