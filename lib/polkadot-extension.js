import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";

const getPolkadotExtensionInfo = async ({ onEvent }) => {
	const createEventInstance = (message, ...params) => ({ message, ...params });
	onEvent(
		createEventInstance(
			"Waiting for you to allow access to polkadot-js extension..."
		)
	);
	const injectedExtensions = await web3Enable("YieldScan");
	const isExtensionAvailable = injectedExtensions.length > 0;
	if (isExtensionAvailable) {
		onEvent(createEventInstance("Fetching your accounts..."));
		const accounts = await web3Accounts();
		return { isExtensionAvailable, accounts };
	}
	return { isExtensionAvailable };
};

export default getPolkadotExtensionInfo;
