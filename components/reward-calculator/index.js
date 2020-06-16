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
	const [compounding, setCompounding] = useState(true);
	const [validatorMap, setValidatorMap] = useState({}); // map with low/med/high risk sets
	const [estimatedReward, setEstimatedReward] = useState('');
	const [selectedRisk, setSelectedRisk] = useState('low');

	useEffect(() => {
		// axios.get('/yieldwithrisk').then(({ data }) => {
		// 	setValidatorMap({
		// 		low: data[0].lowriskset,
		// 		med: data[1].medriskset,
		// 		high: data[2].highriskset,
		// 	});
		// });
	}, []);

	const calculateReward = () => {
		const validators = validatorMap[selectedRisk];
		const amount = amountInput.current.value / validators.length;

		let totalReward = 0;

		validators.forEach(v => {
			const stakeFraction = amount / (amount + v.totalStake);
			const reward = (v.estimatedPoolReward - v.commission) * stakeFraction;
			totalReward += reward;
		});

		setEstimatedReward(totalReward);
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
						<RiskSelect />
					</div>
					<h3 className="text-2xl mt-10 text-gray-700">Time Period</h3>
					<div className="mt-3">
						<TimePeriodInput />
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
					onWalletConnectClick={toggle}
				/>
				<ValidatorsList />
			</div>
		</div>
	);
};

export default RewardCalculatorPage;
