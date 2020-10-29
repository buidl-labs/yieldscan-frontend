import { useState, useEffect } from "react";
import { get } from "lodash";
import { CheckCircle, Circle } from "react-feather";
import Identicon from "@components/common/Identicon";
import formatCurrency from "@lib/format-currency";

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
			<div className="text-2xl">Reward Destination</div>
			<span className="text-gray-600" hidden={!compounding}>
				You chose to lock your rewards for compounding. For compounding, the
				funds can only be locked in your stash account
			</span>
			{/* <span className="text-gray-600" hidden={compounding}>
				Please select the destination account for your rewards
			</span>
			<p hidden={compounding} className="mt-10 text-orange-500 font-semibold">
				Feel free to ignore this selection if you don't have knowledge about
				2-account system.
			</p> */}
			<div className="flex justify-between mt-4">
				{accounts.map((accountType) => (
					<div
						key={accountType}
						className={`
							w-1/2 mr-2 flex items-center rounded-lg border-gray-500 ${
								compounding
									? "opacity-25 cursor-not-allowed"
									: "opacity-100 cursor-pointer"
							}  px-3 py-2 mb-2
							${
								accountType === destination
									? "border-2 border-teal-500"
									: "text-gray-600 border"
							}
						`}
						onClick={() => (!compounding ? setDestination(accountType) : null)}
					>
						{destination === accountType ? (
							<CheckCircle className="mr-2" />
						) : (
							<Circle className="mr-2" />
						)}
						<div className="flex flex-col">
							<span>{accountType}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default RewardDestination;
