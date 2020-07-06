const ValidatorReturnsCalculator = () => {	
	return (
		<div className="rounded-lg border border-gray-300 py-3">
			<div className="flex items-center justify-around mb-2">
				<span className="text-gray-600 text-sm">Staking Amount</span>
				<div className="flex items-center justify-between rounded-xl border border-gray-500 px-4">
					<input className="w-24 text-gray-600 outline-none rounded-lg p-1" />
					<span className="text-gray-600">KSM</span>
				</div>
			</div>
			<h5 className="px-3 text-xs text-teal-500">ANNUAL EXPECTED RETURNS</h5>
			<div className="flex flex-col px-5 py-3">
				<h3 className="text-2xl text-black">420 KSM</h3>
				<span className="text-xs text-gray-600">$210</span>
			</div>
		</div>
	);
};

export default ValidatorReturnsCalculator;
