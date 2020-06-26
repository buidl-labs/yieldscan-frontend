import { Check } from "react-feather";
import RiskTag from "@components/reward-calculator/RiskTag";

const ValidatorCard = ({ selected }) => (
	<div
		className={`
			flex justify-around items-center border-2 py-2 my-2 rounded-lg cursor-pointer
			${selected ? 'border-teal-500' : 'border-gray-300'}
		`}
	>
		<Check
			size="1.75rem"
			className={`p-1 mr-2 rounded-full text-white ${selected ? 'bg-teal-500' : 'bg-gray-500'}`}
			strokeWidth="4px"
		/>
		<img src="http://placehold.it/255" className="rounded-full w-10 h-10 mr-4" />
		<h3 className="text-gray-700 text-xs">DasX1jVCRMe5e2DN8XJjGQrWFkBkNvtRDRf5dkb6iUUGFfz</h3>
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
				<ValidatorCard selected />
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
