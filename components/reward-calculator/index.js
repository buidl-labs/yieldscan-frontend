import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@lib/axios";
import convertCurrency from "@lib/convert-currency";
import RiskSelect from "./RiskSelect";
import AmountInput from "./AmountInput";
import ValidatorsList from "./ValidatorsList";
import TimePeriodInput from "./TimePeriodInput";
import ExpectedReturnsCard from "./ExpectedReturnsCard";
import CompoundRewardSlider from "./CompoundRewardSlider";
import { WalletConnectPopover, useWalletConnect } from "@components/wallet-connect";
import { useAccounts, useTransaction } from "@lib/store";
import { get } from "lodash";
import calculateReward from "@lib/calculate-reward";

const RewardCalculatorPage = () => {
	const router = useRouter();
	
	const { stashAccount, ledgerExists, freeAmount, bondedAmount } = useAccounts();
	const { isOpen, toggle } = useWalletConnect();
	const setTransactionState = useTransaction(state => state.setTransactionState);

	const [amount, setAmount] = useState();
	const [risk, setRisk] = useState('Low');
	const [timePeriodValue, setTimePeriod] = useState();
	const [timePeriodUnit, setTimePeriodUnit] = useState('months');
	const [compounding, setCompounding] = useState(true);

	const [validatorMap, setValidatorMap] = useState({}); // map with low/med/high risk sets
	const [result, setResult] = useState({});

	useEffect(() => {
		axios.get('/rewards/risk-set').then(({ data }) => {
			setValidatorMap({
				Low: data[0].lowriskset,
				Medium: data[1].medriskset,
				High: data[2].highriskset,
				total: data[3].totalset,
			});
		});
	}, []);

	useEffect(() => {
		if (risk && timePeriodValue && amount) {
			calculateReward(
				validatorMap[risk],
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
	}, [risk, amount, timePeriodValue, timePeriodUnit, compounding, bondedAmount]);

	const onPayment = async () => {
		let _returns = get(result, 'returns'), _yieldPercentage = get(result, 'yieldPercentage');

		setTransactionState({
			stakingAmount: amount,
			riskPreference: risk,
			timePeriodValue,
			timePeriodUnit,
			compounding,
			returns: _returns,
			yieldPercentage: _yieldPercentage,
			selectedValidators: validatorMap[risk],
		});
		router.push('/payment');
	};

	return (
		<div className="flex px-24 pt-12">
			<WalletConnectPopover isOpen={isOpen} />
			<div className="w-1/2">
				<h1 className="font-semibold text-3xl text-gray-800">Calculate Returns</h1>
				<div className="mt-10 mx-2">
					<h3 className="text-2xl text-gray-700">Staking Amount</h3>
					<div className="mt-3">
						<div
							className="m-2 text-gray-600 text-sm"
							hidden={!ledgerExists}
						>
							Already bonded: {get(bondedAmount, 'currency', 0)} KSM
						</div>
						<div
							className="m-2 text-gray-600 text-sm"
						>
							Free Balance: {get(freeAmount, 'currency', 0)} KSM
						</div>
						<AmountInput
							value={amount}
							dollarValue={!!amount ? amount * 2 : 0}
							onChange={setAmount}
						/>
					</div>
					<h3 className="text-2xl mt-10 text-gray-700">Risk Preference</h3>
					<div className="mt-3">
						<RiskSelect
							selected={risk}
							setSelected={setRisk}
						/>
					</div>
					<h3 className="text-2xl mt-10 text-gray-700">Time Period</h3>
					<div className="mt-3">
						<TimePeriodInput
							value={timePeriodValue}
							unit={timePeriodUnit}
							onChange={setTimePeriod}
							onUnitChange={setTimePeriodUnit}
						/>
					</div>
					<h3 className="text-2xl mt-10 text-gray-700">Compound Rewards</h3>
					<span className="text-sm text-gray-500">Your rewards will be locked for staking over the specified time period</span>
					<div className="mt-3">
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
					calculationDisabled={!amount || !timePeriodValue}
					onWalletConnectClick={toggle}
					onPayment={onPayment}
				/>
				<ValidatorsList validators={validatorMap[risk]} />
			</div>
		</div>
	);
};

export default RewardCalculatorPage;
