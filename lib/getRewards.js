import axios from "axios";

const getRewards = async (address, networkInfo) => {
	let datafetched = false;
	const dataArr = [];
	const currentTimeStamp = Date.now() / 1000;
	let pageNum = 0;
	const fetchRewards = async (pageNum, address) => {
		const rewards = axios
			.post(
				`https://${networkInfo.coinGeckoDenom}.subscan.io/api/scan/account/reward_slash`,
				{
					row: 25,
					page: pageNum,
					address: address,
				}
			)
			.then((rewards) => {
				return rewards.data.data.list;
			})
			.catch((err) => {
				throw new Error(`Couldn't fetch data from subscan. Error: ${err}`);
			});

		return rewards;
	};

	while (!datafetched) {
		const response = await fetchRewards(pageNum, address);
		const rewards = response.filter(
			(x) => x.block_timestamp > currentTimeStamp - 604800
		);
		dataArr.push(...rewards);
		pageNum += 1;

		if (rewards.length < 25) {
			datafetched = true;
		}
	}

	return dataArr;
};

export default getRewards;
