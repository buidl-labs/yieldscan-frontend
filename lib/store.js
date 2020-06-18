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
	returns: null,
	yieldPercentage: null,
	rewardDestination: 0,

	setTransactionState: (state) => set(() => ({ ...cloneDeep(state) })),
}));

const [usePolkadotApi] = create(set => ({
	apiInstance: null,

	setApiInstance: (apiInstance) => set(() => ({ apiInstance })),
}));

export { useAccounts, usePolkadotApi, useTransaction };
