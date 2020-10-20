import { get } from "lodash";
import convertCurrency from "./convert-currency";

const calculateReward = async (
	validators = [],
	amount = 0,
	timePeriodValue,
	timePeriodUnit,
	compounding,
	networkInfo
) => {
	if (amount < 0) throw new Error("Amount cannot be negative.");
	if (amount > 10 ** 7)
		throw new Error("Toooo high... you sure about the amount?");

	const totalAmount = parseFloat(amount);

	if (totalAmount === 0) {
		return {
			returns: {
				currency: 0,
				subCurrency: 0,
			},
			portfolioValue: {
				currency: 0,
				subCurrency: 0,
			},
			yieldPercentage: 0,
		};
	}

	const amountPerValidator = Number(totalAmount) / validators.length;

	let timePeriodInEras = Number(timePeriodValue);
	if (timePeriodUnit === "months") {
		// TODO: don't consider each month as 30 days
		timePeriodInEras = timePeriodValue * 30 * networkInfo.erasPerDay; // 4 eras / day, 30 days / months
	} else if (timePeriodUnit === "days") {
		timePeriodInEras = timePeriodValue * networkInfo.erasPerDay;
	}

	// 21900 = number of eras in 15 years (365 * 4 * 15)
	if (timePeriodInEras > 365 * networkInfo.erasPerDay * 15)
		throw new Error(
			"15 years are enough to make you rich, please adjust the time period."
		);

	const totalReward = validators.reduce((tr, v) => {
		const stakeFraction =
			amountPerValidator / (amountPerValidator + v.totalStake);
		const reward =
			Math.max(
				v.estimatedPoolReward - (v.commission / 100) * v.estimatedPoolReward,
				0
			) * stakeFraction;
		return tr + reward;
	}, 0);

	const baseYieldFraction = totalReward / totalAmount;
	const compoundedReward =
		totalAmount * (1 + baseYieldFraction) ** timePeriodInEras - totalAmount;
	const returns = compounding
		? Number(compoundedReward)
		: Number(totalReward * timePeriodInEras);
	const portfolioValue = Number(returns + totalAmount);

	// TODO: yield-percentage to be calculated (for annual basis)
	const yieldPercentage = Number(
		(((totalAmount + returns) / totalAmount - 1) * 100).toFixed(2)
	);

	return {
		returns: {
			currency: returns,
			subCurrency: await convertCurrency(returns, networkInfo.denom),
		},
		portfolioValue: {
			currency: portfolioValue,
			subCurrency: await convertCurrency(portfolioValue, networkInfo.denom),
		},
		yieldPercentage,
	};
};

export default calculateReward;
