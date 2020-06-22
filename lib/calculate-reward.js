import { get } from 'lodash';
import convertCurrency from './convert-currency';

const calculateReward = async (validators = [], amount, timePeriodValue, timePeriodUnit, compounding, bondedAmount) => {
	if (amount < 0) throw new Error('Amount cannot be negative.');
	if (amount > 10 ** 5) throw new Error('Toooo high... you sure about the amount?')

	const amountPerValidator = Number(amount) / validators.length;

	let timePeriodInEras = Number(timePeriodValue);
	if (timePeriodUnit === 'months') {
		// TODO: don't consider each month as 30 days
		timePeriodInEras = timePeriodValue * 30 * 4; // 4 eras / day, 30 days / months
	} else if (timePeriodUnit === 'days') {
		timePeriodInEras = timePeriodValue * 4;
	}

	// 21900 = number of eras in 15 years (365 * 4 * 15)
	if (timePeriodInEras > 21900) throw new Error('15 years are enough to make you rich, please adjust the time period.');

	const totalReward = validators.reduce((tr, v) => {
		const stakeFraction = amountPerValidator / (amountPerValidator + v.totalStake);
		const reward = Math.max(v.estimatedPoolReward - (v.commission / 100 * v.estimatedPoolReward) , 0) * stakeFraction;
		const compoundedReward = reward * (timePeriodInEras + (reward * (timePeriodInEras - 1) / amountPerValidator));
		return tr + (compounding ? compoundedReward : reward);
	}, 0);
	
	const returns = compounding ? Number(totalReward.toFixed(4)) :  Number((totalReward * timePeriodInEras).toFixed(4));
	const portfolioValue = Number((returns + amount + get(bondedAmount, 'currency', 0)).toFixed(4));

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
