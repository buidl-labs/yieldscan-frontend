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
	Button,
} from "@chakra-ui/core";
import { PlusCircle, MinusCircle, ExternalLink } from "react-feather";
import useHover from "@components/common/hooks/useHover";
import { useState, useEffect } from "react";
import axios from "@lib/axios";
import RiskTag from "@components/reward-calculator/RiskTag";
import { noop, mapValues, keyBy, isNil, get } from "lodash";
import calculateReward from "@lib/calculate-reward";
import formatCurrency from "@lib/format-currency";
import convertArrayToObject from "@lib/convert-arr-to-object";
import { useAccounts, usePolkadotApi } from "@lib/store";
import nominate from "@lib/polkadot/nominate";
import Identicon from "@components/common/Identicon";
import ChainErrorPage from "@components/overview/ChainErrorPage";
import SuccessfullyBonded from "@components/overview/SuccessfullyBonded";
import Routes from "@lib/routes";

const ValidatorCard = ({
	name,
	stashId,
	riskScore,
	totalStake,
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
	if (type === "candidate" && isSelected) return "";

	return (
		<div
			ref={ref}
			className="relative bg-white flex justify-around items-center p-2 my-2 rounded-lg border border-gray-200 w-fit-content"
		>
			<div className="flex">
				<div>
					<Identicon address={stashId} size="2.5rem" />
				</div>
				<div
					className="text-gray-700 w-48 truncate cursor-pointer ml-2"
					onClick={onProfile}
				>
					<span className="font-semibold text-sm">
						{name
							? name.length > 16
								? name.slice(0, 6) + "..." + name.slice(-6)
								: name
							: stashId.slice(0, 6) + "..." + stashId.slice(-6) || "-"}
					</span>
					<div className="flex items-center">
						<span className="text-xs mr-2">View Profile</span>
						<ExternalLink size="12px" />
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between min-w-20-rem">
				<div className="flex flex-col">
					<span className="text-xs text-gray-500">Risk Score</span>
					<div className="rounded-full">
						<RiskTag risk={Number((riskScore || 0).toFixed(2))} />
					</div>
				</div>
				{totalStake && (
					<div className="flex flex-col">
						<span className="text-xs text-gray-500">Total Stake</span>
						<h3 className="text-lg">
							{formatCurrency.methods.formatAmount(
								Math.trunc(Number(totalStake || 0) * 10 ** 12)
							)}
						</h3>
					</div>
				)}
				<div className="flex flex-col">
					<span className="text-xs text-gray-500">Est. Pool Reward</span>
					<h3 className="text-lg">
						{formatCurrency.methods.formatAmount(
							Math.trunc(Number(estimatedReward || 0) * 10 ** 12)
						)}
					</h3>
				</div>
			</div>
			<div
				hidden={!hovered}
				className="absolute bg-white bg-opacity-25 cursor-pointer right-0 px-4 py-2"
				onClick={onClick}
			>
				{type === "candidate" && (
					<PlusCircle size="2rem" fill="#2BCACA" className="text-white" />
				)}
				{type === "selected" && (
					<MinusCircle size="2rem" fill="#e53e3e" className="text-white" />
				)}
			</div>
		</div>
	);
};

const EditValidators = withSlideIn(
	({
		styles,
		close,
		validators,
		validatorsLoading,
		currentValidators,
		onChill = noop,
	}) => {
		const toast = useToast();
		const { apiInstance } = usePolkadotApi();
		const [compounding, setCompounding] = useState(false);
		const { stashAccount, freeAmount, bondedAmount } = useAccounts();
		const [editLoading, setEditLoading] = useState(false);
		const [estimatedReward, setEstimatedReward] = useState();
		const [stakingEvent, setStakingEvent] = useState();
		const [processComplete, setProcessComplete] = useState(false);
		const [chainError, setChainError] = useState(false);
		const [errMessage, setErrMessage] = useState();
		const [transactionHash, setTransactionHash] = useState();
		const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);

		const [selectedValidatorsMap, setSelectedValidatorsMap] = useState(
			convertArrayToObject(currentValidators, "stashId")
		);

		useEffect(() => {
			apiInstance.query.staking.payee(stashAccount.address).then((payee) => {
				if (payee.isStaked) setCompounding(true);
				else {
					setCompounding(false);
				}
			});
		}, [stashAccount]);

		useEffect(() => {
			const selectedValidatorsList = Object.values(
				selectedValidatorsMap
			).filter((v) => !isNil(v));
			calculateReward(
				selectedValidatorsList,
				get(bondedAmount, "currency", 0),
				12,
				"months",
				compounding
			).then((result) => {
				setEstimatedReward(result.returns);
			});
		}, [selectedValidatorsMap, compounding]);

		const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(
			(v) => !isNil(v)
		);

		const toggleSelected = (validator) => {
			const { stashId } = validator;

			if (
				selectedValidatorsList.length === 16 &&
				!selectedValidatorsMap[stashId]
			)
				return;

			setSelectedValidatorsMap({
				...selectedValidatorsMap,
				[stashId]: isNil(selectedValidatorsMap[stashId]) ? validator : null,
			});
		};

		const onConfirm = () => {
			console.log("selectedValidatorsMap");
			console.log(selectedValidatorsMap);
			const selectedValidatorsList = Object.values(
				selectedValidatorsMap
			).filter((v) => !isNil(v));
			const stashIds = selectedValidatorsList.map(
				(validator) => validator.stashId
			);

			console.log("selectedValidatorsList");
			console.log(selectedValidatorsList);
			console.log("stashIds");
			console.log(stashIds);

			setEditLoading(true);

			const handlers = {
				onEvent: ({ message }) => {
					setStakingEvent(message);

					toast({
						title: "Info",
						description: message,
						status: "info",
						duration: 3000,
						position: "top-right",
						isClosable: true,
					});
				},
				onSuccessfullSigning: (hash) => {
					// setProcessComplete(true);
					// setStakingLoading(false);
					// setCloseOnOverlayClick(true);
					setTransactionHash(hash.message);
				},
				onFinish: (status, message, eventLogs) => {
					console.log("hello finish");
					console.log("message");
					console.log(message);
					// status = 0 for success, anything else for error code
					toast({
						title: status === 0 ? "Successful!" : "Error!",
						status: status === 0 ? "success" : "error",
						description: message,
						position: "top-right",
						isClosable: true,
						duration: 7000,
					});

					if (status === 0) {
						// setProcessComplete(true);
						setEditLoading(false);
						setCloseOnOverlayClick(true);
					} else {
						setEditLoading(false);
						setCloseOnOverlayClick(true);
						setErrMessage(message);
						if (message === "Cancelled") setChainError(true);
					}
				},
			};
			nominate(
				stashAccount.address,
				stashIds,
				true,
				apiInstance,
				handlers
			).catch((error) => {
				handlers.onFinish(1, error.message);
			});
		};

		const onProfile = (stashId) => {
			window.open(`${Routes.VALIDATOR_PROFILE}/${stashId}`, "_blank");
		};

		const handleOnClickForSuccessfulTransaction = () => {
			close();
		};

		console.log("selectedValidatorsMap");
		console.log(selectedValidatorsMap);
		console.log("selectedValidatorsList");
		console.log(selectedValidatorsList);
		console.log("currentValidators");
		console.log(currentValidators);

		return (
			<Modal
				isOpen={true}
				onClose={close}
				closeOnOverlayClick={closeOnOverlayClick}
				closeOnEsc={closeOnOverlayClick}
				isCentered
			>
				<ModalOverlay />
				<ModalContent
					rounded="lg"
					maxWidth="90vw"
					height="100%"
					maxHeight="90vh"
					{...styles}
				>
					<ModalHeader>
						<h1>Edit Validators</h1>
					</ModalHeader>
					{closeOnOverlayClick && <ModalCloseButton onClick={close} />}
					<ModalBody px="4rem">
						{validatorsLoading ? (
							<div className="flex-center w-full h-full">
								<div className="flex-center flex-col">
									<Spinner size="xl" color="teal.500" thickness="4px" />
									<span className="text-sm text-gray-600 mt-5">
										Fetching your data...
									</span>
								</div>
							</div>
						) : (
							<div>
								{!editLoading && !processComplete && !chainError && (
									<>
										<div className="flex justify-around">
											<div className="w-1/2 bg-gray-100 p-2 mr-2 rounded-lg">
												<div className="h-12 flex items-center mt-1 mx-2">
													<h3 className="text-xs tracking-widest">
														CANDIDATE VALIDATORS
													</h3>
												</div>
												<div className="my-2 overflow-y-scroll validators-table">
													{validators.map((validator) => (
														<ValidatorCard
															key={validator.stashId}
															name={validator.name}
															type="candidate"
															stashId={validator.stashId}
															riskScore={validator.riskScore}
															estimatedReward={validator.estimatedPoolReward}
															totalStake={validator.totalStake}
															onClick={() => toggleSelected(validator)}
															isSelected={
																!isNil(selectedValidatorsMap[validator.stashId])
															}
															onProfile={() => onProfile(validator.stashId)}
														/>
													))}
												</div>
											</div>
											<div className="w-1/2 border border-gray-200 p-2 rounded-lg">
												<div className="flex mx-2 justify-between items-center">
													<div className="h-12 mt-1 flex items-center justify-start">
														<h3 className="text-xs tracking-widest">
															SELECTED VALIDATORS
														</h3>
														<div className="flex items-center justify-center h-8 w-8 ml-2 text-sm rounded-full bg-gray-200 text-gray-600">
															<span>{selectedValidatorsList.length}</span>
														</div>
													</div>
													<div className="flex items-center text-sm">
														{/* <span className="mr-2">Est. Annual Returns</span>
												{estimatedReward && (
													<div className="w-32 border border-teal-500 p-1 rounded-lg flex flex-col">
														<span className="text-teal-500 text-base">
															{formatCurrency.methods.formatAmount(
																Math.trunc(
																	Number(
																		(estimatedReward.currency || 0) * 10 ** 12
																	)
																)
															)}
														</span>
														<span className="text-gray-600 text-xs">
															$
															{formatCurrency.methods.formatNumber(
																estimatedReward.subCurrency.toFixed(2)
															) || 0.0}
														</span>
													</div>
												)} */}
													</div>
												</div>
												<div className="my-2 overflow-y-scroll validators-table">
													{selectedValidatorsList.map((validator) => (
														<ValidatorCard
															key={validator.stashId}
															name={validator.name}
															type="selected"
															stashId={validator.stashId}
															riskScore={validator.riskScore}
															estimatedReward={validator.estimatedPoolReward}
															totalStake={validator.totalStake}
															onClick={() => toggleSelected(validator)}
															onProfile={() => onProfile(validator.stashId)}
															isSelected
														/>
													))}
												</div>
											</div>
										</div>
										<div className="mt-2 mb-8 flex relative">
											<button
												className="hover:underline text-gray-600 text-sm mt-2 absolute h-full"
												onClick={onChill}
											>
												Stop all nominations?
											</button>
											<div className="flex-grow flex justify-center">
												<Button
													px="8"
													py="4"
													mt="5"
													rounded="0.5rem"
													backgroundColor="teal.500"
													color="white"
													fontWeight="normal"
													onClick={onConfirm}
													isLoading={editLoading}
												>
													Confirm Selection
												</Button>
											</div>
										</div>
									</>
								)}
								{editLoading && !processComplete && !chainError && (
									<div className="mt-6">
										{/* <h1 className="font-semibold text-xl text-gray-700">Status:</h1> */}
										<div className="flex items-center justify-between">
											<span>{stakingEvent}</span>
											<Spinner className="ml-4" />
										</div>
									</div>
								)}
								{processComplete && (
									<SuccessfullyBonded
										transactionHash={transactionHash}
										onConfirm={handleOnClickForSuccessfulTransaction}
									/>
								)}
								{chainError && (
									<ChainErrorPage
										transactionHash={transactionHash}
										onConfirm={handleOnClickForSuccessfulTransaction}
										errMessage={errMessage}
									/>
								)}
							</div>
						)}
						<style jsx>{`
							.validators-table {
								height: 57vh;
							}
						`}</style>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}
);

export default EditValidators;
