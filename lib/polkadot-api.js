import { WsProvider, ApiPromise } from "@polkadot/api";
import { getPolkadotApiStoreState } from "./store";

const createPolkadotAPIInstance = async () => {
	if (getPolkadotApiStoreState().apiInstance) {
		console.info('Polkadot api instance aleady exists.');
		return getPolkadotApiStoreState().apiInstance;
	}
	const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
	const api = await ApiPromise.create({ provider: wsProvider });
	return api;
};

export default createPolkadotAPIInstance;
