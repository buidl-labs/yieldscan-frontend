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
	Input,
	Button
} from "@chakra-ui/core";
import { PlusCircle, MinusCircle, ExternalLink } from "react-feather";
import useHover from "@components/common/hooks/useHover";
import { useState, useEffect } from "react";
import axios from "@lib/axios";
import RiskTag from "@components/reward-calculator/RiskTag";
import { noop, mapValues, keyBy, isNil, get } from "lodash";
import calculateReward from "@lib/calculate-reward";
import { useAccounts, usePolkadotApi } from "@lib/store";
import nominate from "@lib/polkadot/nominate";
import Identicon from "@components/common/Identicon";
import Routes from "@lib/routes";

const ValidatorCard = ({
	name,
	stashId,
	riskScore,
	stakedAmount,
	estimatedReward,
	isSelected = false,
	type,
	onClick = noop,
	onProfile = noop,
}) => {
	const [ref, hovered] = useHover();

	/**
	 * hacky solution but super efficient since it saves us to update the actual validator list
	 */
	if (type === 'candidate' && isSelected) return '';

	return (
		<div ref={ref} className="relative bg-white flex justify-around items-center p-2 my-2 rounded-lg border border-gray-300">
			<div><Identicon address={stashId} size="2.5rem" /></div>
			<div className="text-gray-700 w-48 truncate cursor-pointer" onClick={onProfile}>
				<span className="font-semibold text-sm">{name || stashId.slice(0, 18) + '...' || '-' }</span>
				<div className="flex items-center">
					<span className="text-xs mr-2">View Profile</span>
					<ExternalLink size="12px" />
				</div>
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
				<div className="rounded-full font-semibold"><RiskTag risk={Number((riskScore || 0).toFixed(2))} /></div>
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Staked Amount</span>
				<h3 className="text-lg">{(stakedAmount || 0).toFixed(1)} KSM</h3>
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-gray-500 font-semibold">Estimated Pool Reward</span>
				<h3 className="text-lg">{(estimatedReward || 0).toFixed(4)} KSM</h3>
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
	const [selectedValidatorsMap, setSelectedValidatorsMap] = useState({});

	useEffect(() => {
		if (currentValidators) {
			Promise.all([
				axios.get('/rewards/risk-set'),
				axios.get(`/validator/multi?stashIds=${currentValidators.join(',')}`),
			]).then(([{ data: data1  }, { data: data2 }]) => {
				const validators = data1.totalset;
				setValidators(validators);
				setSelectedValidatorsMap(mapValues(keyBy(data2, 'stashId')));
			}).catch(() => {
				toast({
					title: 'Error',
					description: 'Something went wrong!',
					position: 'top-right',
					duration: 3000,
					status: 'error',
				});
				close();
			}).finally(() => {
				setValidatorsLoading(false);
			});
		}
	}, [currentValidators]);

	useEffect(() => {
		const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(v => !isNil(v));
		calculateReward(
			selectedValidatorsList,
			get(bondedAmount, 'currency', 0),
			1,
			'months',
			false,
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
				setEditLoading(false);
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

	const onProfile = (stashId) => {
		window.open(`${Routes.VALIDATOR_PROFILE}/${stashId}`, '_blank')
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
												name={validator.name}
												type="candidate"
												stashId={validator.stashId}
												riskScore={validator.riskScore}
												estimatedReward={validator.estimatedPoolReward}
												stakedAmount={validator.totalStake}
												onClick={() => toggleSelected(validator)}
												isSelected={!isNil(selectedValidatorsMap[validator.stashId])}
												onProfile={() => onProfile(validator.stashId)}
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
												name={validator.name}
												type="selected"
												stashId={validator.stashId}
												riskScore={validator.riskScore}
												estimatedReward={validator.estimatedPoolReward}
												stakedAmount={validator.totalStake}
												onClick={() => toggleSelected(validator)}
												onProfile={() => onProfile(validator.stashId)}
												isSelected
											/>
										))}
									</div>
								</div>
							</div>
							<div className="mt-2 flex-center flex-col">
								<Button
									px="8"
									py="2"
									mt="5"
									rounded="0.5rem"
									backgroundColor="teal.500"
									color="white"
									onClick={onConfirm}
									isLoading={editLoading}
								>
									Confirm Edit
								</Button>
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
