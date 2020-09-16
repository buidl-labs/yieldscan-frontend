import _axios from "axios";

const convertCurrency = async (
	value,
	currency = "KSM",
	subCurrency = "USD"
) => {
	//TODO: Make dynamic to fetch prices for other networks
	const res = await _axios(
		"https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd"
	);
	const {kusama} = res.data
	return value * kusama.usd;
};

export default convertCurrency;
