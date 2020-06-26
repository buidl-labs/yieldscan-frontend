import { Edit2 } from "react-feather";

const ValidatorsResult = () => {
	return (
		<div className="flex justify-around items-center">
			<h1 className="text-3xl">Validators</h1>
			<div className="flex">
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Staking Amount</span>
					<h3 className="flex justify-between items-center text-xl">
						<span className="mr-5">3000 KSM</span>
						<Edit2 size="20px" strokeWidth="2px" className="mb-1 cursor-pointer" />
					</h3>
					<span hidden className="text-gray-600 text-xs">$1500</span>
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Time Period</span>
					<h3 className="flex justify-between items-center text-xl">
						<span className="mr-5">6 months</span>
						<Edit2 size="20px" strokeWidth="2px" className="mb-1 cursor-pointer" />
					</h3>
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Expected Yield</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">5.46%</span>
					</h3>
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-lg mr-2 h-16">
					<span className="text-sm text-teal-500">Estimated Portfolio Value</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">1000 KSM</span>
					</h3>
					<span hidden className="text-gray-600 text-xs">$500</span>
				</div>
				<div className="flex flex-col px-3 py-1 bg-teal-500 text-white rounded-lg h-16">
					<span className="text-sm">Expected Returns</span>
					<h3 className="flex items-center text-xl">
						<span className="mr-2">100 KSM</span>
					</h3>
					<span hidden className="text-gray-600 text-xs">$50</span>
				</div>
			</div>
		</div>
	);
};

export default ValidatorsResult;
