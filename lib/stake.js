import { web3FromAddress } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

const stake = async (stashId, selfAddress, controllerId, stakeAmount, validatorList, polkadotApi) => {
	if (!stashId || !selfAddress || !controllerId || !stakeAmount || !validatorList || !polkadotApi) {
		throw new Error('Incomplete argument list to stake!');
	}

	try {
		const amount = stakeAmount * 10 ** 12;

		// const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
		// const api = await ApiPromise.create({ provider: wsProvider });

		// Got Substrate Address
		console.log(selfAddress);

		keyring.loadAll(
			{
				genesisHash: polkadotApi.genesisHash,
				isDevelopment: true,
				ss58Format: 2,
				type: "ed25519"
			},
			selfAddress
		);

		const gotPairFromKeyRing = keyring.getPair(selfAddress);

		const { address } = gotPairFromKeyRing;

		const decodedAddress = decodeAddress(address);
		// const encodedAddress = encodeAddress(decoded, 42);

		const injector = await web3FromAddress(decodedAddress);

		const ledger = await api.query.staking.ledger(stashId);

		// TODO: document this code for other readers.
		const txs = [
			!ledger ? api.tx.staking.bond(stashId, amount, 0) : api.tx.staking.bondExtra(amount),
			validatorList && api.tx.staking.nominate(validatorList)
		];

		api.setSigner(injector.signer);
		api.tx.utility.batch(txs).signAndSend(controllerId, ({ status }) => {
			if (status.isInBlock) {
				return true;
			}
		});
	} catch (error) {
		// TODO: handle error using error handling service

		throw new Error({ error }); // throw error up the stack
	}	
};

export default stake;
