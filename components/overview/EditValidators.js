import withSlideIn from "@components/common/withSlideIn";
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
import { PlusCircle, MinusCircle } from "react-feather";
import useHover from "@components/common/hooks/useHover";
import { useState, useEffect } from "react";
import axios from "@lib/axios";
import RiskTag from "@components/reward-calculator/RiskTag";
import { noop, mapValues, keyBy, isNil, get } from "lodash";
import calculateReward from "@lib/calculate-reward";
import { useAccounts, usePolkadotApi } from "@lib/store";
import nominate from "@lib/polkadot/nominate";

const ValidatorCard = ({
	stashId,
	riskScore,
	stakedAmount,
	estimatedReward,
	isSelected = false,
	type,
	onClick = noop,
}) => {
	const [ref, hovered] = useHover();

	/**
	 * hacky solution but super efficient since it saves us to update the actual validator list
	 */
	if (type === 'candidate' && isSelected) return '';

	return (
		<div ref={ref} className="relative bg-white flex justify-around items-center p-2 my-2 rounded-lg border border-gray-300">
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
			<div hidden={!hovered} className="absolute bg-white bg-opacity-25 cursor-pointer right-0 px-4 py-2" onClick={onClick}>
				{type === 'candidate' && <PlusCircle size="2rem" fill="#2BCACA" className="text-white" />}
				{type === 'selected' && <MinusCircle size="2rem" fill="#e53e3e" className="text-white" />}
			</div>
		</div>
	);
};

const EditValidators = withSlideIn(({ styles, close, currentValidators, onChill = noop }) => {
	const toast = useToast();
	const { apiInstance } = usePolkadotApi();
	const { stashAccount, freeAmount, bondedAmount } = useAccounts();
	const [validators, setValidators] = useState([]);
	const [editLoading, setEditLoading] = useState(false);
	const [estimatedReward, setEstimatedReward] = useState();
	const [validatorsLoading, setValidatorsLoading] = useState(true);
	const [selectedValidatorsMap, setSelectedValidatorsMap] = useState(
		mapValues(keyBy(currentValidators, 'stashId'))
	);

	useEffect(() => {
		axios.get('/rewards/risk-set').then(({ data }) => {
			const validators = data.totalset;
			setValidators(validators);
			setValidatorsLoading(false);
		});
	}, []);

	useEffect(() => {
		const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(v => !isNil(v));
		calculateReward(
			selectedValidatorsList,
			get(freeAmount, 'currency', 0),
			1,
			'months',
			false,
			bondedAmount
		).then(result => {
			setEstimatedReward(result.returns.currency);
		});
	}, [selectedValidatorsMap]);

	const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(v => !isNil(v));

	const toggleSelected = (validator) => {
		const { stashId } = validator;

		if (selectedValidatorsList.length === 16 && !selectedValidatorsMap[stashId]) return;

		setSelectedValidatorsMap({
			...selectedValidatorsMap,
			[stashId]: isNil(selectedValidatorsMap[stashId]) ? validator : null,
		});
	};

	const onConfirm = () => {
		const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(v => !isNil(v));
		const stashIds = selectedValidatorsList.map(validator => validator.stashId);

		setEditLoading(true);
		nominate(
			stashAccount.address,
			stashIds,
			apiInstance,
			{
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
					setEditLoading(false);
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
			<ModalContent rounded="lg" maxWidth="90vw" height="90vh" {...styles}>
				<ModalHeader>
					<h1>Edit Validators</h1>
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
								<div className="w-1/2 bg-gray-300 p-2 mr-2 rounded-lg">
									<div className="">
										<h3 className="font-semibold">CANDIDATE VALIDATORS</h3>
									</div>
									<div className="my-2 overflow-y-scroll validators-table">
										{validators.map(validator => (
											<ValidatorCard
												key={validator.stashId}
												type="candidate"
												stashId={validator.stashId}
												riskScore={validator.riskScore}
												estimatedReward={validator.estimatedPoolReward}
												stakedAmount={validator.totalStake}
												onClick={() => toggleSelected(validator)}
												isSelected={!isNil(selectedValidatorsMap[validator.stashId])}
											/>
										))}
									</div>
								</div>
								<div className="w-1/2 border border-gray-300 p-2 rounded-lg">
									<div className="flex justify-between items-center">
										<h3 className="font-semibold">
											SELECTED VALIDATORS
											<span className="p-1 ml-2 text-sm rounded-full bg-gray-300 text-gray-600 font-semibold">
												{selectedValidatorsList.length}
											</span>
										</h3>
										<div className="flex items-center text-sm">
											<span className="mr-2">Estimated Monthly Returns</span>
											<div className="w-32 border border-teal-500 text-teal-500 p-1 rounded-lg">
												{estimatedReward.toFixed(2)} KSM
											</div>
										</div>
									</div>
									<div className="my-2 overflow-y-scroll validators-table">
										{selectedValidatorsList.map(validator => (
											<ValidatorCard
												key={validator.stashId}
												type="selected"
												stashId={validator.stashId}
												riskScore={validator.riskScore}
												estimatedReward={validator.estimatedPoolReward}
												stakedAmount={validator.totalStake}
												onClick={() => toggleSelected(validator)}
												isSelected
											/>
										))}
									</div>
								</div>
							</div>
							<div className="mt-2 flex-center flex-col">
								<button
									className="flex-center rounded-lg bg-teal-500 text-white px-5 py-2"
									onClick={onConfirm}
									disabled={editLoading}
								>
									<span>Confirm Edit</span>
									{editLoading && <Spinner size="sm" ml="4px" />}
								</button>
								<button
									className="hover:underline text-gray-600 text-sm mt-2"
									onClick={onChill}
								>
									Stop all nominations
								</button>
							</div>
						</div>
					)}
					<style jsx>{`
						.validators-table {
							height: 60vh;
						}
					`}</style>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditValidators;
