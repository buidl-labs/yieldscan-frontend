const OverviewCards = () => (
	<div className="flex justify-between items-center">
		<div className="shadow-lg px-4 py-6 rounded-xl" style={{ width: '30%' }}>
			<h1 className="text-3xl text-teal-500 font-semibold">700 KSM</h1>
			<h3 className="text-lg text-gray-500">$350</h3>
			<div className="mt-8 flex justify-between items-center">
				<h5 className="text-gray-800">Staked</h5>
				<button className="text-gray-600 rounded-full border border-gray-500 px-4 py-2">
					History
				</button>
			</div>
		</div>
		<div className="shadow-lg px-4 py-6 rounded-xl" style={{ width: '30%' }}>
			<h1 className="text-3xl text-teal-500 font-semibold">100 KSM</h1>
			<h3 className="text-lg text-gray-500">$50</h3>
			<div className="mt-8 flex justify-between items-center">
				<h5 className="text-gray-800">Estimated Returns</h5>
				<button className="bg-teal-500 text-white rounded-full px-4 py-2">
					Calculate
				</button>
			</div>
		</div>
		<div className="shadow-lg px-4 py-6 bg-teal-500 text-white rounded-xl" style={{ width: '30%' }}>
			<h1 className="text-3xl font-semibold">10 KSM</h1>
			<h3 className="text-lg text-gray-100">$5</h3>
			<div className="mt-8 flex justify-between items-center">
				<h5>Earnings</h5>
				<button className="bg-white text-teal-500 rounded-full px-4 py-2">
					Reward Settings
				</button>
			</div>
		</div>
	</div>
);

export default OverviewCards;
