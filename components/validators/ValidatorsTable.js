import { Check, ExternalLink } from "react-feather";
import { isNil, noop } from "lodash";
import RiskTag from "@components/reward-calculator/RiskTag";
import { useRouter } from "next/router";
import Routes from "@lib/routes";
import Identicon from "@components/common/Identicon";

const ValidatorCard = ({
	name = '',
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
		<Identicon address={stashId} />
		<div
			className="text-gray-700 text-xs w-48 truncate"
			onClick={ev => {
				ev.stopPropagation();
				onProfile();
			}}
		>
			<span className="font-semibold">{name || stashId.slice(0, 18) + '...' || '-' }</span>
			<div className="flex items-center">
				<span className="text-xs mr-2">View Profile</span>
				<ExternalLink size="12px" />
			</div>
		</div>
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
			<span className="text-xs text-gray-500 font-semibold">
				Estimated Returns <sup>*</sup>
			</span>
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
						name={validator.name}
						stashId={validator.stashId}
						riskScore={Number((validator.riskScore || 0).toFixed(2))}
						ownStake={Number((validator.ownStake || 0).toFixed(1))}
						otherStake={Number((validator.totalStake || 0).toFixed(1))}
						commission={validator.commission}
						nominators={validator.numOfNominators}
						returnsPer100KSM={validator.rewardsPer100KSM}
						selected={!isNil(selectedValidatorsMap[validator.stashId])}
						toggleSelected={() => toggleSelected(validator)}
						onProfile={() => window.open(`${Routes.VALIDATOR_PROFILE}/${validator.stashId}`, '_blank')}
					/>
				))}
			</div>
			<div className="text-xs text-gray-500 text-right">* Estimated Returns are calculated per month for 100 KSM</div>
			<style jsx>{`
				@media screen and (max-height: 712px) {
					.table-container {
						height: 44vh;
					}
				}
				@media screen and (min-height: 713px) {
					.table-container {
						height: 56vh;
					}
				}
			`}</style>
		</div>
	);
};

export default ValidatorsTable;
