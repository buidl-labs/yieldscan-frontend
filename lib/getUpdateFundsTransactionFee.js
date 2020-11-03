import { web3FromAddress } from "@polkadot/extension-dapp";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { WsProvider, ApiPromise } from "@polkadot/api";

// Stash-Controller 1:1 relationship

// Polkadot API uses it in browser, we let it remain mad :]
window.setImmediate = (cb) => cb();

// TODO: error handling -> balance check, basics.
const getUpdateFundsTransactionFee = async (
	stashId,
	amount,
	type,
	bondedAmount,
	api,
	networkInfo
) => {
	if (!stashId || !amount || !api) {
		throw new Error({ message: "Incomplete argument list to stake!" });
	}

	const substrateStashId = encodeAddress(decodeAddress(stashId), 42);
	// const substrateControllerId = encodeAddress(decodeAddress(controllerId), 42);

	// const ledger = await api.query.staking.ledger(substrateControllerId);

	// const transactions = [];

	const rawAmount = Math.trunc(
		amount * Math.pow(10, networkInfo.decimalPlaces)
	);

	if (type === "bond") {
		if (bondedAmount == 0) {
			const bondFee = await api.tx.staking
				.bond(substrateStashId, rawAmount, 0)
				.paymentInfo(substrateStashId);
			return bondFee.partialFee.toNumber();
		} else {
			const bondExtraFee = await api.tx.staking
				.bondExtra(rawAmount)
				.paymentInfo(substrateStashId);
			return bondExtraFee.partialFee.toNumber();
		}
	} else {
		const unbondFee = api.tx.staking
			.unbond(rawAmount)
			.paymentInfo(substrateStashId);
		return unbondFee;
	}
};

export default getUpdateFundsTransactionFee;
