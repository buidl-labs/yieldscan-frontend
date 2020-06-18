import { get } from 'lodash';
import convertCurrency from './convert-currency';

const calculateReward = async (validators = [], amount, timePeriodValue, timePeriodUnit, compounding, bondedAmount) => {
	const amountPerValidator = Number(amount) / validators.length;

	let timePeriodInEras = Number(timePeriodValue);
	if (timePeriodUnit === 'months') {
		// TODO: don't consider each month as 30 days
		timePeriodInEras = timePeriodValue * 30 * 4; // 4 eras / day, 30 days / months
	} else if (timePeriodUnit === 'days') {
		timePeriodInEras = timePeriodValue * 4;
	}

	let totalReward = 0;
	validators.forEach(v => {
		const stakeFraction = amountPerValidator / (amountPerValidator + v.totalStake);
		const reward = Math.max(v.estimatedPoolReward - v.commission, 0) * stakeFraction;
		const compoundedReward = reward * (timePeriodInEras + (reward * (timePeriodInEras - 1) / amountPerValidator));
		totalReward += compounding ? compoundedReward : reward;
	});

	const returns = Number((totalReward * timePeriodInEras).toFixed(4));
	const portfolioValue = returns + get(bondedAmount, 'currency', 0);

	// TODO: yield-percentage to be calculated (for annual basis)
	const yieldPercentage = Number(((((amount + returns) / amount) - 1) * 100).toFixed(2));

	return {
		returns: {
			currency: returns,
			subCurrency: await convertCurrency(returns),
		},
		portfolioValue: {
			currency: portfolioValue,
			subCurrency: await convertCurrency(portfolioValue),
		},
		yieldPercentage,
	};
};

export default calculateReward;
