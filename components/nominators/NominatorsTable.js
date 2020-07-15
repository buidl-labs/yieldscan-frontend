import Identicon from "@components/common/Identicon";
import { ExternalLink } from "react-feather";

const MemberCard = ({ name, stashId, nominations, dailyEarnings, totalAmountStaked, onProfile }) => {
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-300 py-2 px-5 my-2">
			<div className="flex items-center">
				<div className="mr-8">
					<Identicon address={stashId} size="2.5rem" />
				</div>
				<div className="flex flex-col cursor-pointer">
					<span className="text-xs w-40 select-all truncate">{stashId}</span>
					<div className="flex items-center text-gray-700" onClick={onProfile}>
						<span className="text-xs mr-1">View on Polkascan</span>
						<ExternalLink size="12px" />
					</div>
				</div>
			</div>
			<div className="flex items-center">
				<div className="flex flex-col mr-8">
					<span className="text-xs text-gray-500 font-semibold">Nominations</span>
					<h3 className="text-lg">{nominations}</h3>
				</div>
				<div className="flex flex-col w-40 mr-1">
					<span className="text-xs text-gray-500 font-semibold">Daily Earnings</span>
					<h3 className="text-lg">{dailyEarnings.toFixed(2)} KSM</h3>
				</div>
				<div className="flex flex-col w-40">
					<span className="text-xs text-gray-500 font-semibold">Total Amount Staked</span>
					<h3 className="text-lg">{totalAmountStaked.toFixed(2)} KSM</h3>
				</div>
			</div>
		</div>
	);
};

const NominatorsTable = ({ nominators = [] }) => {
	return (
		<div className="mt-8">
			<div className="table-container overflow-y-scroll">
				{nominators.map((member, index) => (
					<MemberCard
						key={index}
						stashId={member.nomId}
						name={member.nomId}
						nominations={member.nominations}
						dailyEarnings={member.dailyEarnings}
						totalAmountStaked={member.nomtotalStake}
						onProfile={() => window.open(`https://polkascan.io/kusama/account/${member.nomId}`, '_blank')}
					/>
				))}
			</div>
			<style jsx>{`
				.table-container {
					height: 36vh;
				}
			`}</style>
		</div>
	);
};

export default NominatorsTable;
