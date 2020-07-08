const MemberCard = () => {
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-300 py-2 px-10 my-2">
			<div className="flex items-center">
				<img src="http://placehold.it/255" className="rounded-full w-12 h-12 mr-10" />
				<span className="">Member Name</span>
			</div>
			<div className="flex items-center">
				<div className="flex flex-col mr-10">
					<span className="text-xs text-gray-500 font-semibold">No. of voters</span>
					<h3 className="text-lg">30</h3>
				</div>
				<div className="flex flex-col mr-10">
					<span className="text-xs text-gray-500 font-semibold">Backing</span>
					<h3 className="text-lg">10000 KSM</h3>
				</div>
				<div className="flex flex-col mr-10">
					<span className="text-xs text-gray-500 font-semibold">Balance</span>
					<h3 className="text-lg">20000 KSM</h3>
				</div>
			</div>
		</div>
	);
};

const MembersTable = ({ members }) => {
	return (
		<div className="mt-8">
			<div className="table-container overflow-y-scroll">
				{members.map((member, index) => (
					<MemberCard key={index} />
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
