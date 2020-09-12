import { useState, useEffect } from "react";
import { get } from "lodash";
import calculateReward from "@lib/calculate-reward";
import formatCurrency from "@lib/format-currency";

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
		<div className="rounded-lg border border-gray-200 py-3">
			<div className="flex items-center justify-around mb-2">
				<span className="text-gray-900 font-medium text-sm">
					Staking Amount
				</span>
				<div className="flex items-center justify-between rounded-md border border-gray-200 pr-4">
					<input
						type="number"
						value={amount}
						onChange={(ev) => setAmount(ev.target.value)}
						className="w-24 text-gray-900 outline-none rounded-lg p-2"
					/>
					<span className="text-gray-900">KSM</span>
				</div>
			</div>
			<h5 className="px-3 text-xs text-teal-500 tracking-widest font-medium mt-8">
				ANNUAL EXPECTED RETURNS
			</h5>
			{get(returns, "currency") && (
				<div className="flex flex-col px-5 pt-3">
					<h3 className="text-2xl text-black">
						{formatCurrency.methods.formatAmount(
							Math.trunc(get(returns, "currency") * 10 ** 12)
						)}
					</h3>
					<span className="text-xs text-gray-600">
						${formatCurrency.methods.formatNumber(
							get(returns, "subCurrency").toFixed(2)
						)}
					</span>
				</div>
			)}
		</div>
	);
};

export default ValidatorReturnsCalculator;
