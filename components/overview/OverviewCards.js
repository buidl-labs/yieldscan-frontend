import { noop, get } from "lodash";
import { Plus, Minus, Clock } from "react-feather";
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/core";
import formatCurrency from "@lib/format-currency";
import convertCurrency from "@lib/convert-currency";
import { useAccounts, usePolkadotApi } from "@lib/store";
import calculateReward from "@lib/calculate-reward";

const OverviewCards = ({
	stats,
	bondedAmount,
	activeStake,
	validators,
	unlockingBalances = [],
	openRewardDestinationModal = noop,
	bondFunds = noop,
	unbondFunds = noop,
	networkInfo,
}) => {
	const totalUnlockingBalance = formatCurrency.methods.formatAmount(
		unlockingBalances.reduce(
			(total, balanceInfo) => total + balanceInfo.value,
			0
		),
		networkInfo
	);

	const { apiInstance } = usePolkadotApi();
	const { stashAccount } = useAccounts();
	const [compounding, setCompounding] = React.useState(false);

	const [totalAmountStakedFiat, setTotalAmountStakedFiat] = React.useState();
	const [earningsFiat, setEarningsFiat] = React.useState();
	const [estimatedRewardsFiat, setEstimatedRewardsFiat] = React.useState();
	const [expectedAPR, setExpectedAPR] = React.useState(0);

	React.useEffect(() => {
		apiInstance.query.staking.payee(stashAccount.address).then((payee) => {
			if (payee.isStaked) setCompounding(true);
			else {
				setCompounding(false);
			}
		});
	}, [stashAccount]);
	React.useEffect(() => {
		if (stats.totalAmountStaked) {
			convertCurrency(
				stats.totalAmountStaked,
				networkInfo.denom
			).then((value) => setTotalAmountStakedFiat(value));
		}

		if (stats.estimatedRewards) {
			convertCurrency(stats.estimatedRewards, networkInfo.denom).then((value) =>
				setEstimatedRewardsFiat(value)
			);
		}

		if (validators && stats.totalAmountStaked) {
			calculateReward(
				validators.filter((validator) => validator.isElected),
				stats.totalAmountStaked,
				12,
				"months",
				compounding,
				0
			).then(({ yieldPercentage }) => setExpectedAPR(yieldPercentage));
		}

		if (stats.earnings) {
			convertCurrency(stats.earnings, networkInfo.denom).then((value) =>
				setEarningsFiat(value)
			);
		}
	}, [stats, compounding]);

	return (
		<div className="flex justify-between items-center">
			<div
				className="bg-gray-100 min-h-12-rem py-4 px-8 flex flex-col justify-center rounded-xl"
				style={{ width: "30%" }}
			>
				<div className="flex items-center justify-between">
					<div>
						{get(activeStake, "currency", 0) !==
							get(bondedAmount, "currency", 0) && (
							<span className="text-sm bg-gray-200 text-gray-700 px-4 py-1 rounded-lg">
								Active stake:{" "}
								{formatCurrency.methods.formatAmount(
									Math.trunc(
										Number(
											get(activeStake, "currency", 0) *
												10 ** networkInfo.decimalPlaces
										)
									)
								)}
							</span>
						)}
						<h1 className="text-3xl text-teal-500 font-semibold">
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
						{totalAmountStakedFiat && (
							<h3 className="text-gray-500">
								$
								{stats.totalAmountStaked === get(bondedAmount, "currency", 0)
									? formatCurrency.methods.formatNumber(
											totalAmountStakedFiat.toFixed(2)
									  ) || 0.0
									: formatCurrency.methods.formatNumber(
											get(bondedAmount, "subCurrency", 0).toFixed(2)
									  ) || 0.0}
							</h3>
						)}
					</div>
					<div className="flex flex-col">
						<button
							className="rounded-full text-white bg-teal-500 p-1"
							onClick={bondFunds}
						>
							<Plus />
						</button>
						<button
							className="mt-2 rounded-full text-white bg-teal-500 p-1"
							onClick={unbondFunds}
						>
							<Minus />
						</button>
					</div>
				</div>
				<div className="mt-8 flex justify-between items-center">
					<h5 className="text-gray-800">Bonded</h5>
					<div className="flex items-center">
						<Popover trigger="hover">
							<PopoverTrigger>
								<span className="cursor-help hover:underline text-gray-500 text-sm">
									Unlocking: {totalUnlockingBalance}
								</span>
							</PopoverTrigger>
							<PopoverContent
								zIndex={4}
								px="1.5rem"
								py="0.5rem"
								width="16rem"
								rounded="1rem"
							>
								<div>
									<h5 className="font-semibold text-gray-600">
										Unlocking Balances:
									</h5>
									<div>
										{unlockingBalances.map((balanceInfo, index) => (
											<div
												key={index}
												className="flex items-center justify-around text-gray-600 text-sm"
											>
												<Clock className="text-gray-600 mr-2" size="0.75rem" />
												<span>
													{formatCurrency.methods.formatAmount(
														balanceInfo.value,
														networkInfo
													)}
												</span>
												<span className="ml-2">ERA: {balanceInfo.era}</span>
											</div>
										))}
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>
			<div
				className="bg-gray-100 min-h-12-rem py-4 px-8 flex flex-col justify-center rounded-xl"
				style={{ width: "30%" }}
			>
				<h1 className="text-3xl text-teal-500 font-semibold">
					{/* {formatCurrency.methods.formatAmount(
						Math.trunc(Number(stats.estimatedRewards || 0) * 10 ** networkInfo.decimalPlaces)
					)} */}
					{expectedAPR}%
				</h1>
				<h3 className="text-gray-500">
					{/* $
					{formatCurrency.methods.formatNumber(
						estimatedRewardsFiat.toFixed(2)
					) || 0.0} */}
					for active nominations
				</h3>
				{/* {estimatedRewardsFiat && (
					<h3 className="text-gray-500">
						$
						{formatCurrency.methods.formatNumber(
							estimatedRewardsFiat.toFixed(2)
						) || 0.0}
					</h3>
				)} */}
				<div className="mt-8 flex justify-between items-center">
					<h5 className="text-gray-800">Estimated APR</h5>
				</div>
			</div>
			<div
				className="shadow-teal bg-teal-500 text-white rounded-xl min-h-12-rem py-4 px-8 flex flex-col justify-center"
				style={{ width: "30%" }}
			>
				<h1 className="text-3xl font-semibold">
					{formatCurrency.methods.formatAmount(
						Math.trunc(
							Number(stats.earnings || 0) * 10 ** networkInfo.decimalPlaces
						),
						networkInfo
					)}
				</h1>
				{earningsFiat && (
					<h3 className="text-lg text-white opacity-75">
						$
						{formatCurrency.methods.formatNumber(earningsFiat.toFixed(2)) ||
							0.0}
					</h3>
				)}
				<div className="mt-8 flex justify-between items-center">
					<h5>Earnings</h5>
					<button
						className="bg-white text-teal-500 rounded-full px-4 py-2"
						onClick={openRewardDestinationModal}
					>
						Payment Destination
					</button>
				</div>
			</div>
		</div>
	);
};

export default OverviewCards;
