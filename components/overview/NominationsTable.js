import { upperCase } from "lodash";
import { Star } from "react-feather";
import RiskTag from "@components/reward-calculator/RiskTag";

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
	stashId,
	riskScore,
	stakedAmount,
	estimatedReward,
}) => {
	return (
		<div className="flex items-center justify-around rounded-lg border border-gray-300 py-2">
			<img src="http://placehold.it/255" className="rounded-full w-12 h-12 mr-4" />
			<span className="text-xs">{stashId}</span>
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
				<span className="text-xs text-gray-500 font-semibold">Estimated Reward</span>
				<h3 className="text-lg">{estimatedReward} KSM</h3>
			</div>
			<button className="flex items-center justify-between border-2 border-orange-500 rounded-lg py-1 px-3">
				<Star className="text-orange-500 mr-2" fill="#F5B100" size="20px" strokeWidth="2px" />
				<div className="flex flex-col items-center">
					<span className="text-sm text-gray-900">Claim Rewards</span>
					<span className="text-xs text-gray-700">3 days left</span>
				</div>
			</button>
		</div>
	);
};

const NominationsTable = ({ validators }) => {
	return (
		<div>
			<div className="table-container overflow-y-scroll mt-5 py-4">
				{validators.map(validator => (
					<ValidatorCard
						key={validator.stashId}
						stashId={validator.stashId}
						riskScore={Number(validator.riskScore.toFixed(2))}
						stakedAmount={Number(validator.nomStake.toFixed(2))}
						estimatedReward={Number(validator.estimatedReward.toFixed(2))}
					/>
				))}
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
