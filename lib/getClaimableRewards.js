const getClaimableRewards = async (
	address,
	networkInfo,
	api,
	erasHistoric,
	setClaimableRewards
) => {
	const reward = await api.derive.staking.stakerRewardsMultiEras(
		["GvvafsWU5DxcPpPQ2DNmWSy6KYqUkMPovJxtVvvEtaHq5tW"],
		erasHistoric.slice(-2)
	);
	setClaimableRewards(reward);
};

export default getClaimableRewards;
