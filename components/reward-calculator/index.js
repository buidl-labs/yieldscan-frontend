import { useState, useEffect, useRef } from "react";
import axios from "@lib/axios";
import RiskSelect from "./RiskSelect";
import AmountInput from "./AmountInput";
import ValidatorsList from "./ValidatorsList";
import TimePeriodInput from "./TimePeriodInput";
import ExpectedReturnsCard from "./ExpectedReturnsCard";
import CompoundRewardSlider from "./CompoundRewardSlider";
import { WalletConnectPopover, useWalletConnect } from "@components/wallet-connect";

const RewardCalculatorPage = () => {
	const { isOpen, toggle } = useWalletConnect();

	const [amount, setAmount] = useState();
	const [risk, setRisk] = useState('Low');
	const [timePeriodValue, setTimePeriod] = useState();
	const [timePeriodUnit, setTimePeriodUnit] = useState('months');
	const [compounding, setCompounding] = useState(true);

	const [validatorMap, setValidatorMap] = useState({}); // map with low/med/high risk sets
	const [estimatedReward, setEstimatedReward] = useState('');

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

	const calculateReward = () => {
		const validators = validatorMap[risk];
		const amountPerValidator = Number(amount) / validators.length;

		let totalReward = 0;
		validators.forEach(v => {
			const stakeFraction = amountPerValidator / (amountPerValidator + v.totalStake);
			const reward = (v.estimatedPoolReward - v.commission) * stakeFraction;
			totalReward += reward;
		});

		// TODO: take `timePeriod` into account
		// `totalReward` is for the next era ONLY
		let timePeriodInEras = Number(timePeriodValue);
		if (timePeriodUnit === 'months') {
			// TODO: don't consider each month as 30 days
			timePeriodInEras = timePeriodValue * 30 * 4; // 4 eras / day, 30 days / months
		} else if (timePeriodUnit === 'days') {
			timePeriodInEras = timePeriodValue * 4;
		}

		setEstimatedReward(totalReward * timePeriodInEras);
	};

	return (
		<div className="flex px-24 pt-12">
			<WalletConnectPopover isOpen={isOpen} />
			<div className="w-1/2">
				<h1 className="font-semibold text-3xl text-gray-800">Calculate Returns</h1>
				<div className="mt-10 mx-2">
					<h3 className="text-2xl text-gray-700">Staking Amount</h3>
					<div className="mt-3">
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
					calculate={calculateReward}
					calculationDisabled={!amount || !timePeriodValue}
					onWalletConnectClick={toggle}
				/>
				<ValidatorsList />
			</div>
		</div>
	);
};

export default RewardCalculatorPage;
