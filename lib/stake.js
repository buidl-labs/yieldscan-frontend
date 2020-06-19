import { web3FromAddress } from "@polkadot/extension-dapp";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { WsProvider, ApiPromise } from "@polkadot/api";

// Stash-Controller 1:1 relationship

// Polkadot API uses it in browser, we let it remain mad :]
window.setImmediate = (cb) => cb();

const stake = async (
	stashId,
	controllerId,
	stakeAmount,
	nominatedValidators = [],
	api,
	eventSubscriber = () => {},
) => {
	if (!stashId || !controllerId || !stakeAmount || !nominatedValidators || !api) {
		throw new Error('Incomplete argument list to stake!');
	}
	console.log(nominatedValidators);

	try {
		const amount = stakeAmount * (10 ** 12); // 12 decimal places

		// get substrate address
		eventSubscriber('Fetching substrate address...');
		const injector = await web3FromAddress(stashId);
		api.setSigner(injector.signer);
		console.log('set signer!');

		eventSubscriber('Fetching existing ledger...');
		const ledger = await api.query.staking.ledger(controllerId);
		console.log('ledger: ', ledger);

		eventSubscriber('Set controller on chain...');
		api.tx.staking.setController(controllerId);

		const transactions = [];
		if (ledger.isSome) {
			console.log('bondExtra running');
			eventSubscriber('BondExtra staking amount...');
			transactions.push(api.tx.staking.bondExtra(amount));
		} else {
			console.log('bond running');
			// Take the origin account (stash account) as a stash and lock up value of its balance.
			// controller will be the account that controls it.
			eventSubscriber('Bond staking amount...');
			transactions.push(api.tx.staking.bond(controllerId, amount, 0));
		}

		eventSubscriber('Sending nomination request...');
		transactions.push(api.tx.staking.nominate(nominatedValidators));
		console.log('transactions: ', transactions);

		eventSubscriber('Waiting for you to sign the transaction...');
		api.tx.utility
			.batch(transactions)
			.signAndSend(
				stashId,
				({ events = [], status }) => {
					console.log(`status: ${JSON.stringify(status, null, 4)}`);

					if (status.isInBlock) {
						console.log(`batched included in ${status.asInBlock}`);
						eventSubscriber(`Included in block : ${status.asInBlock}...`);
					}

					if (status.isFinalized) {
						console.log(`finalized: ${status.asFinalized}`);

						events.forEach((d) => {
							const { phase, event: { data, method, section } } = d;
							console.log(`${phase}: ${section}.${method}:: ${data}`);
							if (method === 'ExtrinsicSuccess') {
								eventSubscriber(`Success`, 1);
							} else if (method === 'BatchInterrupted') {
								eventSubscriber(`Failure`, -1);
							}
						});
					}
				}
			);

	} catch (error) {
		// TODO: handle error using error handling service
		console.log(error);
		throw new Error({ error }); // throw error up the stack
	}	
};

export default stake;
