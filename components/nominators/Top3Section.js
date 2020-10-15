import Identicon from "@components/common/Identicon";
import { ExternalLink } from "react-feather";
import formatCurrency from "@lib/format-currency";

const TopNominatorCard = ({
	name,
	stashId,
	nominations,
	totalStake,
	dailyEarnings,
	onProfile,
}) => (
	<div className="mt-4 px-12 py-4 flex-center flex-col border border-gray-200 rounded-lg shadow-lg">
		<Identicon address={stashId} size="3.5rem" />
		<div
			className="cursor-pointer text-center text-gray-900 mt-4 truncate w-40"
			onClick={onProfile}
		>
			<span className="text-base font-black">
				{name || stashId.slice(0, 6) + "..." + stashId.slice(-6) || "-"}
			</span>
			<div
				className="flex justify-center items-center text-gray-700"
				onClick={onProfile}
			>
				<span className="text-xs mr-1">View on Polkascan</span>
				<ExternalLink size="12px" />
			</div>
		</div>
		<span className="text-gray-600 font-semibold text-xs mt-6">
			Daily Earnings
		</span>
		<h5 className="text-base">
			{formatCurrency.methods.formatAmount(
				Math.trunc((dailyEarnings || 0) * 10 ** networkInfo.decimalPlaces)
			)}
		</h5>
		<span className="text-gray-600 font-semibold text-xs mt-4">
			Total Amount Staked
		</span>
		<h5 className="text-base">
			{formatCurrency.methods.formatAmount(
				Math.trunc((totalStake || 0) * 10 ** networkInfo.decimalPlaces)
			)}
		</h5>
		<span className="text-gray-600 font-semibold text-xs mt-4">
			Nominations
		</span>
		<h5 className="text-base">{nominations}</h5>
	</div>
);

const Top3Section = ({ nominators = [] }) => {
	return (
		<div className="flex items-center justify-between">
			{nominators.map((nominator) => (
				<div key={nominator.nomId}>
					<TopNominatorCard
						name={nominator.name}
						stashId={nominator.nomId}
						nominations={nominator.nominations}
						totalStake={nominator.nomtotalStake}
						dailyEarnings={nominator.dailyEarnings}
						onProfile={() =>
							window.open(
								`https://polkascan.io/kusama/account/${nominator.nomId}`,
								"_blank"
							)
						}
					/>
				</div>
			))}
		</div>
	);
};

export default Top3Section;
