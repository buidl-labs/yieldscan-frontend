import { Avatar } from "@chakra-ui/core";

const TopNominatorCard = ({ stashId, nominations, dailyEarnings }) => (
	<div className="px-6 py-8 flex-center flex-col rounded-lg border shadow-lg">
		<Avatar mb="1rem" />
		<h3 className="select-all text-gray-700 font-semibold mb-4 text-xs truncate w-40">{stashId}</h3>
		<span className="text-gray-600 font-semibold text-sm">Daily Earnings</span>
		<h5 className="font-semibold">{dailyEarnings.toFixed(2)} KSM</h5>
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
						stashId={nominator.nomId}
						nominations={nominator.nominations}
						totalStake={nominator.nomtotalStake}
						dailyEarnings={nominator.dailyEarnings}
					/>
				</div>
			))}
		</div>
	);
};

export default Top3Section;
