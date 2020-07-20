import { upperCase, noop } from "lodash";
import { Star, ExternalLink } from "react-feather";
import RiskTag from "@components/reward-calculator/RiskTag";
import Identicon from "@components/common/Identicon";
import Routes from "@lib/routes";

const StatusTag = ({ status }) => {
	const getColor = () => {
		if (status === 'active') return 'teal-500';
		if (status === 'inactive') return 'red-500';
		if (status === 'waiting') return 'gray-500';
	};

	const color = getColor();

	return (
		<div className={`px-2 py-1 text-xs rounded-lg text-${color} border border-${color}`}>
			{upperCase(status)}
		</div>
	);
};

const ValidatorCard = ({
	name,
	stashId,
	riskScore,
	stakedAmount,
	estimatedReward,
	onProfile = noop,
}) => {
	return (
		<div className="flex items-center justify-around rounded-lg border border-gray-300 py-2">
			<Identicon address={stashId} size="3rem" />
			<div className="text-gray-700 cursor-pointer" onClick={onProfile}>
				<span className="font-semibold">{name || stashId.slice(0, 18) + '...' || '-' }</span>
				<div className="flex items-center">
					<span className="text-xs mr-2">View Profile</span>
					<ExternalLink size="12px" />
				</div>
			</div>
			<StatusTag status="active" />
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
				<div className="rounded-full font-semibold"><RiskTag risk={riskScore} /></div>
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Staked Amount</span>
				<h3 className="text-lg">{stakedAmount} KSM</h3>
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Estimated Reward <sup>*</sup></span>
				<h3 className="text-lg">{estimatedReward} KSM</h3>
			</div>
			{false && (
				<button className="flex items-center justify-between border-2 border-orange-500 rounded-lg py-1 px-3">
					<Star className="text-orange-500 mr-2" fill="#F5B100" size="20px" strokeWidth="2px" />
					<div className="flex flex-col items-center">
						<span className="text-sm text-gray-900">Claim Rewards</span>
						<span className="text-xs text-gray-700">3 days left</span>
					</div>
				</button>
			)}
		</div>
	);
};

const NominationsTable = ({ validators }) => {
	return (
		<div>
			<div className="table-container overflow-y-scroll mt-5 py-4">
				{validators.filter(validator => validator.isElected).map(validator => (
					<ValidatorCard
						key={validator.stashId}
						name={validator.name}
						stashId={validator.stashId}
						riskScore={Number((validator.riskScore || 0).toFixed(2))}
						stakedAmount={Number((validator.nomStake || 0).toFixed(2))}
						estimatedReward={Number((validator.estimatedReward || 0).toFixed(2))}
						onProfile={() => window.open(`${Routes.VALIDATOR_PROFILE}/${validator.stashId}`, '_blank')}
					/>
				))}
				<div className="text-xs text-gray-500 text-right mt-2">* Estimated Returns are calculated per era for 100 KSM</div>
			</div>
			<style jsx>{`
				.table-container {
					height: 44vh;
				}
			`}</style>
		</div>
	);
};

export default NominationsTable;
