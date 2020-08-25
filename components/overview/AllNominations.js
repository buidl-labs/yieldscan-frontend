import { noop } from "lodash";
import { ExternalLink } from "react-feather";
import Identicon from "@components/common/Identicon";
import Routes from "@lib/routes";
import RiskTag from "@components/reward-calculator/RiskTag";

const ValidatorCard = ({
	name,
	stashId,
	riskScore,
	commission,
	nominators,
	onProfile = noop,
}) => {
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-200 py-2 w-full mb-2">
			<div className="flex items-center ml-8">
				<Identicon address={stashId} size="3rem" />
				<div className="text-gray-700 cursor-pointer ml-2" onClick={onProfile}>
					<span className="font-semibold">
						{name || stashId.slice(0, 6) + "..." + stashId.slice(-6) || "-"}
					</span>
					<div className="flex items-center">
						<span className="text-xs mr-2">View Profile</span>
						<ExternalLink size="12px" />
					</div>
				</div>
			</div>
			{/* <StatusTag status="active" /> */}
			<div className="flex">
				<div className="flex flex-col mx-8">
					<span className="text-xs text-gray-500 font-semibold">
						Nominators
					</span>
					<h3 className="text-lg">{nominators}</h3>
				</div>
				<div className="flex flex-col">
					<span className="text-xs text-gray-500 font-semibold">
						Risk Score
					</span>
					<div className="rounded-full font-semibold">
						<RiskTag risk={riskScore} />
					</div>
				</div>
				<div className="flex flex-col mx-8">
					<span className="text-xs text-gray-500 font-semibold">
						Commission
					</span>
					<h3 className="text-lg">{commission}%</h3>
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

const AllNominations = ({ nominations = [] }) => {
	const onProfile = (validator) =>
		window.open(`${Routes.VALIDATOR_PROFILE}/${validator.stashId}`, "_blank");

	return (
		<div className="py-2 flex items-center flex-wrap h-full max-h-25-rem overflow-y-scroll">
			{nominations.map((nomination) => (
				<ValidatorCard
					key={nomination.stashId}
					name={nomination.name}
					stashId={nomination.stashId}
					riskScore={nomination.riskScore.toFixed(2)}
					commission={nomination.commission}
					nominators={nomination.numOfNominators}
					onProfile={() => onProfile(nomination)}
				/>
			))}
			{!nominations.length && (
				<div className="mt-5">
					<span className="text-xl font-thin text-gray-700">
						No Nominations!
					</span>
				</div>
			)}
		</div>
	);
};

export default AllNominations;
