import { useState } from "react";
import { useToast, Spinner } from "@chakra-ui/core";
import { get } from "lodash";
import {
	Modal,
	ModalBody,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import ConfirmSelection from "./ConfirmSelection";
import ConfirmAmountChange from "./ConfirmAmountChange";
import { useTransaction, usePolkadotApi } from "@lib/store";
import stake from "@lib/stake";
import nominate from "@lib/polkadot/nominate";
import { trackEvent, Events } from "@lib/analytics";

const PaymentPopover = ({
	styles,
	stakingAmount,
	stashAccount,
	validators,
	selectedValidators,
	setSelectedValidators,
	onAdvancedSelection,
	compounding,
	bondedAmount,
	isPaymentPopoverOpen,
	closePaymentPopover,
	result,
}) => {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);

	const { apiInstance } = usePolkadotApi();
	const { setTransactionState, ...transactionState } = useTransaction();

	const [stakingEvent, setStakingEvent] = useState();
	const [processComplete, setProcessComplete] = useState(false);
	const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);
	const [transactionHash, setTransactionHash] = useState();
	const [stakingLoading, setStakingLoading] = useState(false);
	const toast = useToast();
	const rewardDestination = compounding ? 0 : 1;

	const SuccessfullyBonded = ({ transactionHash, onConfirm }) => {
		return (
			<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
				<img src="/images/polkadot-successfully-bonded.png" width="200px" />
				<h3 className="mt-4 text-2xl">
					Your staking request is successfully sent to the KSM network
				</h3>
				<span className="mt-1 px-4 text-sm text-gray-500">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam.
				</span>
				<a
					href={`https://polkascan.io/kusama/transaction/${transactionHash}`}
					className="mt-6 text-gray-500"
					target="_blank"
				>
					Track this transaction on PolkaScan
				</a>
				<button
					className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
					onClick={onConfirm}
				>
					Proceed
				</button>
			</div>
		);
	};

	const handleOnClickForSuccessfulTransaction = () => {
		router.replace("/overview");
	};

	const transact = () => {
		setStakingLoading(true);
		setCloseOnOverlayClick(false);

		trackEvent(Events.INTENT_TRANSACTON, {
			transactionType: !!transactionState.stakingAmount ? "STAKE" : "NOMINATE",
			transactionState,
		});

		const handlers = {
			onEvent: (eventInfo) => {
				setStakingEvent(eventInfo.message);
			},
			onSuccessfullSigning: (hash) => {
				// setProcessComplete(true);
				// setStakingLoading(false);
				// setCloseOnOverlayClick(true);
				setTransactionHash(hash.message);
			},
			onFinish: (status, message, isNominateOnly, eventLogs) => {
				console.log("hello finish");
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
					trackEvent(Events.TRANSACTION_SUCCESS, {
						transactionState,
						successMessage: message,
					});
				} else {
					trackEvent(Events.TRANSACTION_FAILED, {
						transactionState,
						successMessage: message,
						eventLogs,
					});
				}

				if (status === 0) {
					if (isNominateOnly) {
						setProcessComplete(true);
						setStakingLoading(false);
						setCloseOnOverlayClick(true);
					} else {
						setCurrentStep(1);
						setStakingLoading(false);
					}
				} else {
					setStakingLoading(false);
					setCloseOnOverlayClick(true);
				}
			},
		};

		if (stakingAmount.currency != bondedAmount.currency) {
			if (currentStep == 0) {
				nominate(
					stashAccount.address,
					selectedValidators.map((v) => v.stashId),
					false,
					apiInstance,
					handlers
				).catch((error) => {
					handlers.onFinish(1, error.message);
				});
			}
			if (currentStep == 1) {
				stake(
					stashAccount.address,
					stashAccount.address,
					get(stakingAmount, "currency", 0),
					get(bondedAmount, "currency", 0),
					rewardDestination,
					selectedValidators.map((v) => v.stashId),
					apiInstance,
					handlers
				).catch((error) => {
					handlers.onFinish(1, error.message);
				});
			}
		} else {
			const nominations = transactionState.selectedValidators.map(
				(v) => v.stashId
			);
			console.log("nominations");
			console.log(nominations);
			nominate(
				stashAccount.address,
				nominations,
				true,
				apiInstance,
				handlers
			).catch((error) => {
				handlers.onFinish(1, error.message);
			});
		}
	};

	const handleSelectionConfirmation = () => {
		bondedAmount.currency !== stakingAmount.currency
			? setCurrentStep(1)
			: transact();
	};

	const handlePopoverClose = () => {
		setCurrentStep(0);
		setProcessComplete(false);
		closePaymentPopover();
	};

	console.log("stakingEvent inside payment");
	console.log(stakingEvent);
	console.log(stashAccount);
	// console.log(controller);
	console.log("stakingAmount");
	console.log(stakingAmount);
	console.log(get(bondedAmount, "currency", 0));
	// console.log(rewardDestination);
	console.log(selectedValidators.map((v) => v.stashId));

	return (
		<Modal
			isOpen={isPaymentPopoverOpen}
			closeOnOverlayClick={closeOnOverlayClick}
			closeOnEsc={closeOnOverlayClick}
			onClose={handlePopoverClose}
			isCentered
		>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth={"40rem"} {...styles} py={4}>
				<ModalHeader>
					{/* {[
						WalletConnectStates.DISCLAIMER,
						WalletConnectStates.CREATE,
						WalletConnectStates.IMPORT,
					].includes(state) ? (
						<div
							className="text-sm flex-center px-2 py-1 text-gray-700 bg-gray-200 rounded-xl w-40 font-normal cursor-pointer"
							onClick={() => setState(WalletConnectStates.INTRO)}
						>
							<ChevronLeft />
							<span>Wallet Connect</span>
						</div>
					) : (
						state === WalletConnectStates.CONNECTED && (
							<h3 className="px-3 text-2xl text-left self-start">
								Select Account for Staking
							</h3>
						)
					)} */}
				</ModalHeader>
				{closeOnOverlayClick && (
					<ModalCloseButton
						onClick={handlePopoverClose}
						boxShadow="0 0 0 0 #fff"
						color="gray.400"
						backgroundColor="gray.100"
						rounded="1rem"
						mt={4}
						mr={4}
					/>
				)}
				<ModalBody>
					{currentStep === 0 && !processComplete && (
						<ConfirmSelection
							stakingAmount={stakingAmount}
							validators={validators}
							selectedValidators={selectedValidators}
							setSelectedValidators={setSelectedValidators}
							onAdvancedSelection={onAdvancedSelection}
							bondedAmount={bondedAmount}
							stakingLoading={stakingLoading}
							stakingEvent={stakingEvent}
							handleSelectionConfirmation={transact}
							result={result}
						/>
					)}
					{currentStep === 1 && !processComplete && (
						<ConfirmAmountChange
							stakingAmount={stakingAmount}
							validators={validators}
							selectedValidators={selectedValidators}
							setSelectedValidators={setSelectedValidators}
							onAdvancedSelection={onAdvancedSelection}
							bondedAmount={bondedAmount}
							stakingLoading={stakingLoading}
							stakingEvent={stakingEvent}
							onConfirm={transact}
							handlePopoverClose={handlePopoverClose}
						/>
					)}
					{processComplete && (
						<SuccessfullyBonded
							transactionHash={transactionHash}
							onConfirm={handleOnClickForSuccessfulTransaction}
						/>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export { PaymentPopover };
