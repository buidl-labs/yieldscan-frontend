import { WsProvider, ApiPromise } from "@polkadot/api";
import { getPolkadotApiStoreState } from "./store";

const createPolkadotAPIInstance = async (networkName) => {
	if (getPolkadotApiStoreState().apiInstance) {
		console.info("Polkadot api instance aleady exists.");
		return getPolkadotApiStoreState().apiInstance;
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
