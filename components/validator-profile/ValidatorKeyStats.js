const ValidatorKeyStats = () => {
	return (
		<div className="rounded-lg border border-gray-300 py-3">
			<h5 className="px-3 text-xs text-teal-500">KEY STATISTICS</h5>
			<div className="flex flex-col px-5 py-3 border-b border-gray-300">
				<span className="font-semibold text-sm text-gray-600">No. of nominators</span>
				<h3 className="text-2xl text-black">420</h3>
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-300">
				<span className="font-semibold text-sm text-gray-600">Own Stake</span>
				<h3 className="text-2xl text-black">1000 KSM</h3>
				<span className="text-xs text-gray-600">$500</span>
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-300">
				<span className="font-semibold text-sm text-gray-600">Other Stake</span>
				<h3 className="text-2xl text-black">12000 KSM</h3>
				<span className="text-xs text-gray-600">$6000</span>
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-300">
				<span className="font-semibold text-sm text-gray-600">Commission</span>
				<h3 className="text-2xl text-black">15 %</h3>
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-300">
				<span className="font-semibold text-sm text-gray-600">Risk Score</span>
				<h3 className="text-2xl text-black">0.55</h3>
			</div>
			<div className="flex flex-col px-5 pt-3 pb-2">
				<span className="font-semibold text-sm text-gray-600">Total Account Balance</span>
				<h3 className="text-2xl text-black">42000 KSM</h3>
				<span className="text-xs text-gray-600">$24000</span>
			</div>
		</div>
	);
};

export default ValidatorKeyStats;
