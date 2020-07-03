import { web3FromAddress } from "@polkadot/extension-dapp";
import { get } from "lodash";

const createEventInstance = (message, ...params) => ({ message, ...params });

// Polkadot API uses it in browser, we let it remain mad :]
window.setImmediate = (cb) => cb();

const updateFunds = async (
	type,
	stashId,
	amount,
	apiInstance,
	{ onEvent, onFinish }
) => {
	const injector = await web3FromAddress(stashId);
	apiInstance.setSigner(injector.signer);

	const operation = get(apiInstance.tx.staking, type === 'bond' ? 'bondExtra' : 'unbond');
	return operation(amount).signAndSend(
		stashId,
		({ events = [], status }) => {
			console.log(`status: ${JSON.stringify(status, null, 4)}`);
			if (status.isInBlock) {
				console.log(`batched included in ${status.asInBlock}`);
				onEvent(createEventInstance(`Included in block : ${status.asInBlock}...`));
			}

			let failed = true;
			events.forEach((d) => {
				const { phase, event: { data, method, section } } = d;
				console.log(`${phase}: ${section}.${method}:: ${data}`);
				if (method === 'ExtrinsicSuccess') {
					failed = false;
				}
			});

			if (status.isFinalized) {
				console.log(`finalized: ${status.asFinalized}`);
				onEvent(createEventInstance(`Finalised: ${status.asFinalized}...`));
				onFinish(
					failed ? 1 : 0,
					failed ?
						'Reason Unknown.' :
						'Funds Updated successfully!'
				);
			}
		}
	);
};

export default updateFunds;