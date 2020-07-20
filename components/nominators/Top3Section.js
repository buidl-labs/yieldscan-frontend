import Identicon from "@components/common/Identicon";
import { ExternalLink } from "react-feather";

const TopNominatorCard = ({ name, stashId, nominations, dailyEarnings, onProfile }) => (
	<div className="px-6 py-8 flex-center flex-col rounded-lg border shadow-lg">
		<Identicon address={stashId} size="3rem" />
		<div
			className="cursor-pointer text-center text-gray-700 font-semibold mb-4 text-xs truncate w-40"
			onClick={onProfile}
		>
			<span>{name || stashId || '-'}</span>
			<div className="flex justify-center items-center text-gray-700" onClick={onProfile}>
				<span className="text-xs mr-1">View on Polkascan</span>
				<ExternalLink size="12px" />
			</div>
		</div>
		<span className="text-gray-600 font-semibold text-sm">Daily Earnings</span>
		<h5 className="font-semibold">{(dailyEarnings || 0).toFixed(2)} KSM</h5>
		<span className="text-gray-600 font-semibold text-sm">Nominations</span>
		<h5 className="font-semibold">{nominations}</h5>
	</div>
);

const Top3Section = ({ nominators = [] }) => {
	return (
		<div className="flex items-center">
			{nominators.map(nominator => (
				<div
					key={nominator.nomId}
					className="mr-5"
				>
					<TopNominatorCard
						name={nominator.name}
						stashId={nominator.nomId}
						nominations={nominator.nominations}
						totalStake={nominator.nomtotalStake}
						dailyEarnings={nominator.dailyEarnings}
						onProfile={() => window.open(`https://polkascan.io/kusama/account/${nominator.nomId}`, '_blank')}
					/>
				</div>
			))}
		</div>
	);
};

export default Top3Section;
