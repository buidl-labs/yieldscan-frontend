import { web3FromAddress } from "@polkadot/extension-dapp";

const createEventInstance = (message, ...params) => ({ message, ...params });

// Polkadot API uses it in browser, we let it remain mad :]
window.setImmediate = (cb) => cb();

const editController = async (
	newControllerId,
	stashId,
	apiInstance,
	{ onEvent, onFinish },
) => {
	const injector = await web3FromAddress(stashId);
	apiInstance.setSigner(injector.signer);
	return apiInstance.tx.staking
		.setController(newControllerId)
		.signAndSend(
			stashId,
			({ events = [], status }) => {
				console.log(`status: ${JSON.stringify(status, null, 4)}`);
				if (status.isInBlock) {
					console.log(`batched included in ${status.asInBlock}`);
					onEvent(createEventInstance(`Included in block : ${status.asInBlock}...`));
				}

				if (status.isFinalized) {
					console.log(`finalized: ${status.asFinalized}`);

					let failed = false;
					events.forEach((d) => {
						const { phase, event: { data, method, section } } = d;
						console.log(`${phase}: ${section}.${method}:: ${data}`);
						if (method === 'BatchInterrupted') {
							failed = true;
						}
					});

					onFinish(
						failed ? 1 : 0,
						failed ?
							'Reason Unknown.' :
							'Controller edited successfully.'
					);
				}
			}
		);
};

export default editController;
