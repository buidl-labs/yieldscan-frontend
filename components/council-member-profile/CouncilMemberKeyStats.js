import convertCurrency from "@lib/convert-currency";
import { useEffect, useState } from "react";
import formatCurrency from "@lib/format-currency";

const CouncilMemberKeyStats = ({
	voters = 0,
	backingAmount = 0,
	totalBalance = 0,
	networkInfo,
}) => {
	const [backingSubCurrency, setBackingSubCurrency] = useState();
	const [totalBalanceSubCurrency, setTotalBalanceSubCurrency] = useState();
	useEffect(() => {
		if (backingAmount) {
			convertCurrency(backingAmount).then((value) =>
				setBackingSubCurrency(value)
			);
		}
	}, [backingAmount]);
	useEffect(() => {
		if (totalBalance) {
			convertCurrency(totalBalance).then((value) =>
				setTotalBalanceSubCurrency(value)
			);
		}
	}, [totalBalance]);
	return (
		<div className="rounded-lg border border-gray-200 py-3">
			<h5 className="px-3 text-xs text-gray-900 tracking-widest font-medium">
				KEY STATISTICS
			</h5>
			<div className="flex flex-col px-5 py-3 border-b border-gray-200">
				<span className="text-sm text-gray-600">No. of voters</span>
				<h3 className="text-2xl text-black">{voters}</h3>
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-200">
				<span className="text-sm text-gray-600">Amount of Backing</span>
				<h3 className="text-2xl text-black">
					{formatCurrency.methods.formatAmount(
						Math.trunc((backingAmount || 0) * 10 ** networkInfo.decimalPlaces),
						networkInfo
					)}
				</h3>
				{backingSubCurrency && (
					<span className="text-xs text-gray-600">
						$
						{formatCurrency.methods.formatNumber(backingSubCurrency.toFixed(2))}
					</span>
				)}
			</div>
			<div className="flex flex-col px-5 py-3">
				<span className="text-sm text-gray-600">Total Account Balance</span>
				<h3 className="text-2xl text-black">
					{formatCurrency.methods.formatAmount(
						Math.trunc((totalBalance || 0) * 10 ** networkInfo.decimalPlaces),
						networkInfo
					)}
				</h3>
				{totalBalanceSubCurrency && (
					<span className="text-xs text-gray-600">
						$
						{formatCurrency.methods.formatNumber(
							totalBalanceSubCurrency.toFixed(2)
						)}
					</span>
				)}
			</div>
		</div>
	);
};

export default CouncilMemberKeyStats;
