import { Check } from "react-feather";
import { isNil, noop } from "lodash";
import RiskTag from "@components/reward-calculator/RiskTag";
import { useRouter } from "next/router";
import Routes from "@lib/routes";

const ValidatorCard = ({
	stashId,
	selected,
	riskScore,
	ownStake,
	otherStake,
	commission,
	nominators,
	returnsPer100KSM,
	toggleSelected = noop,
	onProfile = noop,
}) => (
	<div
		className={`
			flex justify-around items-center border-2 py-2 my-2 rounded-lg cursor-pointer
			${selected ? 'border-teal-500' : 'border-gray-300'}
		`}
		onClick={toggleSelected}
	>
		<Check
			size="1.75rem"
			className={`p-1 mr-2 rounded-full text-white ${selected ? 'bg-teal-500' : 'bg-gray-500'}`}
			strokeWidth="4px"
		/>
		<img
			src="http://placehold.it/255"
			className="rounded-full w-10 h-10 mr-4"
			onClick={onProfile}
		/>
		<h3 className="text-gray-700 text-xs w-48 truncate" onClick={onProfile}>{stashId}</h3>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
			<div className="rounded-full font-semibold"><RiskTag risk={riskScore} /></div>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Own Stake</span>
			<h3 className="text-lg">{ownStake} KSM</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Other Stake</span>
			<h3 className="text-lg">{otherStake} KSM</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Nominators</span>
			<h3 className="text-lg">{nominators}</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Commission</span>
			<h3 className="text-lg">{commission}%</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Returns / 100 KSM</span>
			<h3 className="text-lg">{returnsPer100KSM.toFixed(4)} KSM</h3>
		</div>
	</div>
);

const ValidatorsTable = ({ validators, selectedValidatorsMap, setSelectedValidators }) => {
	const router = useRouter();
	const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(v => !isNil(v));

	const toggleSelected = (validator) => {
		const { stashId } = validator;

		if (selectedValidatorsList.length === 16 && !selectedValidatorsMap[stashId]) return;

		setSelectedValidators({
			...selectedValidatorsMap,
			[stashId]: isNil(selectedValidatorsMap[stashId]) ? validator : null,
		});
	};

	return (
		<div>
			<div className="mt-5 mb-2 table-container border px-2 overflow-y-scroll">
				{validators.map(validator => (
					<ValidatorCard
						key={validator.stashId}
						stashId={validator.stashId}
						riskScore={Number(validator.riskScore.toFixed(2))}
						ownStake={Number(validator.ownStake.toFixed(1))}
						otherStake={Number(validator.totalStake.toFixed(1))}
						commission={validator.commission}
						nominators={validator.numOfNominators}
						returnsPer100KSM={validator.rewardsPer100KSM}
						selected={!isNil(selectedValidatorsMap[validator.stashId])}
						toggleSelected={() => toggleSelected(validator)}
						onProfile={() => window.open(`${Routes.VALIDATOR_PROFILE}/${validator.stashId}`, '_blank')}
					/>
				))}
			</div>
			<style jsx>{`
				.table-container {
					height: 58vh;
				}
			`}</style>
		</div>
	);
};

export default ValidatorsTable;
