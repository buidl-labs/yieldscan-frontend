import { Check } from "react-feather";
import RiskTag from "@components/reward-calculator/RiskTag";

const ValidatorCard = () => (
	<div className="flex justify-around items-center border-2 border-gray-300 py-2 my-2 rounded-lg">
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
);

const ValidatorsTable = () => {
	return (
		<div>
			<div className="my-5 table-container overflow-y-scroll">
				<ValidatorCard />
				<ValidatorCard />
				<ValidatorCard />
			</div>
			<style jsx>{`
				.table-container {
					height: 62vh;
				}
			`}</style>
		</div>
	);
};

export default ValidatorsTable;
