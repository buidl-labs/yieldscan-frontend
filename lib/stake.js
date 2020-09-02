import { web3FromAddress } from "@polkadot/extension-dapp";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { WsProvider, ApiPromise } from "@polkadot/api";

// Stash-Controller 1:1 relationship

// Polkadot API uses it in browser, we let it remain mad :]
window.setImmediate = (cb) => cb();

const createEventInstance = (message, ...params) => ({ message, ...params });

// TODO: error handling -> balance check, basics.
const stake = async (
	stashId,
	controllerId,
	stakeAmount,
	payee,
	nominatedValidators = [],
	api,
	{ onEvent, onFinish }
) => {
	if (
		!stashId ||
		!controllerId ||
		!stakeAmount ||
		!nominatedValidators ||
		payee === (undefined || null) ||
		!api
	) {
		throw new Error({ message: "Incomplete argument list to stake!" });
	}
	console.log(nominatedValidators);

	const amount = stakeAmount * 10 ** 12; // 12 decimal places

	// get substrate address
	onEvent(createEventInstance("Fetching substrate address..."));
	const injector = await web3FromAddress(stashId);
	api.setSigner(injector.signer);
	console.log("set signer!");

	onEvent(createEventInstance("Fetching existing ledger..."));
	const ledger = await api.query.staking.ledger(controllerId);
	console.log("ledger: ", ledger);

	onEvent(createEventInstance("Set controller on chain..."));
	api.tx.staking.setController(controllerId);

	const transactions = [];
	if (ledger.isSome) {
		console.log("bondExtra running");
		onEvent(createEventInstance("BondExtra staking amount..."));
		transactions.push(api.tx.staking.bondExtra(amount));
	} else {
		console.log("bond running");
		// Take the origin account (stash account) as a stash and lock up value of its balance.
		// controller will be the account that controls it.
		onEvent(createEventInstance("Bond staking amount..."));
		transactions.push(api.tx.staking.bond(controllerId, amount, payee));
	}

	onEvent(createEventInstance("Sending nomination request..."));
	transactions.push(api.tx.staking.nominate(nominatedValidators));
	console.log("transactions: ", transactions);

	onEvent(createEventInstance("Waiting for you to sign the transaction..."));
	return api.tx.utility
		.batch(transactions)
		.signAndSend(stashId, ({ events = [], status }) => {
			console.log(`status: ${JSON.stringify(status, null, 4)}`);

			if (status.isInBlock) {
				console.log(`batched included in ${status.asInBlock}`);
				onEvent(
					createEventInstance(`Included in block : ${status.asInBlock}...`)
				);
			}

			if (status.isFinalized) {
				console.log(`finalized: ${status.asFinalized}`);

				let failed = false;
				events.forEach((d) => {
					const {
						phase,
						event: { data, method, section },
					} = d;
					console.log(`${phase}: ${section}.${method}:: ${data}`);
					if (method === "BatchInterrupted") {
						failed = true;
					}
				});

				const eventLogs = events.map((d) => {
					const {
						phase,
						event: { data, method, section },
					} = d;
					return `${phase}: ${section}.${method}:: ${data}`;
				});

				onFinish(
					failed ? 1 : 0,
					failed
						? "Reason Unknown. If your amount is bonded, it's safe in your account, you can retry with different set of validators."
						: "Bonded and Nominated.",
					eventLogs
				);
			}
		});
};

export default stake;
