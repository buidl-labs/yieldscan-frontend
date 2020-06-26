import { Edit2, Check } from "react-feather";
import RiskTag from "@components/reward-calculator/RiskTag";

const Validators = () => {
	return (
		<div className="px-10 py-5">
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
			<div className="my-5 table-container overflow-y-scroll">
				<div className="flex justify-around items-center border-2 border-gray-300 py-2 rounded-lg">
					<Check
						size="1.75rem"
						className="p-1 bg-teal-500 text-white mr-2 rounded-full" 
						strokeWidth="4px"
					/>
					<img src="http://placehold.it/255" className="rounded-full w-12 h-12 mr-4" />
					<h3 className="text-gray-700">{'abc'}</h3>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
						<div className="rounded-full font-semibold"><RiskTag risk={55} /></div>
					</div>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-semibold">Own Stake</span>
						<h3 className="text-lg">100 KSM</h3>
					</div>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-semibold">Other Stake</span>
						<h3 className="text-lg">100 KSM</h3>
					</div>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-semibold">Commission</span>
						<h3 className="text-lg">3%</h3>
					</div>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-semibold">Estimated Returns</span>
						<h3 className="text-lg">30 KSM</h3>
					</div>
				</div>
			</div>
			<style jsx>{`
				.table-container {
					height: 62vh;
				}
			`}</style>
		</div>
	);
}

export default Validators;