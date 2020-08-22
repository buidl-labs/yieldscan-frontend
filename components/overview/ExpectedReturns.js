import React from "react";
import convertCurrency from "@lib/convert-currency";
import formatCurrency from "@lib/format-currency";
import calculateReward from "@lib/calculate-reward";
import { usePolkadotApi, useAccounts } from "@lib/store";
import { ChevronDown } from "react-feather";
import { Popover, PopoverTrigger, PopoverContent, Alert, AlertIcon } from "@chakra-ui/core";
import CountUp from "react-countup";

const ExpectedReturns = ({ stats, validators }) => {
	const { apiInstance } = usePolkadotApi();
	const { stashAccount } = useAccounts();
	const [result, setResult] = React.useState({});
	const [timePeriodValue, setTimePeriodValue] = React.useState(12);
	const [timePeriodUnit, setTimePeriodUnit] = React.useState("months");
	const [_timePeriodUnit, _setTimePeriodUnit] = React.useState("yearly");
	const [compounding, setCompounding] = React.useState(false);
	const [isTimePeriodOpen, setIsTimePeriodOpen] = React.useState(false);

	const _calculateReward = (_timePeriodValue, _timePeriodUnit) => {
		if (validators && stats.totalAmountStaked) {
			calculateReward(
				validators.filter((validator) => validator.isElected),
				stats.totalAmountStaked,
				_timePeriodValue,
				_timePeriodUnit,
				compounding,
				0
			).then((result) => setResult(result));
		}
	};

	React.useEffect(() => {
		apiInstance.query.staking.payee(stashAccount.address).then((payee) => {
			if (payee.isStaked) setCompounding(true);
			else {
				setCompounding(false);
			}
		});
	}, [stashAccount]);

	React.useEffect(() => {
		if (validators && stats.totalAmountStaked) {
			calculateReward(
				validators.filter((validator) => validator.isElected),
				stats.totalAmountStaked,
				timePeriodValue,
				timePeriodUnit,
				compounding,
				0
			).then((result) => setResult(result));
		}
	}, [stats, validators, timePeriodUnit, compounding]);

	return (
		<React.Fragment>
			<div className="flex justify-between">
				<h3 className="text-2xl">Expected Results</h3>
				<Popover
					isOpen={isTimePeriodOpen}
					onClose={() => setIsTimePeriodOpen(false)}
					onOpen={() => setIsTimePeriodOpen(true)}
				>
					<PopoverTrigger>
						<button className="bg-gray-200 flex items-center rounded-full px-4">
							{_timePeriodUnit} <ChevronDown size="20px" />
						</button>
					</PopoverTrigger>
					<PopoverContent
						zIndex={50}
						maxWidth="20rem"
						backgroundColor="gray.700"
						border="none"
					>
						<div className="flex flex-col justify-center my-2 text-white w-full">
							<button
								className="flex items-center rounded px-4 py-2 w-full bg-gray-800 hover:bg-gray-700 hover:text-gray-200"
								onClick={() => {
									_setTimePeriodUnit("yearly");
									setTimePeriodUnit("months");
									setTimePeriodValue(12);
									_calculateReward(12, "months");
									setIsTimePeriodOpen(false);
								}}
							>
								yearly
							</button>
							<button
								className="flex items-center rounded px-4 py-2 w-full bg-gray-800 hover:bg-gray-700 hover:text-gray-200"
								onClick={() => {
									_setTimePeriodUnit("monthly");
									setTimePeriodUnit("months");
									setTimePeriodValue(1);
									_calculateReward(1, "months");
									setIsTimePeriodOpen(false);
								}}
							>
								monthly
							</button>
							<button
								className="flex items-center rounded px-4 py-2 w-full bg-gray-800 hover:bg-gray-700 hover:text-gray-200"
								onClick={() => {
									_setTimePeriodUnit("daily");
									setTimePeriodUnit("days");
									setTimePeriodValue(1);
									_calculateReward(1, "days");
									setIsTimePeriodOpen(false);
								}}
							>
								daily
							</button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<hr className="border border-gray-200 my-4" />
			<div className="mt-4">
				<div>
					{result.returns && (
						<React.Fragment>
							<Alert status="info" rounded="1rem" mb={8}>
								<AlertIcon />
								<span className="text-blue-600">
									These returns are calculated for the active nominations only
								</span>
							</Alert>
							<h3 className="text-gray-600 text-lg">Estimated Returns</h3>
							<h1 className="text-3xl text-gray-900 font-semibold">
								{formatCurrency.methods.formatAmount(
									Math.trunc(Number(result.returns.currency || 0) * 10 ** 12)
								)}
							</h1>
							{/* {estimatedRewardsFiat && ( */}
							<h3 className="text-gray-500">
								$
								{/* {formatCurrency.methods.formatNumber(
								estimatedRewardsFiat.toFixed(2)
							) || 0.0} */}
								{result.returns.subCurrency.toFixed(2)}
							</h3>
						</React.Fragment>
					)}
				</div>
				{result.yieldPercentage && (
					<div className="mt-8">
						<h3 className="text-gray-600 text-lg">Estimated Yield</h3>
						<h1 className="text-3xl text-gray-900 font-semibold">
							<CountUp
								end={result.yieldPercentage}
								duration={0.5}
								decimals={2}
								suffix="%"
								preserveValue
							/>
						</h1>
					</div>
				)}
			</div>
		</React.Fragment>
	);
};

export default ExpectedReturns;
