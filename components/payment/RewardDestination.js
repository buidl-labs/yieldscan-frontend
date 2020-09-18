import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { CheckCircle, Circle } from "react-feather";

const RewardDestination = ({
	stashAccount,
	transactionState,
	setTransactionState,
	onConfirm,
}) => {
	const [compounding] = useState(get(transactionState, 'compounding', true));
	const [destination, setDestination] = useState('Stash');

	const accounts = ['Stash'];
	if (!compounding) accounts.push('Controller');

	useEffect(() => {
		if (!compounding) {
			setTransactionState({ rewardDestination: destination === 'Stash' ? 1 : 2 });
		} else {
			setTransactionState({ rewardDestination: 0 });
		}
	}, [destination]);

	return (
		<div className="mt-10">
			<div className="text-2xl">Reward Destination</div>
			<span className="text-gray-600">
				To compound your rewards, the rewards will be locked for staking in your stash account over the specified time period.
			</span>
			<p
				hidden={compounding}
				className="mt-10 text-orange-500 font-semibold"
			>
				Feel free to ignore this selection if you don't have knowledge about 2-account system.
			</p>
			<p
				hidden={!compounding}
				className="mt-10 text-orange-500 font-semibold"
			>
				When compounding is enabled, reward destination can only be stash account.
			</p>
			<div className="flex justify-between mt-4">
				{accounts.length > 1 ? accounts.map(accountType => (
					<div
						key={accountType}
						className={`
							w-1/2 mr-2 flex items-center rounded-lg border-2 border-teal-500 cursor-pointer px-3 py-2 mb-2
							${accountType === destination ? 'text-white bg-teal-500' : 'text-gray-600'}
						`}
						onClick={() => setDestination(accountType)}
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
				)) : (
					<div className="w-2/3 mr-2 flex items-center rounded-lg text-white bg-teal-500 cursor-pointer px-3 py-2 mb-2">
						<CheckCircle className="mr-2" />
						<div className="flex flex-col">
							<h3>{stashAccount.meta.name}</h3>
							<span className="text-sm">{stashAccount.address}</span>
						</div>
					</div>
				)}
			</div>

			<button
				className="mt-24 px-6 py-2 shadow-lg rounded-lg text-white bg-teal-500"
				onClick={onConfirm}
			>
				Proceed
			</button>
		</div>
	);
};

export default RewardDestination;
