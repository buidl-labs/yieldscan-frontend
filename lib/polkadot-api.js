import { WsProvider, ApiPromise } from "@polkadot/api";

const createPolkadotAPIInstance = async (networkName, apiInstance) => {
	if (apiInstance) {
		console.info("Polkadot api instance aleady exists.");
		return apiInstance;
	}
	let wsURL = "wss://kusama-rpc.polkadot.io/";
	if (networkName !== "Kusama") {
		wsURL = "wss://rpc.polkadot.io/";
	}
	const wsProvider = new WsProvider(wsURL);
	const api = await ApiPromise.create({ provider: wsProvider });
	return api;
};

export default createPolkadotAPIInstance;
