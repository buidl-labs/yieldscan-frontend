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

		const stashId = accounts[0].address;
		const controllerId = accounts[1].address;
		const amount = stakeAmount;
		console.log('stash id:', stashId);
		console.log('controller id:', controllerId);

		const { data: balances } = await api.query.system.account(stashId);
		console.log('balances: ', balances);

		// get substrate address
		const injector = await web3FromAddress(stashId);
		api.setSigner(injector.signer);
		console.log('set signer!');

		// const ledger = await api.query.staking.ledger(stashId);
		// console.log('ledger: ', ledger);

		// const controllerAccount = encodeAddress(decodeAddress(controllerId), 2); // KUSAMA_CONTROLLER
		// const { nonce } = await api.query.system.account(controllerAccount); // keeps the transactions coupled without failing
		// console.log('nonce: ', parseInt(nonce, 10));

		api.tx.staking.setController(controllerId);
		const transactions = [];
		// if (ledger) {
		// 	transactions.push(api.tx.staking.bondExtra(amount));
		// } else {
			transactions.push(api.tx.staking.bond(controllerId, amount, 0));
		// }
		transactions.push(api.tx.staking.nominate(validatorsStashIds));
		console.log('transactions: ', transactions);

		api.tx.utility
			.batch(transactions)
			.signAndSend(
				controllerId,
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

						events.forEach(({ phase, event: { data, method, section } }) => {
							console.log(`${phase}: ${section}.${method}:: ${data}`);
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
