import { useState, useEffect } from "react";
import { get } from "lodash";
import calculateReward from "@lib/calculate-reward";

const ValidatorReturnsCalculator = ({ validatorInfo }) => {	
	const [amount, _setAmount] = useState(1000);
	const [returns, setReturns] = useState();

	useEffect(() => {
		if (amount > 0) {
			const validator = {
				...validatorInfo,
				totalStake: validatorInfo.ownStake + validatorInfo.othersStake,
			};
	
			calculateReward([validator], amount, 12, 'months', true).then(result => {
				setReturns(result.returns);
			});
		}
	}, [amount]);

	const setAmount = (value) => {
		if (value === '') _setAmount(value);
		else _setAmount(Number(value));
	};

	return (
		<div className="rounded-lg border border-gray-300 py-3">
			<div className="flex items-center justify-around mb-2">
				<span className="text-gray-600 text-sm">Staking Amount</span>
				<div className="flex items-center justify-between rounded-xl border border-gray-500 px-4">
					<input
						type="number"
						value={amount}
						onChange={ev => setAmount(ev.target.value)}
						className="w-24 text-gray-600 outline-none rounded-lg p-1"
					/>
					<span className="text-gray-600">KSM</span>
				</div>
			</div>
			<h5 className="px-3 text-xs text-teal-500">ANNUAL EXPECTED RETURNS</h5>
			{get(returns, 'currency') && (
				<div className="flex flex-col px-5 py-3">
					<h3 className="text-2xl text-black">{get(returns, 'currency')} KSM</h3>
					<span className="text-xs text-gray-600">${get(returns, 'subCurrency')}</span>
				</div>
			)}
		</div>
	);
};

export default ValidatorReturnsCalculator;
