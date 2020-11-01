import { useState, useEffect } from "react";
import { get } from "lodash";
import { CheckCircle, Circle } from "react-feather";
import Identicon from "@components/common/Identicon";
import formatCurrency from "@lib/format-currency";
import { Icon } from "@chakra-ui/core";
import { HelpPopover } from "@components/reward-calculator";

const RewardDestination = ({
	stashAccount,
	transactionState,
	setTransactionState,
	onConfirm,
	networkInfo,
}) => {
	const [compounding] = useState(get(transactionState, "compounding", true));
	const stakingAmount = get(transactionState, "stakingAmount", 0);
	const [destination, setDestination] = useState("Stash");

	const accounts = ["Stash", "Controller"];
	// if (!compounding) accounts.push("Controller");

	useEffect(() => {
		if (!compounding) {
			setTransactionState({
				rewardDestination: destination === "Stash" ? 1 : 2,
			});
		} else {
			setTransactionState({ rewardDestination: 0 });
		}
	}, [destination]);

	return (
		<div className="mt-10">
			<div className="flex items-center">
				<h2 className="text-xl font-semibold">Reward Destination</h2>
				<HelpPopover
					content={
						<p className="text-white text-xs">
							If you don't want to lock your reward for compounding and are
							using distinct stash and controller accounts for staking, then you
							can use this option to select the account where you would like the
							rewards to be credited.
						</p>
					}
				/>
			</div>
			<p className="text-gray-600 text-sm md:pr-8" hidden={!compounding}>
				You chose to lock your rewards for compounding. For compounding, the
				funds can only be locked in your stash account
			</p>
			<div className="flex justify-between mt-4">
				{accounts.map((accountType) => (
					<div
						key={accountType}
						className={`
							w-1/2 mr-2 text-gray-700 flex items-center rounded-xl border-2 border-gray-300 ${
								compounding
									? "opacity-25 cursor-not-allowed"
									: "opacity-100 cursor-pointer"
							}  px-6 py-6 mb-2
							${accountType === destination && "border-teal-500"}
						`}
						onClick={() => (!compounding ? setDestination(accountType) : null)}
					>
						{destination === accountType ? (
							<Icon name="check-circle" mr={2} size={8} color="teal.500" />
						) : (
							<Circle className="mr-2 text-gray-500" size={32} />
						)}
						<div className="ml-4 flex flex-col">
							<span>{accountType} Account</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default RewardDestination;
