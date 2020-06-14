import { web3FromAddress } from "@polkadot/extension-dapp";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { WsProvider, ApiPromise } from "@polkadot/api";

const stake = async (accounts, stakeAmount, validatorsStashIds) => {
	// if (!stashId || !selfAddress || !controllerId || !stakeAmount || !validatorList || !polkadotApi) {
	// 	throw new Error('Incomplete argument list to stake!');
	// }

	try {
		const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
		const api = await ApiPromise.create({ provider: wsProvider });

		const stashId = 'DasX1jVCRMe5e2DN8XJjGQrWFkBkNvtRDRf5dkb6iUUGFfz'; //accounts[0].address
		const controllerId = accounts[1].address;
		const amount = stakeAmount;

		const add = encodeAddress(stashId, 2);
		console.log(add);

		// get substrate address
		const injector = await web3FromAddress(stashId);
		api.setSigner(injector.signer);
		console.log('set signer!');

		console.log('stash id:', stashId);
		console.log('controller id:', controllerId);

		// const { data: balances } = await api.query.system.account(stashId);
		// console.log('balances: ', balances);

		const ledger = await api.query.staking.ledger(stashId);
		console.log('ledger: ', ledger);

		const controllerAccount = encodeAddress(decodeAddress(stashId), 2); // KUSAMA_CONTROLLER
		const { nonce } = await api.query.system.account(controllerAccount); // keeps the transactions coupled without failing
		console.log('nonce: ', parseInt(nonce, 10));

		// api.tx.staking.setController(controllerId);
		const transactions = [];
		// if (ledger) {
			// transactions.push(api.tx.staking.bondExtra(amount));
		// } else {
			transactions.push(api.tx.staking.bond(stashId, amount, 0));
		// }
		transactions.push(api.tx.staking.nominate(validatorsStashIds));
		console.log('transactions: ', transactions);

		api.tx.utility
			.batch(transactions)
			.signAndSend(
				stashId,
				// { nonce: parseInt(nonce, 10) },
				({ events = [], status }) => {
					console.log(`status: ${JSON.stringify(status, null, 4)}`);

					if (status.isInBlock) {
						console.log(`batched included in ${status.asInBlock}`);
					}

					if (status.isFinalized) {
						console.log(`finalized: ${status.asFinalized}`);

						// api.rpc.chain.getBlock(`${status.asFinalized}`, ({ block }) => {
						// 	console.log(`block: ${block.header.number}`);
						// });

						events.forEach((d) => {
							const { phase, event: { data, method, section, ...eventData } } = d;
							console.log(`${phase}: ${section}.${method}:: ${data}`);
							console.log(d);
						});
					}
				}
			).then(console.log).catch(console.log);

	} catch (error) {
		// TODO: handle error using error handling service
		console.log(error);
		throw new Error({ error }); // throw error up the stack
	}	
};

export default stake;
