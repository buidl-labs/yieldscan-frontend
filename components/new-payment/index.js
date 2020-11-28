import { useState } from "react";
import { useToast, Spinner } from "@chakra-ui/core";
import { get, chain } from "lodash";
import {
	Modal,
	ModalBody,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import * as Sentry from "@sentry/node";
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
	networkInfo,
}) => {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [chainError, setChainError] = useState(false);

	const { apiInstance } = usePolkadotApi();
	const { setTransactionState, ...transactionState } = useTransaction();

	const [stakingEvent, setStakingEvent] = useState();
	const [processComplete, setProcessComplete] = useState(false);
	const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);
	const [errMessage, setErrMessage] = useState();
	const [transactionHash, setTransactionHash] = useState();
	const [stakingLoading, setStakingLoading] = useState(false);
	const toast = useToast();
	const rewardDestination = compounding ? 0 : 1;

	const SuccessfullyBonded = ({ transactionHash, onConfirm, networkInfo }) => {
		return (
			<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
				<img src="/images/polkadot-successfully-bonded.png" width="200px" />
				<h3 className="mt-4 text-2xl">
					Your staking request is successfully sent to the {networkInfo.denom}{" "}
					network
				</h3>
				<span className="mt-1 px-4 text-sm text-gray-500">
					Your transaction is successfully sent to the network. You can safely
					close this page now. You can view the status of this transaction using
					the link below:
				</span>
				<a
					href={`https://${networkInfo.coinGeckoDenom}.subscan.io/block/${transactionHash}`}
					className="mt-6 text-blue-400"
					target="_blank"
				>
					Track this transaction on Subscan
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

	const ChainErrorPage = ({ onConfirm, errMessage }) => {
		return (
			<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
				<img src="/images/polkadot_alert.png" width="200px" />
				<h3 className="mt-4 text-2xl">
					Oops. There was an error processing this staking request
				</h3>
				<span className="mt-1 px-4 text-sm text-gray-500">
					If you think this is an error on our part, please share this with the
					help center and we will do our best to help. We typically respond
					within 2-3 days.
				</span>
				{/* <a
					href={`https://polkascan.io/kusama/transaction/${transactionHash}`}
					className="mt-6 text-gray-500"
					target="_blank"
				>
					Track this transaction on PolkaScan
				</a> */}
				<button
					className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
					onClick={onConfirm}
				>
					Retry
				</button>
				<button
					className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
					onClick={() =>
						Sentry.showReportDialog({
							eventId: Sentry.captureException(errMessage),
						})
					}
				>
					Share this with the help center
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

		trackEvent(Events.INTENT_TRANSACTION, {
			transactionType: !!transactionState.stakingAmount ? "STAKE" : "NOMINATE",
			stakingAmount: get(transactionState, "stakingAmount"),
			riskPreference: get(transactionState, "riskPreference"),
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
						stakingAmount: get(transactionState, "stakingAmount"),
						riskPreference: get(transactionState, "riskPreference"),
						successMessage: message,
					});
				} else {
					trackEvent(Events.TRANSACTION_FAILED, {
						stakingAmount: get(transactionState, "stakingAmount"),
						riskPreference: get(transactionState, "riskPreference"),
						errorMessage: message,
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
						setCloseOnOverlayClick(true);
						setStakingLoading(false);
					}
				} else {
					setStakingLoading(false);
					setCloseOnOverlayClick(true);
					if (message !== "Cancelled") {
						setErrMessage(message);
						setChainError(true);
					}
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
					handlers,
					networkInfo
				).catch((error) => {
					handlers.onFinish(1, error.message);
				});
			}
		} else {
			const nominations = transactionState.selectedValidators.map(
				(v) => v.stashId
			);
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
					{currentStep === 0 && !processComplete && !chainError && (
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
							networkInfo={networkInfo}
						/>
					)}
					{currentStep === 1 && !processComplete && !chainError && (
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
							transactionHash={transactionHash}
							handlePopoverClose={handlePopoverClose}
							networkInfo={networkInfo}
						/>
					)}
					{processComplete && (
						<SuccessfullyBonded
							transactionHash={transactionHash}
							onConfirm={handleOnClickForSuccessfulTransaction}
							networkInfo={networkInfo}
						/>
					)}
					{chainError && (
						<ChainErrorPage
							// transactionHash={transactionHash}
							onConfirm={handleOnClickForSuccessfulTransaction}
							errMessage={errMessage}
							networkInfo={networkInfo}
						/>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export { PaymentPopover };
