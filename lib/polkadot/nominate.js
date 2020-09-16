import { web3FromAddress } from "@polkadot/extension-dapp";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";

const createEventInstance = (message, ...params) => ({ message, ...params });

// Polkadot API uses it in browser, we let it remain mad :]
window.setImmediate = (cb) => cb();

const nominate = async (
	stashId,
	validators,
	isNominateOnly,
	apiInstance,
	{ onEvent, onFinish, onSuccessfullSigning }
) => {
	let controllerAccountId = stashId;

	const controllerAccount = await apiInstance.query.staking.bonded(stashId);
	if (controllerAccount.isSome) {
		controllerAccountId = encodeAddress(
			decodeAddress(controllerAccount.toString()),
			42
		);
	}

	const injector = await web3FromAddress(controllerAccountId);
	apiInstance.setSigner(injector.signer);

	onEvent(
		createEventInstance(
			"Waiting for you to sign the transaction to nominate the selected validators..."
		)
	);
	return apiInstance.tx.staking
		.nominate(validators)
		.signAndSend(controllerAccountId, ({ events = [], status }) => {
			console.log(`status: ${JSON.stringify(status, null, 4)}`);
			onEvent(createEventInstance("Sending your request to the chain..."));
			if (status.isInBlock) {
				console.log(`batched included in ${status.asInBlock}`);
				onEvent(
					createEventInstance(`Included in block : ${status.asInBlock}...`)
				);
				onSuccessfullSigning(createEventInstance(`${status.asInBlock}`));
			}

			let failed = true;
			events.forEach((d) => {
				const {
					phase,
					event: { data, method, section },
				} = d;
				console.log(`${phase}: ${section}.${method}:: ${data}`);
				if (method === "ExtrinsicSuccess") {
					failed = false;
				}
			});

			if (status.isFinalized) {
				console.log(`finalized: ${status.asFinalized}`);
				onEvent(createEventInstance(`Finalised: ${status.asFinalized}...`));
				onFinish(
					failed ? 1 : 0,
					failed ? "Reason Unknown." : "Transaction sent to chain successful!",
					isNominateOnly
				);
			}
		});
};

export default nominate;
