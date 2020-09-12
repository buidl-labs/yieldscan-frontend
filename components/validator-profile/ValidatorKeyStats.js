import formatCurrency from "@lib/format-currency";
import { useEffect, useState } from "react";
import convertCurrency from "@lib/convert-currency";

const ValidatorKeyStats = ({ stats }) => {
	const [ownStakeSubCurrency, setOwnStakeSubCurrency] = useState();
	const [otherStakeSubCurrency, setOtherStakeSubCurrency] = useState();
	useEffect(() => {
		if (stats.ownStake) {
			convertCurrency(stats.ownStake).then((value) =>
				setOwnStakeSubCurrency(value)
			);
		}
		if (stats.othersStake) {
			convertCurrency(stats.othersStake).then((value) =>
				setOtherStakeSubCurrency(value)
			);
		}
	}, [stats]);
	return (
		<div className="rounded-lg border border-gray-200 py-3">
			<h5 className="px-3 text-xs text-gray-900 tracking-widest font-medium">
				KEY STATISTICS
			</h5>
			<div className="flex flex-col px-5 py-3 border-b border-gray-200">
				<span className="text-sm text-gray-600">No. of nominators</span>
				<h3 className="text-2xl text-black">{stats.numOfNominators}</h3>
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-200">
				<span className="text-sm text-gray-600">Own Stake</span>
				<h3 className="text-2xl text-black">
					{formatCurrency.methods.formatAmount(
						Math.trunc((stats.ownStake || 0) * 10 ** 12)
					)}
				</h3>
				{ownStakeSubCurrency && (
					<span className="text-xs text-gray-600">
						$
						{formatCurrency.methods.formatNumber(
							ownStakeSubCurrency.toFixed(2)
						)}
					</span>
				)}
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-200">
				<span className="text-sm text-gray-600">Other Stake</span>
				<h3 className="text-2xl text-black">
					{formatCurrency.methods.formatAmount(
						Math.trunc((stats.othersStake || 0) * 10 ** 12)
					)}
				</h3>
				{otherStakeSubCurrency && (
					<span className="text-xs text-gray-600">
						$
						{formatCurrency.methods.formatNumber(
							otherStakeSubCurrency.toFixed(2)
						)}
					</span>
				)}
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-200">
				<span className="text-sm text-gray-600">Commission</span>
				<h3 className="text-2xl text-black">{stats.commission} %</h3>
			</div>
			<div className="flex flex-col px-5 pt-3 pb-2">
				<span className="text-sm text-gray-600">Risk Score</span>
				<h3 className="text-2xl text-black">
					{(stats.riskScore || 0).toFixed(2)}
				</h3>
			</div>
			{false && (
				<div className="flex flex-col px-5 pt-3 pb-2">
					<span className="text-sm text-gray-600">Total Account Balance</span>
					<h3 className="text-2xl text-black">42000 KSM</h3>
					<span className="text-xs text-gray-600">$24000</span>
				</div>
			)}
		</div>
	);
};

export default ValidatorKeyStats;
