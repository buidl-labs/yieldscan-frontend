import { WsProvider, ApiPromise } from "@polkadot/api";

const createPolkadotAPIInstance = async () => {
	const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
	const api = await ApiPromise.create({ provider: wsProvider });
	return api;
};

export default createPolkadotAPIInstance;
