import { network } from "../yieldscan.config";
import { formatBalance, isHex } from "@polkadot/util";
formatBalance.setDefaults({
	decimals: network.decimalPlaces,
	unit: network.denom,
});
// import BN from "bn.js";

export default {
	methods: {
		formatNumber(number) {
			if (isHex(number)) {
				return parseInt(number, 16)
					.toString()
					.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			} else {
				return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			}
		},
		// formatAmount(amount) {
		// 	let bn;
		// 	if (isHex(amount)) {
		// 		bn = new BN(amount.substring(2, amount.length), 16);
		// 	} else {
		// 		bn = new BN(amount.toString());
		// 	}
		// 	return formatBalance(bn.toString(10));
		// },
	},
};
