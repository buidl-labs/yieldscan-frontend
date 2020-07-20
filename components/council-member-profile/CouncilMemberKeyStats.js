const CouncilMemberKeyStats = ({ voters = 0, backingAmount = 0, totalBalance = 0 }) => {
	return (
		<div className="rounded-lg border border-gray-300 py-3">
			<h5 className="px-3 text-xs text-teal-500">KEY STATISTICS</h5>
			<div className="flex flex-col px-5 py-3 border-b border-gray-300">
				<span className="font-semibold text-sm text-gray-600">No. of voters</span>
				<h3 className="text-2xl text-black">{voters}</h3>
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-300">
				<span className="font-semibold text-sm text-gray-600">Amount of Backing</span>
				<h3 className="text-2xl text-black">{(backingAmount || 0).toFixed(2)} KSM</h3>
				<span hidden className="text-xs text-gray-600">$500</span>
			</div>
			<div className="flex flex-col px-5 py-3 border-b border-gray-300">
				<span className="font-semibold text-sm text-gray-600">Total Account Balance</span>
				<h3 className="text-2xl text-black">{(totalBalance || 0).toFixed(2)} KSM</h3>
				<span hidden className="text-xs text-gray-600">$6000</span>
			</div>
		</div>
	);
};

export default CouncilMemberKeyStats;
