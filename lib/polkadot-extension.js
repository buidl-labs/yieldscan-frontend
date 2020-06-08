import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";

const getPolkadotExtensionInfo = async () => {
	const injectedExtensions = await web3Enable('YieldScan');
	const isExtensionAvailable = injectedExtensions.length > 0;
	const accounts = await web3Accounts();
	return { isExtensionAvailable, accounts };
};

export default getPolkadotExtensionInfo;
