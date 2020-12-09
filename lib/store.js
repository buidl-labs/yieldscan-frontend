import { cloneDeep } from "lodash";
import create from "zustand";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const defaultNetworkName = cookies.networkName;

const useSelectedNetwork = create((set) => ({
	selectedNetwork:
		defaultNetworkName !== undefined ? defaultNetworkName : "Kusama",
	setSelectedNetwork: (selectedNetwork) => set(() => ({ selectedNetwork })),
}));

const useYearlyEarning = create((set) => ({
	yearlyEarning: null,

	setYearlyEarning: (yearlyEarning) => set(() => ({ yearlyEarning })),
}));
const useMonthlyEarning = create((set) => ({
	monthlyEarning: null,

	setMonthlyEarning: (monthlyEarning) => set(() => ({ monthlyEarning })),
}));

const useTransactionHash = create((set) => ({
	transactionHash: null,

	setTransactionHash: (transactionHash) => set(() => ({ transactionHash })),
}));

const useDailyEarning = create((set) => ({
	dailyEarning: null,

	setDailyEarning: (dailyEarning) => set(() => ({ dailyEarning })),
}));

const useValidatorData = create((set) => ({
	validatorMap: undefined,
	validatorRiskSets: undefined,
	validators: undefined,

	setValidatorMap: (validatorMap) => set(() => ({ validatorMap })),
	setValidatorRiskSets: (validatorRiskSets) =>
		set(() => ({ validatorRiskSets })),
	setValidators: (validators) => set(() => ({ validators })),
}));

const useNominatorsData = create((set) => ({
	nominatorsData: undefined,
	nomLoading: true,
	setNominatorsData: (nominatorsData) => set(() => ({ nominatorsData })),
	setNomLoading: (nomLoading) => set(() => ({ nomLoading })),
}));

const useCouncil = create((set) => ({
	councilMembers: undefined,
	councilLoading: true,

	setCouncilMembers: (councilMembers) => set(() => ({ councilMembers })),
	setCouncilLoading: (councilLoading) => set(() => ({ councilLoading })),
}));

const useOverviewData = create((set) => ({
	userData: undefined,
	allNominationsData: undefined,

	setUserData: (userData) => set(() => ({ userData })),
	setAllNominations: (allNominationsData) =>
		set(() => ({ allNominationsData })),
}));

const useAccounts = create((set) => ({
	isFilteringAccounts: false,
	stashAccount: null,
	accounts: null,
	accountsWithBalances: null,
	filteredAccounts: [],
	ledgerExists: null,
	bondedAmount: null,
	freeAmount: null,
	activeStake: null,
	unlockingBalances: [],
	accountInfoLoading: false,

	setStashAccount: (stashAccount) => set(() => ({ stashAccount })),
	setAccounts: (accounts) => set(() => ({ accounts })),
	setFreeAmount: (freeAmount) => set(() => ({ freeAmount })),
	setAccountsWithBalances: (accountsWithBalances) =>
		set(() => ({ accountsWithBalances })),
	setFilteredAccounts: (filteredAccounts) => set(() => ({ filteredAccounts })),
	setIsFilteringAccounts: (isFilteringAccounts) =>
		set(() => ({ isFilteringAccounts })),
	setAccountInfoLoading: (accountInfoLoading) =>
		set(() => ({ accountInfoLoading })),

	setAccountState: (state) => set(() => ({ ...cloneDeep(state) })),
}));

const useTransaction = create((set) => ({
	stakingAmount: null,
	riskPreference: null,
	timePeriodValue: null,
	timePeriodUnit: null,
	compounding: null,
	selectedValidators: [],
	returns: null,
	yieldPercentage: null,
	rewardDestination: 0,

	setStakingAmount: (amount) =>
		set((state) => ({ ...cloneDeep(state), stakingAmount: amount })),
	setTransactionState: (state) => set(() => ({ ...cloneDeep(state) })),
}));

const usePolkadotApi = create((set) => ({
	apiInstance: null,

	setApiInstance: (apiInstance) => set(() => ({ apiInstance })),
}));

const useHeaderLoading = create((set) => ({
	headerLoading: false,

	setHeaderLoading: (headerLoading) => set(() => ({ headerLoading })),
}));

const usePaymentPopover = create((set) => ({
	isPaymentPopoverOpen: false,
	togglePaymentPopover: () =>
		set((state) => ({ isPaymentPopoverOpen: !state.isPaymentPopoverOpen })),
	closePaymentPopover: () => set(() => ({ isPaymentPopoverOpen: false })),
	openPaymentPopover: () => set(() => ({ isPaymentPopoverOpen: true })),
}));

export {
	useSelectedNetwork,
	useYearlyEarning,
	useMonthlyEarning,
	useOverviewData,
	useDailyEarning,
	useValidatorData,
	useAccounts,
	usePolkadotApi,
	useTransaction,
	useHeaderLoading,
	useCouncil,
	useTransactionHash,
	usePaymentPopover,
	useNominatorsData,
};
