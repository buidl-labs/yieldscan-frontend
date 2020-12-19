import React from "react";
import { noop, get, isNil } from "lodash";
import formatCurrency from "@lib/format-currency";
import convertCurrency from "@lib/convert-currency";
import { useAccounts, usePolkadotApi, useNetworkElection } from "@lib/store";
import calculateReward from "@lib/calculate-reward";
import { HelpPopover } from "@components/reward-calculator";

const OverviewCards = ({
	stats,
	bondedAmount,
	activeStake,
	address,
	validators,
	unlockingBalances = [],
	openRewardDestinationModal = noop,
	bondFunds = noop,
	unbondFunds = noop,
	networkInfo,
}) => {
	const totalUnlockingBalance = formatCurrency.methods.formatAmount(
		Math.trunc(
			unlockingBalances.reduce(
				(total, balanceInfo) => total + balanceInfo.value,
				0
			)
		),
		networkInfo
	);

	const { apiInstance } = usePolkadotApi();
	const { stashAccount } = useAccounts();
	const { isInElection } = useNetworkElection();
	const [compounding, setCompounding] = React.useState(false);

	const isActivelyStaking = isNil(validators)
		? false
		: validators.filter((validator) => validator.isElected).length !== 0
		? true
		: false;

	const [totalAmountStakedFiat, setTotalAmountStakedFiat] = React.useState();
	const [earningsFiat, setEarningsFiat] = React.useState();
	const [estimatedRewardsFiat, setEstimatedRewardsFiat] = React.useState();
	const [expectedAPR, setExpectedAPR] = React.useState(0);

	React.useEffect(() => {
		if (!isNil(apiInstance)) {
			apiInstance.query.staking.payee(stashAccount.address).then((payee) => {
				if (payee.isStaked) setCompounding(true);
				else {
					setCompounding(false);
				}
			});
		}
	}, [stashAccount, apiInstance]);
	React.useEffect(() => {
		if (stats) {
			convertCurrency(
				stats.totalAmountStaked,
				networkInfo.denom
			).then((value) => setTotalAmountStakedFiat(value));
		}

		if (stats) {
			convertCurrency(stats.estimatedRewards, networkInfo.denom).then((value) =>
				setEstimatedRewardsFiat(value)
			);
		}

		if (validators) {
			calculateReward(
				validators.filter((validator) => validator.isElected),
				stats.totalAmountStaked,
				12,
				"months",
				compounding,
				networkInfo
			).then(({ yieldPercentage }) => setExpectedAPR(yieldPercentage));
		}

		if (stats) {
			convertCurrency(stats.earnings, networkInfo.denom).then((value) =>
				setEarningsFiat(value)
			);
		}
	}, [stats, compounding]);

	return (
		<div className="flex justify-between items-center h-auto w-full max-w-lg text-gray-700">
			<div className="bg-white min-h-12-rem py-4 px-8 text-center flex flex-col justify-center shadow-custom rounded-xl h-full w-full">
				<div className="flex flex-col items-center justify-between">
					<p className="font-medium mt-40">Your investment</p>
					<div>
						<div className="flex">
							<h1
								className={`text-4xl font-bold ${
									isActivelyStaking ? "text-gray-700" : "text-gray-600"
								}`}
							>
								{formatCurrency.methods.formatAmount(
									Math.trunc(
										Number(
											get(bondedAmount, "currency", 0) *
												10 ** networkInfo.decimalPlaces
										)
									),
									networkInfo
								)}
							</h1>
							{!isActivelyStaking && (
								<HelpPopover
									content={
										<p className="text-xs text-white">
											Currently you are not earning any rewards on your
											investment.
										</p>
									}
								/>
							)}
						</div>
						{bondedAmount && (
							<h3 className="text-teal-500 text-xl font-medium">
								$
								{formatCurrency.methods.formatNumber(
									get(bondedAmount, "subCurrency").toFixed(2)
								)}
							</h3>
						)}
					</div>
					<div className="flex">
						<button
							className={`confirm rounded-lg mt-40 mb-40 text-white bg-teal-500 p-1 ${
								isInElection ? "opacity-75 cursor-not-allowed" : "opacity-100"
							}`}
							onClick={bondFunds}
							disabled={isInElection}
						>
							Invest more
						</button>

						<button
							className={`confirm rounded-lg mt-40 mb-40 border-teal border-solid-1 bg-white text-teal-500 p-1 ${
								isInElection ? "opacity-75 cursor-not-allowed" : "opacity-100"
							}`}
							onClick={unbondFunds}
							disabled={isInElection}
						>
							Withdraw
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCards;
