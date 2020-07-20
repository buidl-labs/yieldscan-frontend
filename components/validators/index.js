import { Filter, ChevronDown, ChevronUp, ChevronLeft } from "react-feather";
import { useState, useEffect } from "react";
import { useDisclosure, Select, Spinner, Button, Checkbox, Switch } from "@chakra-ui/core";
import { mapValues, keyBy, isNil, get, orderBy, filter, isNull, cloneDeep } from "lodash";
import { useTransaction, useAccounts } from "@lib/store";
import calculateReward from "@lib/calculate-reward";
import ValidatorsResult from "./ValidatorsResult";
import ValidatorsTable from "./ValidatorsTable";
import EditAmountModal from "./EditAmountModal";
import FilterPanel from "./FilterPanel";
import { useWalletConnect } from "@components/wallet-connect";
import { useRouter } from "next/router";
import axios from "@lib/axios";

const DEFAULT_FILTER_OPTIONS = {
	numOfNominators: { min: '', max: '' },
	riskScore: '',
	ownStake: { min: '', max: '' },
	totalStake: { min: '', max: '' },
	commission: '',
};

const Validators = () => {
	const router = useRouter();
	const { toggle: toggleWalletConnect } = useWalletConnect();
	const { stashAccount, bondedAmount, accountInfoLoading } = useAccounts();
	const { isOpen, onClose, onToggle } = useDisclosure();
	const transactionState = useTransaction();
	const { setTransactionState } = transactionState;

	const [loading, setLoading] = useState(true);
	const [validators, setValidators] = useState(get(transactionState.validatorMap, 'total'));
	const [filteredValidators, setFilteredValidators] = useState(validators);
	const [advancedMode] = useState(router.query.advanced);
	const [amount, setAmount] = useState(transactionState.stakingAmount);
	const [timePeriodValue, setTimePeriod] = useState(transactionState.timePeriodValue);
	const [timePeriodUnit, setTimePeriodUnit] = useState(transactionState.timePeriodUnit || 'months');
	const [compounding, setCompounding] = useState(transactionState.compounding || false);
	const [selectedValidatorsMap, setSelectedValidatorsMap] = useState(
		mapValues(keyBy(transactionState.selectedValidators, 'stashId'))
	);

	const [showSelected, setShowSelected] = useState(false);
	const [filterPanelOpen, setFilterPanelOpen] = useState(false);
	const [filterOptions, setFilterOptions] = useState(cloneDeep(DEFAULT_FILTER_OPTIONS));
	const [sortOrder, setSortOrder] = useState('asc');
	const [sortKey, setSortKey] = useState('estimatedPoolReward');
	const [result, setResult] = useState({});

	useEffect(() => {
		if (!validators) {
			axios.get('/rewards/risk-set').then(({ data }) => {	
				setValidators(data.totalset);
				setFilteredValidators(data.totalset);
				setLoading(false);
			});
		} else {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const sorted = orderBy(filteredValidators, [sortKey], [sortOrder]);
		setFilteredValidators(sorted);
	}, [sortKey, sortOrder]);
	
	useEffect(() => {
		const selectedValidatorsList = Object.values(selectedValidatorsMap);

		if (!filterPanelOpen && !showSelected) return setFilteredValidators(validators);
		if (!filterPanelOpen && showSelected) return setFilteredValidators(selectedValidatorsList);

		const riskGroup = get(filterOptions, 'riskScore');
		const commission = get(filterOptions, 'commission');
		const numOfNominators = get(filterOptions, 'numOfNominators', { min: '', max: '' });
		const ownStake = get(filterOptions, 'ownStake', { min: '', max: '' });
		const totalStake = get(filterOptions, 'totalStake', { min: '', max: '' });

		const isEmpty = (...values) => values.every(v => v === '');

		if (isEmpty(
			riskGroup,
			commission,
			numOfNominators.min,
			numOfNominators.max,
			ownStake.min,
			ownStake.max,
			totalStake.min,
			totalStake.max
		)) return setFilteredValidators(validators);

		const validatorList = showSelected ? selectedValidatorsList : validators;

		const filtered = validatorList.filter(validator => {
			if (riskGroup === 'Low' && validator.riskScore > 0.32) return false;
			if (riskGroup === 'Medium' && validator.riskScore > 0.66) return false;

			if (!isEmpty(commission) && validator.commission > commission) return false;

			if (!isEmpty(numOfNominators.min) && validator.numOfNominators < numOfNominators.min) return false;
			if (!isEmpty(numOfNominators.max) && validator.numOfNominators > numOfNominators.max) return false;

			if (!isEmpty(ownStake.min) && validator.ownStake < ownStake.min) return false;
			if (!isEmpty(ownStake.max) && validator.ownStake > ownStake.max) return false;

			if (!isEmpty(totalStake.min) && validator.totalStake < totalStake.min) return false;
			if (!isEmpty(totalStake.max) && validator.totalStake > totalStake.max) return false;

			return true;
		});

		const filteredAndsorted = orderBy(filtered, [sortKey], [sortOrder]);

		setFilteredValidators(filteredAndsorted);
	}, [filterPanelOpen, filterOptions, showSelected]);

	useEffect(() => {
		if (amount && timePeriodValue && timePeriodUnit) {
			const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(v => !isNil(v));
			calculateReward(
				selectedValidatorsList,
				amount,
				timePeriodValue,
				timePeriodUnit,
				compounding,
				bondedAmount,
			).then(setResult).catch(error => {
				// TODO: handle error gracefully with UI toast
				alert(error);
			});
		}
	}, [amount, timePeriodValue, timePeriodUnit, selectedValidatorsMap, compounding])

	const updateTransactionState = () => {
		let _returns = get(result, 'returns'), _yieldPercentage = get(result, 'yieldPercentage');
		const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(v => !isNil(v));

		setTransactionState({
			stakingAmount: amount,
			riskPreference: transactionState.riskPreference,
			timePeriodValue,
			timePeriodUnit,
			compounding: transactionState.compounding,
			returns: _returns,
			yieldPercentage: _yieldPercentage,
			selectedValidators: selectedValidatorsList,
			validatorMap: transactionState.validatorMap,
		});
	};

	const onPayment = async () => {
		updateTransactionState();
		router.push('/payment');
	};

	if (loading || accountInfoLoading) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<Spinner size="xl" />
					<span className="text-sm text-gray-600 mt-5">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-full px-10 py-5">
			{advancedMode && (
				<div className="mb-4">
					<button className="flex items-center bg-gray-200 text-gray-600 rounded-lg px-2 py-1" onClick={router.back}>
						<ChevronLeft className="mr-2 text-gray-600" />
						Reward Calculator
					</button>
				</div>
			)}
			<EditAmountModal
				isOpen={isOpen}
				onClose={onClose}
				amount={amount}
				setAmount={setAmount}
				bondedAmount={bondedAmount}
			/>
			<ValidatorsResult
				stakingAmount={amount}
				bondedAmount={bondedAmount}
				advancedMode={advancedMode}
				compounding={compounding}
				timePeriodValue={timePeriodValue}
				timePeriodUnit={timePeriodUnit}
				onCompoundingChange={setCompounding}
				onTimePeriodValueChange={setTimePeriod}
				onTimePeriodUnitChange={setTimePeriodUnit}
				onEditAmount={onToggle}
				result={result}
				transactionState={transactionState}
			/>
			<div className="flex justify-between items-center mt-10">
				<div className="flex items-center">
					<span className="text-gray-700 mr-4">Sort by</span>
					<Select
						rounded="full"
						border="1px"
						borderColor="gray.500"
						color="gray.800"
						pl="1rem"
						width="14rem"
						fontSize="xs"
						cursor="pointer"
						height="2rem"
						defaultValue="estimatedPoolReward"
						value={sortKey}
						onChange={ev => setSortKey(ev.target.value)}
					>
						<option value="estimatedPoolReward">Estimated Rewards</option>
						<option value="riskScore">Risk Score</option>
						<option value="commission">Commission</option>
						<option value="numOfNominators">Nominators</option>
						<option value="totalStake">Other Stake</option>
					</Select>
					<div className="flex flex-col items-center justify-between items-center ml-2">
						<ChevronUp size="20px" className="bg-gray-300 cursor-pointer" onClick={() => setSortOrder('asc')} />
						<ChevronDown size="20px" className="bg-gray-300 cursor-pointer" onClick={() => setSortOrder('desc')} />
					</div>
					<div className="ml-4 flex items-center text-gray-700 border border-gray-300 rounded px-3 py-1">
						<p>Show Selected</p>
						<Switch
							color="teal"
							className="mt-1 ml-2"
							isChecked={showSelected}
							onChange={e => setShowSelected(e.target.checked)}
						/>
					</div>
				</div>
				<div className="flex items-center">
					<button
						className="text-sm text-gray-600 hover:underline mr-2"
						onClick={() => setFilterOptions(cloneDeep(DEFAULT_FILTER_OPTIONS))}
					>
						reset filters
					</button>
					<button
						className={`
							flex items-center select-none rounded-xl px-3 py-1
							${filterPanelOpen ? 'bg-gray-900 text-white' : 'border border-gray-900 text-gray-900'}
						`}
						onClick={() => setFilterPanelOpen(!filterPanelOpen)}
					>
						<Filter size="1rem" className="mr-2" />
						<span>Filter</span>
					</button>
				</div>
			</div>
			<div className="mt-5" hidden={!filterPanelOpen}>
				<FilterPanel
					filterOptions={filterOptions}
					setFilterOptions={setFilterOptions}
				/>
			</div>
			<ValidatorsTable
				validators={filteredValidators}
				selectedValidatorsMap={selectedValidatorsMap}
				setSelectedValidators={setSelectedValidatorsMap}
			/>
			<div className="absolute bottom-0 flex-center w-full mb-4">
				{stashAccount ? (
					<div className="flex-center">
						<Button
							px="8"
							py="2"
							mt="5"
							rounded="0.5rem"
							backgroundColor="teal.500"
							color="white"
							onClick={onPayment}
						>
							Stake Now
						</Button>
					</div>
				) : (
					<div className="flex-center">
						<Button
							px="8"
							py="2"
							mt="5"
							rounded="0.5rem"
							backgroundColor="teal.500"
							color="white"
							onClick={toggleWalletConnect}
						>
							Connect Wallet to Stake
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Validators;