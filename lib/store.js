import { create } from 'zustand';

const [useAccounts] = create(set => ({
	stashAccount: null,
	accounts: [],

	setStashAccount: (stashAccount) => set(() => ({ stashAccount })),
	setAccounts: (accounts) => set(() => ({ accounts })),
}));

export { useAccounts };