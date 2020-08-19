import { useRouter } from "next/router";
import Routes from "@lib/routes";
import Identicon from "@components/common/Identicon";
import { ExternalLink } from "react-feather";
import formatCurrency from "@lib/format-currency";

const MemberCard = ({ name, accountId, backing, totalBalance, numberOfBackers, onProfile }) => {
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-200 py-3 px-10 my-2">
			<div className="flex items-center cursor-pointer" onClick={onProfile}>
				<div className="mr-8">
					<Identicon address={accountId} size="3rem" />
				</div>
				<div className="text-gray-900 cursor-pointer" onClick={onProfile}>
					<span className="font-semibold">
						{name || stashId.slice(0, 18) + "..." || "-"}
					</span>
					<div className="flex items-center">
						<span className="text-xs mr-2">View Profile</span>
						<ExternalLink size="12px" />
					</div>
				</div>
			</div>
			<div className="flex items-center">
				<div className="flex flex-col mr-10">
					<span className="text-xs text-gray-500 font-semibold">
						No. of voters
					</span>
					<h3 className="text-lg">{numberOfBackers}</h3>
				</div>
				<div className="flex flex-col w-48 mr-10">
					<span className="text-xs text-gray-500 font-semibold">Backing</span>
					<h3 className="text-lg">
						{formatCurrency.methods.formatAmount(
							Math.trunc((backing || 0) * 10 ** 12)
						)}
					</h3>
				</div>
				<div className="flex flex-col w-48 mr-10">
					<span className="text-xs text-gray-500 font-semibold">Balance</span>
					<h3 className="text-lg">
						{formatCurrency.methods.formatAmount(
							Math.trunc((totalBalance || 0) * 10 ** 12)
						)}
					</h3>
				</div>
			</div>
		</div>
	);
};

const MembersTable = ({ members }) => {
	const router = useRouter();

	return (
		<div className="mt-8">
			<div className="table-container overflow-y-scroll">
				{members.map((member, index) => (
					<MemberCard
						key={index}
						name={member.name}
						backing={member.backing}
						accountId={member.accountId}
						totalBalance={member.totalBalance}
						numberOfBackers={member.numberOfBackers}
						onProfile={() => window.open(`${Routes.COUNCIL_MEMBER_PROFILE}/${member.accountId}`, '_blank')}
					/>
				))}
			</div>
			<style jsx>{`
				.table-container {
					height: 74vh;
				}
			`}</style>
		</div>
	);
};

export default MembersTable;
