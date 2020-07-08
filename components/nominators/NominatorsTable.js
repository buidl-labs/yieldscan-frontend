const MemberCard = ({ name, accountId, nominations, dailyEarnings, totalAmountStaked }) => {
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-300 py-2 px-5 my-2">
			<div className="flex items-center">
				<img src="http://placehold.it/255" className="rounded-full w-12 h-12 mr-10" />
				<div className="flex flex-col">
					<span className="">{name}</span>
					<span className="text-xs">{accountId}</span>
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

const NominatorsTable = () => {
	return (
		<div className="mt-8">
			<div className="table-container overflow-y-scroll">
				{[1,2,3,4,5].map((member, index) => (
					<MemberCard
						key={index}
						name={'Nominator Name'}
						nominations={4}
						dailyEarnings={15000}
						totalAmountStaked={30000}
						accountId={member.accountId}
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
