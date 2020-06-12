import { useContext, useState, useEffect, useRef } from "react";
import PolkadotApiContext from "@lib/contexts/polkadot-api";
import PolkadotExtensionContext from "@lib/contexts/polkadot-extension";
import stake from "@lib/stake";
import axios from "@lib/axios";

const HomePage = () => {
	const [validators, setValidators] = useState([]); // best validators set
	const [estimatedReward, setEstimatedReward] = useState('');
	const { apiInstance } = useContext(PolkadotApiContext);
	const { isExtensionAvailable, accounts } = useContext(PolkadotExtensionContext);

	const amountInput = useRef();

	useEffect(() => {
		// if (apiInstance && accounts.length) {
		// 	const stakeAmount = 0.3;
		// 	const validatorsStashIds = ["ELhnYFneiAP819s1t7Zmn4rs1tBbcrWVnkeGw4JYKdVp6jL", "CryxcSGhks3hR53BbaczeDwKvg1Me6RdbWHsXngFREcrH8B", "D3ii6afqaMSFvw8R2NExE1qGQ8EawDsXTduSVm9y51K3Jnb", "Fk6p456PTU6Sju2b83Cy8rU3NGFsXmWk9BrcqaMqhWW1jWf", "G7eJUS1A7CdcRb2Y3zEDvfAJrM1QtacgG6mPD1RsPTJXxPQ", "EDcqtP9vMNrk7PHEbSw1TVgccE3s2mG1xPnbvsQrJ8CWvD2", "EicrAEbyauqktQpp4CdvsF2CQy3Ju7tGGMohj3h5sAPnKHL", "Gw8h4xEHfm1icL35tJ98cZYgRKVK1MVfL9fbPkFbb5tmqSM", "ED8SS6LiptDbQZDrHCE1heKjrK6KRUz4xV95PgSba8JUvh3", "GTUi6r2LEsf71zEQDnBvBvKskQcWvK66KRqcRbdmcczaadr", "DaWieD32YURfqDC2jiQYbnXNWvPPGxF6XLH55Gk3ccBdjFy", "H4Szoc2sxXxBTF1x88pDj9DCYERFvn4oqzQNsV7y89FnD1g", "Gk6v5CXUy2cPMtVxXtN7ZUn7K5y7UFEm78xp98Uatjt2yuV", "HNxuNtuTuvxYS59eo3pUxQ73JmoTCDjVXoiaF1wGCixGeFi", "FtqCc5yLcLc1FkLyftyNuCtYFCudo3unwwPQLzCbnWppjoc", "HshTdrZiSJntTRh5oNytD2QuT38VDJHoGQmfcrtrZbViSGL"];
		// 	stake(accounts, stakeAmount, validatorsStashIds);
		// }

		axios.get('/maxyieldset').then(({ data }) => {
			setValidators(data);
		});
	}, [apiInstance, accounts]);

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
