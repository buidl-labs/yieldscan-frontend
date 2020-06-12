import { useState, useEffect, useRef } from "react";
import axios from "@lib/axios";

const RewardCalculatorPage = () => {
	const [validatorMap, setValidatorMap] = useState({}); // map with low/med/high risk sets
	const [estimatedReward, setEstimatedReward] = useState('');
	const [selectedRisk, setSelectedRisk] = useState('low');

	const amountInput = useRef();

	useEffect(() => {
		axios.get('/yieldwithrisk').then(({ data }) => {
			setValidatorMap({
				low: data[0].lowriskset,
				med: data[1].medriskset,
				high: data[2].highriskset,
			});
		});
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
		<div className="m-10">
			<h1 className="text-5xl text-black font-black">
				Welcome to YieldScan!
			</h1>
			<div className="mt-10 shadow p-5">
				<div>
					<input type="number" className="mr-5 p-1" placeholder="Staked Amount" ref={amountInput} />
					<button className="hover:text-white hover:bg-black p-2 rounded transition duration-200" onClick={calculateReward}>
						Show me estimated reward
					</button>
				</div>
				<div>
					<select value={selectedRisk} onChange={ev => setSelectedRisk(ev.target.value)}>
						<option value="low">low</option>
						<option value="med">med</option>
						<option value="high">high</option>
					</select>
				</div>
				<div className="text-2xl font-black text-gray-600 mt-6" hidden={estimatedReward === ''}>
					You earn {estimatedReward} KSM with {selectedRisk} risk 💸
				</div>
			</div>
			{estimatedReward && (
				<div className="mt-5 shadow p-10">
					<h3 className="text-gray-600 font-thin text-2xl">Validator List</h3>
					{validatorMap[selectedRisk].map(validator => (
						<div key={validator.name}>
							<span>{validator.name}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default RewardCalculatorPage;
