import Identicon from "@components/common/Identicon";
import { ExternalLink } from "react-feather";
import formatCurrency from "@lib/format-currency";

const MemberCard = ({
	name,
	stashId,
	nominations,
	dailyEarnings,
	totalAmountStaked,
	onProfile,
}) => {
	return (
		<div className="flex rounded-lg justify-between border border-gray-200 py-3 px-5 my-1">
			<div className="flex items-center">
				<div className="mr-8">
					<Identicon address={stashId} />
				</div>
				<div className="flex flex-col cursor-pointer">
					<span className="text-xs w-40 select-all text-sm text-gray-900 font-bold truncate">
						{stashId.slice(0, 6) + "..." + stashId.slice(-6)}
					</span>
					<div className="flex items-center text-gray-700" onClick={onProfile}>
						<span className="text-xs mr-1">View on Polkascan</span>
						<ExternalLink size="12px" />
					</div>
				</div>
			</div>
			<div className="flex items-center">
				<div className="flex flex-col">
					<span className="text-xs text-gray-500 font-semibold">
						Daily Earnings
					</span>
					<h3 className="text-base">
						{formatCurrency.methods.formatAmount(
							Math.trunc((dailyEarnings || 0) * 10 ** networkInfo.decimalPlaces)
						)}
					</h3>
				</div>
				<div className="flex flex-col mx-8 w-40">
					<span className="text-xs text-gray-500 font-semibold">
						Total Amount Staked
					</span>
					<h3 className="text-base">
						{formatCurrency.methods.formatAmount(
							Math.trunc(
								(totalAmountStaked || 0) * 10 ** networkInfo.decimalPlaces
							)
						)}
					</h3>
				</div>
				<div className="flex flex-col w-20">
					<span className="text-xs text-gray-500 font-semibold">
						Nominations
					</span>
					<h3 className="text-base">{nominations}</h3>
				</div>
			</div>
		</div>
	);
};

const NominatorsTable = ({ nominators = [] }) => {
	return (
		<div className="mt-8">
			<div>
				{nominators.map((member, index) => (
					<MemberCard
						key={index}
						stashId={member.nomId}
						name={member.nomId}
						nominations={member.nominations}
						dailyEarnings={member.dailyEarnings}
						totalAmountStaked={member.nomtotalStake}
						onProfile={() =>
							window.open(
								`https://polkascan.io/kusama/account/${member.nomId}`,
								"_blank"
							)
						}
					/>
				))}
			</div>
		</div>
	);
};

export default NominatorsTable;
