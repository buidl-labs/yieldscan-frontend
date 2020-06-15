import { web3FromAddress } from "@polkadot/extension-dapp";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { WsProvider, ApiPromise } from "@polkadot/api";

// Stash-Controller 1:1 relationship

const stake = async (accounts, stakeAmount, validatorsStashIds) => {
	// if (!stashId || !selfAddress || !controllerId || !stakeAmount || !validatorList || !polkadotApi) {
	// 	throw new Error('Incomplete argument list to stake!');
	// }

	try {
		const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
		const api = await ApiPromise.create({ provider: wsProvider });

		const stashId = '5FCG639weic2hm2gMsYKEgMv4rM3jhPoi7nCfjZatcztPacn'; // accounts[0].address
		const controllerId = '5FcHP6XAeTrDZFtWtXRU5Stf6ne832brz6MtDv9xieU5i2Ax';
		const amount = stakeAmount;

		// get substrate address
		const injector = await web3FromAddress(stashId);
		api.setSigner(injector.signer);
		console.log('set signer!');

		// console.log('stash id:', stashId);
		// console.log('controller id:', controllerId);

		const ledger = await api.query.staking.ledger(controllerId);
		console.log('ledger: ', ledger);

		api.tx.staking.setController(controllerId);

		const transactions = [];
		if (ledger.isSome) {
			console.log('bondExtra running');
			transactions.push(api.tx.staking.bondExtra(amount));
		} else {
			console.log('bond running');
			// Take the origin account (stash account) as a stash and lock up value of its balance.
			// controller will be the account that controls it.
			transactions.push(api.tx.staking.bond(controllerId, amount, 0));
		}

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
