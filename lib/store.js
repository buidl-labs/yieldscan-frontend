import { create } from 'zustand';
import { cloneDeep } from 'lodash';

const [useAccounts] = create(set => ({
	stashAccount: null,
	accounts: [],

	setStashAccount: (stashAccount) => set(() => ({ stashAccount })),
	setAccounts: (accounts) => set(() => ({ accounts })),
}));

const [useTransaction] = create(set => ({
	stakingAmount: null,
	riskPreference: null,
	timePeriodValue: null,
	timePeriodUnit: null,
	compounding: null,
	selectedValidators: [],
	rewardDestination: 0,

	setTransactionState: (state) => set(() => ({ ...cloneDeep(state) })),
}));

export { useAccounts, useTransaction };