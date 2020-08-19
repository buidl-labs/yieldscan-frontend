import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@lib/axios";
import RiskSelect from "./RiskSelect";
import AmountInput from "./AmountInput";
import ValidatorsList from "./ValidatorsList";
import TimePeriodInput from "./TimePeriodInput";
import ExpectedReturnsCard from "./ExpectedReturnsCard";
import CompoundRewardSlider from "./CompoundRewardSlider";
import {
	WalletConnectPopover,
	useWalletConnect,
} from "@components/wallet-connect";
import { useAccounts, useTransaction } from "@lib/store";
import { get, isNil, mapValues, keyBy, cloneDeep, debounce } from "lodash";
import calculateReward from "@lib/calculate-reward";
import { Spinner } from "@chakra-ui/core";
import Routes from "@lib/routes";
import { trackEvent, Events } from "@lib/analytics";
import convertCurrency from "@lib/convert-currency";

const trackRewardCalculatedEvent = debounce((eventData) => {
	trackEvent(Events.REWARD_CALCULATED, eventData);
}, 1000);

const RewardCalculatorPage = () => {
	const router = useRouter();

	const { isOpen, toggle } = useWalletConnect();
	const setTransactionState = useTransaction(
		(state) => state.setTransactionState
	);
	const transactionState = useTransaction();
	const previousValidatorMap = useTransaction((state) => state.validatorMap);
	const {
		stashAccount,
		freeAmount,
		bondedAmount,
		accountInfoLoading,
	} = useAccounts();

	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(transactionState.stakingAmount || 1000);
	const [subCurrency, setSubCurrency] = useState(0);
	const [risk, setRisk] = useState(transactionState.riskPreference || "Medium");
	const [timePeriodValue, setTimePeriod] = useState(
		transactionState.timePeriodValue || 12
	);
	const [timePeriodUnit, setTimePeriodUnit] = useState(
		transactionState.timePeriodUnit || "months"
	);
	const [compounding, setCompounding] = useState(
		transactionState.compounding || true
	);
	const [selectedValidators, setSelectedValidators] = useState({});

	const [validatorMap, setValidatorMap] = useState(
		cloneDeep(previousValidatorMap)
	); // map with low/med/high risk sets
	const [result, setResult] = useState({});

	// useEffect(() => {
	// 	if (get(bondedAmount, "currency")) {
	// 		setAmount(
	// 			Number(Math.max(bondedAmount.currency, 0).toFixed(4))
	// 		);
	// 	}
	// }, [bondedAmount]);

	useEffect(() => {
		convertCurrency(amount || 0).then((convertedAmount) => {
			setSubCurrency(convertedAmount);
		});
	}, [amount]);

	useEffect(() => {
		if (get(validatorMap, risk)) {
			const selectedValidators = cloneDeep(validatorMap[risk]);
			setSelectedValidators(selectedValidators);
		}
	}, [risk]);

	useEffect(() => {
		if (!validatorMap) {
			setLoading(true);
			axios.get("/rewards/risk-set").then(({ data }) => {
				/**
				 * `mapValues(keyBy(array), 'value-key')`:
				 * 	O(N + N) operation, using since each risk set will have maximum 16 validators
				 */
				const validatorMap = {
					Low: mapValues(keyBy(data.lowriskset, "stashId")),
					Medium: mapValues(keyBy(data.medriskset, "stashId")),
					High: mapValues(keyBy(data.highriskset, "stashId")),
					total: data.totalset,
				};

				setValidatorMap(validatorMap);
				setSelectedValidators(validatorMap["Medium"]);
				setLoading(false);
			});
		} else {
			console.info("Using previous validator map.");
		}
	}, []);

	useEffect(() => {
		if (risk && timePeriodValue) {
			const selectedValidatorsList = Object.values(selectedValidators).filter(
				(v) => !isNil(v)
			);
			calculateReward(
				selectedValidatorsList,
				amount || 0,
				timePeriodValue,
				timePeriodUnit,
				compounding,
				bondedAmount
			)
				.then((result) => {
					setResult(result);

					trackRewardCalculatedEvent({
						userInputs: {
							selectedValidatorsList,
							amount,
							timePeriodValue,
							timePeriodUnit,
							compounding,
							bondedAmount,
						},
						result,
					});
				})
				.catch((error) => {
					// TODO: handle error gracefully with UI toast
					alert(error);
				});
		}
	}, [
		amount,
		timePeriodValue,
		timePeriodUnit,
		compounding,
		bondedAmount,
		selectedValidators,
	]);

	const updateTransactionState = (eventType = "") => {
		let _returns = get(result, "returns"),
			_yieldPercentage = get(result, "yieldPercentage");
		const selectedValidatorsList = Object.values(selectedValidators).filter(
			(v) => !isNil(v)
		);

		if (eventType) {
			trackEvent(eventType, {
				appState: {
					stakingAmount: amount,
					riskPreference: risk,
					timePeriodValue,
					timePeriodUnit,
					compounding,
					returns: _returns,
					yieldPercentage: _yieldPercentage,
					// selectedValidators: selectedValidatorsList,
					// validatorMap
				},
			});
		}

		setTransactionState({
			stakingAmount: amount,
			riskPreference: risk,
			timePeriodValue,
			timePeriodUnit,
			compounding,
			returns: _returns,
			yieldPercentage: _yieldPercentage,
			selectedValidators: selectedValidatorsList,
			validatorMap,
		});
	};

	const onPayment = async () => {
		updateTransactionState(Events.INTENT_STAKING);
		router.push("/payment");
	};

	const onAdvancedSelection = () => {
		updateTransactionState(Events.INTENT_ADVANCED_SELECTION);
		router.push(`${Routes.VALIDATORS}?advanced=true`);
	};

	if (accountInfoLoading || loading) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<Spinner size="xl" />
					<span className="text-sm text-gray-600 mt-5">
						Instantiating API and fetching data...
					</span>
				</div>
			</div>
		);
	}

	const totalAmount = get(bondedAmount, "currency", 0) + (amount || 0);

	return (
		<div className="flex px-24 pt-12">
			<WalletConnectPopover isOpen={isOpen} />
			<div className="w-1/2">
				<h1 className="font-semibold text-3xl text-gray-800">
					Calculate Returns
				</h1>
				<div className="mt-10 mx-2">
					<h3 className="text-xl text-gray-800">Staking Amount</h3>
					<div className="mt-3">
						<div
							className="m-2 text-gray-600 text-sm"
							hidden={isNil(stashAccount)}
						>
							Free Balance: {get(freeAmount, "currency", 0)} KSM
						</div>
						<div
							className="rounded-lg px-5 py-2 text-sm bg-red-200 text-red-600 my-4"
							hidden={
								!stashAccount || amount < get(freeAmount, "currency", -Infinity)
							}
						>
							<span>
								We cannot stake this amount since you need to maintain a minimum
								balance of 0.1 KSM in your account at all times.{" "}
							</span>
							{/* <a href="#" className="text-blue-500">Learn More?</a> */}
						</div>
						<AmountInput
							bonded={get(bondedAmount, "currency")}
							value={{ currency: amount, subCurrency: subCurrency }}
							onChange={setAmount}
						/>
					</div>
					<h3 className="text-xl mt-10 text-gray-800">Risk Preference</h3>
					<div className="mt-3">
						<RiskSelect selected={risk} setSelected={setRisk} />
					</div>
					<h3 className="text-xl mt-10 text-gray-800">Time Period</h3>
					<div className="mt-3">
						<TimePeriodInput
							value={timePeriodValue}
							unit={timePeriodUnit}
							onChange={setTimePeriod}
							onUnitChange={setTimePeriodUnit}
						/>
					</div>
					<h3 className="text-xl mt-10 text-gray-800">Compound Rewards</h3>
					<span className="text-sm text-gray-500">
						Your rewards will be locked for staking over the specified time
						period
					</span>
					<div className="mt-3 my-10">
						<CompoundRewardSlider
							checked={compounding}
							setChecked={setCompounding}
						/>
					</div>
				</div>
			</div>
			<div className="w-1/2">
				<ExpectedReturnsCard
					result={result}
					stashAccount={stashAccount}
					calculationDisabled={
						!totalAmount ||
						!timePeriodValue ||
						(amount || 0) > get(freeAmount, "currency", 0)
					}
					onWalletConnectClick={toggle}
					onPayment={onPayment}
				/>
				<ValidatorsList
					// disableList={!totalAmount || !timePeriodValue || !risk}
					totalAmount={totalAmount}
					validators={get(validatorMap, "total", [])}
					selectedValidators={selectedValidators}
					setSelectedValidators={setSelectedValidators}
					onAdvancedSelection={onAdvancedSelection}
				/>
			</div>
		</div>
	);
};

export default RewardCalculatorPage;
