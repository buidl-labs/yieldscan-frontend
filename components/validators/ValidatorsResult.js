import { useState } from "react";
import { get, noop } from "lodash";
import { Edit2 } from "react-feather";
import TimePeriodInput from "@components/reward-calculator/TimePeriodInput";

const ValidatorsResult = ({
	stakingAmount,
	bondedAmount,
	timePeriodValue,
	timePeriodUnit,
	result = {},
	onTimePeriodValueChange = noop,
	onTimePeriodUnitChange = noop,
	onEditAmount = noop,
}) => {
	const [timePeriodEditable, setTimePeriodEditable] = useState(false);
	
	const {
		returns = {},
		yieldPercentage,
	} = result;

	const estimatedPortfolio = {
		currency: Number(returns.currency + stakingAmount + get(bondedAmount, 'currency', 0)).toFixed(3),
		subCurrency: Number(returns.currency + stakingAmount + get(bondedAmount, 'subCurrency', 0)).toFixed(3),
	};

	return (
		<div className="flex justify-around items-center">
			<h1 className="text-3xl">Validators</h1>
			<div className="flex">
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Staking Amount</span>
					<h3 className="flex justify-between items-center text-xl">
						<span className="mr-5">{stakingAmount} KSM</span>
						<Edit2 size="20px" strokeWidth="2px" className="mb-1 cursor-pointer" onClick={onEditAmount} />
					</h3>
					<span hidden className="text-gray-600 text-xs">${stakingAmount * 2}</span>
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Time Period</span>
					{!timePeriodEditable && (
						<h3 className="flex justify-between items-center text-xl">
							<span className="mr-5">{timePeriodValue} {timePeriodUnit}</span>
							<Edit2 size="20px" strokeWidth="2px" className="mb-1 cursor-pointer" onClick={() => setTimePeriodEditable(true)} />
						</h3>
					)}
					{timePeriodEditable && (
						<TimePeriodInput
							value={timePeriodValue}
							unit={timePeriodUnit}
							onChange={onTimePeriodValueChange}
							onUnitChange={onTimePeriodUnitChange}
						/>
					)}
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Expected Yield</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">{yieldPercentage}%</span>
					</h3>
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Estimated Portfolio Value</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">
							{estimatedPortfolio.currency} KSM
						</span>
					</h3>
					<span hidden className="text-gray-600 text-xs">
						${estimatedPortfolio.subCurrency}
					</span>
				</div>
				<div className="flex flex-col px-3 py-1 bg-teal-500 text-white rounded-lg h-16">
					<span className="text-sm">Expected Returns</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">{returns.currency} KSM</span>
					</h3>
					<span hidden className="text-gray-600 text-xs">${returns.subCurrency}</span>
				</div>
			</div>
		</div>
	);
};

export default ValidatorsResult;
