import { Check } from "react-feather";
import { isNil, mapValues, keyBy } from "lodash";
import RiskTag from "@components/reward-calculator/RiskTag";

const ValidatorCard = ({
	stashId,
	selected,
	riskScore,
	stakeAmount,
	otherStake,
	commission,
}) => (
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
		<h3 className="text-gray-700 text-xs w-48 truncate">{stashId}</h3>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
			<div className="rounded-full font-semibold"><RiskTag risk={riskScore} /></div>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Own Stake</span>
			<h3 className="text-lg">{stakeAmount} KSM</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Other Stake</span>
			<h3 className="text-lg">{otherStake} KSM</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Commission</span>
			<h3 className="text-lg">{commission}%</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Estimated Returns</span>
			<h3 className="text-lg">30 KSM</h3>
		</div>
	</div>
);

const ValidatorsTable = ({ validatorMap, selectedValidators }) => {
	const { total: validators } = validatorMap;
	const amountPerValidator = 30 //stakingAmount / selectedValidators.length;

	const selectedValidatorsMap = mapValues(keyBy(selectedValidators, 'stashId'));

	return (
		<div>
			<div className="my-5 table-container overflow-y-scroll">
				{validators.map(validator => (
					<ValidatorCard
						key={validator.stashId}
						stashId={validator.stashId}
						riskScore={Number(validator.riskScore.toFixed(2))}
						stakeAmount={amountPerValidator}
						otherStake={Number(validator.totalStake.toFixed(1))}
						commission={validator.commission}
						selected={!isNil(selectedValidatorsMap[validator.stashId])}
					/>
				))}
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
