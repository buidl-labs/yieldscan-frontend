import { useContext, useState, useEffect, useRef } from "react";
import PolkadotApiContext from "@lib/contexts/polkadot-api";
import stake from "@lib/stake";
import axios from "@lib/axios";

window.setImmediate = (cb) => cb();

const HomePage = () => {
	const [validators, setValidators] = useState([]); // best validators set
	const [estimatedReward, setEstimatedReward] = useState('');
	const { apiInstance } = useContext(PolkadotApiContext);
	const { isExtensionAvailable, accounts } = useContext(PolkadotExtensionContext);

	const amountInput = useRef();

	useEffect(() => {
		if (apiInstance && accounts.length) {
			// const stakeAmount = 200000000000;
			const stakeAmount = 0.003 * (10 ** 12);
			const validatorsStashIds = [];
			stake(accounts, stakeAmount, validatorsStashIds);
		}
	}, [apiInstance, accounts]);

	useEffect(() => {
		// axios.get('/maxyieldset').then(({ data }) => setValidators(data));
	}, []);

	const calculateReward = () => {
		const amount = amountInput.current.value / validators.length;
		let totalReward = 0;

		validators.forEach(v => {
			const stakeFraction = amount / (amount + v.totalStake);
			const reward = (
				v.estimatedPoolReward - (
					(v.commission * v.estimatedPoolReward) / 100)
				) * stakeFraction;
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
				<input type="number" className="mr-5 p-1" placeholder="Staked Amount" ref={amountInput} />
				<button className="hover:text-white hover:bg-black p-2 rounded transition duration-200" onClick={calculateReward}>
					Show me estimated reward
				</button>
				<div className="text-2xl font-black text-gray-600 mt-6" hidden={estimatedReward === ''}>
					You earn {estimatedReward} KSM 💸
				</div>
			</div>
		</div>
	);
};

export default HomePage;
