import { noop } from 'lodash';
import { Plus, Minus } from 'react-feather';

const OverviewCards = ({
	stats,
	openRewardDestinationModal = noop,
	bondFunds = noop,
	unbondFunds = noop,
}) => (
	<div className="flex justify-between items-center">
		<div className="shadow-lg px-4 py-6 rounded-xl" style={{ width: '30%' }}>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl text-teal-500 font-semibold">
						{Number(stats.totalAmountStaked.toFixed(3))} KSM
					</h1>
					<h3 className="text-lg text-gray-500">
						${Number(stats.totalAmountStaked.toFixed(3)) * 2}
					</h3>
				</div>
				<div className="flex flex-col">
					<button
						className="rounded-full text-teal-500 border-2 border-teal-500"
						onClick={bondFunds}
					>
						<Plus />
					</button>
					<button
						className="mt-2 rounded-full text-teal-500 border-2 border-teal-500"
						onClick={unbondFunds}
					>
						<Minus />
					</button>
				</div>
			</div>
			<div className="mt-8 flex justify-between items-center">
				<h5 className="text-gray-800">Staked</h5>
				<button className="text-gray-600 rounded-full border border-gray-500 px-4 py-2">
					History
				</button>
			</div>
		</div>
		<div className="shadow-lg px-4 py-6 rounded-xl" style={{ width: '30%' }}>
			<h1 className="text-3xl text-teal-500 font-semibold">
				{Number(stats.estimatedRewards.toFixed(3))} KSM
			</h1>
			<h3 className="text-lg text-gray-500">
				${Number(stats.estimatedRewards.toFixed(3)) * 2}
			</h3>
			<div className="mt-8 flex justify-between items-center">
				<h5 className="text-gray-800">Estimated Returns</h5>
				<button className="bg-teal-500 text-white rounded-full px-4 py-2">
					Calculate
				</button>
			</div>
		</div>
		<div className="shadow-lg px-4 py-6 bg-teal-500 text-white rounded-xl" style={{ width: '30%' }}>
			<h1 className="text-3xl font-semibold">
				{Number(stats.earnings.toFixed(3))} KSM
			</h1>
			<h3 className="text-lg text-gray-100">
				${Number(stats.earnings.toFixed(3)) * 2}
			</h3>
			<div className="mt-8 flex justify-between items-center">
				<h5>Earnings</h5>
				<button
					className="bg-white text-teal-500 rounded-full px-4 py-2"
					onClick={openRewardDestinationModal}
				>
					Payment Destination
				</button>
			</div>
		</div>
	</div>
);

export default OverviewCards;
