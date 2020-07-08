import { useRouter } from "next/router";
import Routes from "@lib/routes";

const MemberCard = ({ name, accountId, backing, totalBalance, numberOfBackers, onProfile }) => {
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-300 py-2 px-10 my-2">
			<div className="flex items-center cursor-pointer" onClick={onProfile}>
				<img src="http://placehold.it/255" className="rounded-full w-12 h-12 mr-10" />
				<div className="flex flex-col">
					<span className="">{name}</span>
					<span className="text-xs">{accountId}</span>
				</div>
			</div>
			<div className="flex items-center">
				<div className="flex flex-col mr-10">
					<span className="text-xs text-gray-500 font-semibold">No. of voters</span>
					<h3 className="text-lg">{numberOfBackers}</h3>
				</div>
				<div className="flex flex-col w-48 mr-10">
					<span className="text-xs text-gray-500 font-semibold">Backing</span>
					<h3 className="text-lg">{backing.toFixed(2)} KSM</h3>
				</div>
				<div className="flex flex-col w-48 mr-10">
					<span className="text-xs text-gray-500 font-semibold">Balance</span>
					<h3 className="text-lg">{totalBalance.toFixed(2)} KSM</h3>
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
						onProfile={() => router.push(`${Routes.GOVERNANCE}/${member.accountId}`)}
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
