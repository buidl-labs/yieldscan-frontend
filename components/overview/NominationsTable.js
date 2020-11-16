import { upperCase, noop } from "lodash";
import { Star, ExternalLink } from "react-feather";
import RiskTag from "@components/reward-calculator/RiskTag";
import Identicon from "@components/common/Identicon";
import Routes from "@lib/routes";
import formatCurrency from "@lib/format-currency";

const StatusTag = ({ status }) => {
	const getColor = () => {
		if (status === "active") return "teal-500";
		if (status === "inactive") return "red-500";
		if (status === "waiting") return "gray-500";
	};

	const color = getColor();

	return (
		<div
			className={`px-2 py-1 text-xs rounded-lg text-${color} border border-${color}`}
		>
			{upperCase(status)}
		</div>
	);
};

const ValidatorCard = ({
	name,
	stashId,
	riskScore,
	stakedAmount,
	commission,
	estimatedReward,
	onProfile = noop,
	networkInfo,
}) => {
	const displayName = name
		? name.length > 13
			? name.slice(0, 5) + "..." + name.slice(-5)
			: name
		: stashId.slice(0, 5) + "..." + stashId.slice(-5);
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-200 py-2 w-full mb-2">
			<div className="flex items-center ml-4">
				<Identicon address={stashId} size="2rem" />
				<div className="text-gray-700 cursor-pointer ml-2" onClick={onProfile}>
					<span className="text-xs font-semibold">{displayName}</span>
					<div className="flex items-center">
						<span className="text-xs mr-2">View Profile</span>
						<ExternalLink size="12px" />
					</div>
				</div>
			</div>
			{/* <StatusTag status="active" /> */}
			<div className="flex mr-2">
				<div className="flex flex-col">
					<span className="text-xs text-gray-500 font-semibold">
						Risk Score
					</span>
					<div className="rounded-full font-semibold">
						<RiskTag risk={riskScore} />
					</div>
				</div>
				<div className="flex flex-col mx-2">
					<span className="text-xs text-gray-500 font-semibold">
						Commission
					</span>
					<h3>{commission} %</h3>
				</div>
				<div className="flex flex-col mx-2">
					<span className="text-xs text-gray-500 font-semibold">Stake</span>
					<h3>
						{formatCurrency.methods.formatAmount(
							Math.trunc(stakedAmount * 10 ** networkInfo.decimalPlaces),
							networkInfo
						)}
					</h3>
				</div>
				<div className="flex flex-col mr-2">
					<span className="text-xs text-gray-500 font-semibold">
						Estimated Reward <sup>*</sup>
					</span>
					<h3>
						{formatCurrency.methods.formatAmount(
							Math.trunc(estimatedReward * 10 ** networkInfo.decimalPlaces),
							networkInfo
						)}
					</h3>
				</div>
			</div>
			{false && (
				<button className="flex items-center justify-between border-2 border-orange-500 rounded-lg py-1 px-3">
					<Star
						className="text-orange-500 mr-2"
						fill="#F5B100"
						size="20px"
						strokeWidth="2px"
					/>
					<div className="flex flex-col items-center">
						<span className="text-sm text-gray-900">Claim Rewards</span>
						<span className="text-xs text-gray-700">3 days left</span>
					</div>
				</button>
			)}
		</div>
	);
};

const NominationsTable = ({ validators, networkInfo }) => {
	return (
		<div>
			<div className="py-2 flex items-center flex-wrap max-h-25-rem overflow-y-scroll">
				{validators
					.filter((validator) => validator.isElected)
					.map((validator) => (
						<ValidatorCard
							key={validator.stashId}
							name={validator.name}
							stashId={validator.stashId}
							commission={validator.commission}
							riskScore={Number((validator.riskScore || 0).toFixed(2))}
							stakedAmount={Number(validator.nomStake || 0)}
							estimatedReward={Number(validator.estimatedReward || 0)}
							onProfile={() =>
								window.open(
									`${Routes.VALIDATOR_PROFILE}/${validator.stashId}`,
									"_blank"
								)
							}
							networkInfo={networkInfo}
						/>
					))}
				<div className="text-xs text-gray-500 text-right mt-2">
					* Estimated Returns are calculated per era
				</div>
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
