import { useState, useEffect } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	Spinner,
	useToast,
	Input
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import RiskTag from "@components/reward-calculator/RiskTag";
import { random, get } from "lodash";
import calculateReward from "@lib/calculate-reward";
import updateFunds from "@lib/polkadot/update-funds";
import { usePolkadotApi, useAccounts } from "@lib/store";

const ValidatorCard = ({
	stashId,
	riskScore,
	stakedAmount,
	estimatedReward,
}) => (
	<div className="flex justify-around items-center py-2 my-2 rounded-lg cursor-pointer border border-gray-300">
		<img src="http://placehold.it/255" className="rounded-full w-10 h-10 mr-4" />
		<h3 className="text-gray-700 text-xs w-48 truncate">{stashId}</h3>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
			<div className="rounded-full font-semibold"><RiskTag risk={Number(riskScore.toFixed(2))} /></div>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Staked Amount</span>
			<h3 className="text-lg">{stakedAmount.toFixed(1)} KSM</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Estimated Reward</span>
			<h3 className="text-lg">{estimatedReward.toFixed(4)} KSM</h3>
		</div>
	</div>
);

const FundsUpdate = withSlideIn(({ styles, type, close, validators, bondedAmount }) => {
	const toast = useToast();
	const { stashAccount } = useAccounts();
	const { apiInstance } = usePolkadotApi();
	const [amount, _setAmount] = useState('');
	const [updatingFunds, setUpdatingFunds] = useState(false);
	const [estimatedReturns, setEstimatedReturns] = useState();
	const [totalStakingAmount, setTotalStakingAmount] = useState(0);
	const [validatorsLoading, setValidatorsLoading] = useState(true);
	const title = `${type === 'bond' ? 'Bond Additional' : 'Unbond'} Funds`;

	useEffect(() => {
		setTimeout(() => {
			setValidatorsLoading(false);
		}, random(1000, 3000));
	}, []);

	useEffect(() => {
		let amountByType = amount * (type === 'bond' ? 1 : -1);
		const totalStakingAmount = Math.max(get(bondedAmount, 'currency', 0) + amountByType, 0);
		const timePeriodValue = 1, timePeriodUnit = 'months', compounding = false;

		calculateReward(
			validators,
			totalStakingAmount,
			timePeriodValue,
			timePeriodUnit,
			compounding,
			bondedAmount
		).then(result => {
			setTotalStakingAmount(totalStakingAmount);
			setEstimatedReturns(get(result, 'returns.currency', 0));
		});
	}, [amount]);

	const setAmount = (value) => {
		if (value < 0) return;
		_setAmount(value === '' ? '' : Number(value));
	};

	const onConfirm = () => {
		setUpdatingFunds(true);
		updateFunds(type, stashAccount.address, amount, apiInstance, {
			onEvent: ({ message }) => {
				toast({
					title: 'Info',
					description: message,
					status: 'info',
					duration: 3000,
					position: 'top-right',
					isClosable: true,
				});
			},
			onFinish: (failed, message) => {
				toast({
					title: failed ? 'Failure' : 'Success',
					description: message,
					status: failed ? 'error' : 'success',
					duration: 3000,
					position: 'top-right',
					isClosable: true,
				});
				setUpdatingFunds(false);
				close();
			},
		}).catch(error => {
			toast({
				title: 'Error',
				description: error.message,
				status: 'error',
				duration: 3000,
				position: 'top-right',
				isClosable: true,
			});
		});
	};

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="90vw" height="84vh" {...styles}>
				<ModalHeader>
				<h1>{title}</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody px="4rem">
					{validatorsLoading ? (
						<div className="flex flex-col items-center justify-center mt-40">
							<Spinner size="lg" />
							<span className="mt-5 text-sm text-gray-600">Quick deep breath...</span>
						</div>
					) : (
						<div>
							<div className="flex justify-around">
								<div className="border border-gray-200 p-10 rounded-lg text-gray-800 w-1/3">
									<div>
										<h3 className="text-xl">Currently Bonded</h3>
										<h1 className="text-3xl">{get(bondedAmount, 'currency', 0)} KSM</h1>
										<span className="text-lg text-gray-600">${get(bondedAmount, 'currency', 0) * 2}</span>
									</div>
									<div className="mt-10">
										<h3>{title}</h3>
										<div className="flex items-center border border-gray-200 rounded-lg">
											<input
												type="number"
												className={`
													rounded outline-none p-2 font-semibold text-xl rounded-lg
													${type === 'bond' ? 'text-teal-500' : 'text-red-500'}
												`}
												placeholder="Enter amount"
												value={amount}
												onChange={ev => setAmount(ev.target.value)}
											/>
											<span className={`${type === 'bond' ? 'text-teal-500' : 'text-red-500'} font-semibold ml-2`}>
												KSM
											</span>
										</div>
									</div>
									<div className="mt-10">
										<h3 className="text-xl">Total Staking Amount</h3>
										<h1 className="text-3xl">{totalStakingAmount.toFixed(4)} KSM</h1>
										<span className="text-lg text-gray-600">${(totalStakingAmount * 2).toFixed(4)}</span>
									</div>
								</div>
								
								<div className="border border-gray-200 rounded-lg w-2/3">
									<div className="flex justify-between items-center px-4 py-2 text-gray-700">
										<h3 className="text-lg font-semibold">VALIDATORS</h3>
										<div className="flex items-center">
											<span className="mr-2 text-sm">Estimated Monthly Returns</span>
											<div className="py-1 px-2 flex flex-col rounded-lg border border-teal-500 w-40">
												<h3 className="text-teal-500">{estimatedReturns} KSM</h3>
												<span hidden className="text-gray-600 text-sm">${estimatedReturns * 2}</span>
											</div>
										</div>
									</div>
									<div className="validator-table overflow-y-scroll px-4">
										{validators.map(validator => (
											<ValidatorCard
												key={validator.stashId}
												stashId={validator.stashId}
												riskScore={validator.riskScore}
												stakedAmount={validator.totalStake}
												estimatedReward={validator.estimatedPoolReward}
											/>
										))}
									</div>
								</div>
							</div>
							<div className="flex-center">
								<button
									className={`
										px-8 py-2 mt-5 rounded-lg text-white
										${!amount ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-500'}
									`}
									disabled={!amount}
									onClick={onConfirm}
								>
									<span>Confirm</span>
									{updatingFunds && <Spinner size="sm" ml="4px" />}
								</button>
							</div>
						</div>
					)}
					<style jsx>{`
						.validator-table {
							height: 56vh;
						}
					`}</style>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default FundsUpdate;
