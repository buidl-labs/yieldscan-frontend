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
	const [currentStep, setCurrentStep] = useState(0);

	const { apiInstance } = usePolkadotApi();
	const { setTransactionState, ...transactionState } = useTransaction();

	const [stakingEvent, setStakingEvent] = useState();
	const [stakingLoading, setStakingLoading] = useState(false);
	const toast = useToast();
	const rewardDestination = compounding ? 0 : 1;

	const transact = () => {
		setStakingLoading(true);

		trackEvent(Events.INTENT_TRANSACTON, {
			transactionType: !!transactionState.stakingAmount ? "STAKE" : "NOMINATE",
			transactionState,
		});

		const handlers = {
			onEvent: (eventInfo) => {
				setStakingEvent(eventInfo.message);
			},
			onSuccessfullSigning: (hash) => {
				setStakingLoading(false);
				setTransactionHash(hash.message);
			},
			onFinish: (status, message, eventLogs) => {
				// status = 0 for success, anything else for error code
				toast({
					title: status === 0 ? "Successful!" : "Error!",
					status: status === 0 ? "success" : "error",
					description: message,
					position: "top-right",
					isClosable: true,
					duration: 7000,
				});
				setStakingLoading(false);

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
					// To allow the user to switch accounts and networks after the payment process is complete
					setHeaderLoading(false);
					// router.replace("/overview");
				}
			},
		};

		if (stakingAmount) {
			stake(
				stashAccount.address,
				stashAccount.address,
				stakingAmount,
				get(bondedAmount, "currency", 0),
				rewardDestination,
				selectedValidators.map((v) => v.stashId),
				apiInstance,
				handlers
			).catch((error) => {
				handlers.onFinish(1, error.message);
			});
		} else {
			const nominations = transactionState.selectedValidators.map(
				(v) => v.stashId
			);
			nominate(stashAccount.address, nominations, apiInstance, handlers).catch(
				(error) => {
					handlers.onFinish(1, error.message);
				}
			);
		}
	};

	const handleSelectionConfirmation = () => {
		bondedAmount.currency !== stakingAmount.currency
			? setCurrentStep(1)
			: transact();
	};

	const handlePopoverClose = () => {
		setCurrentStep(0);
		console.log("hey");
		closePaymentPopover();
	};

	console.log("stakingEvent inside payment");
	console.log(stakingEvent);
	console.log(stashAccount);
	// console.log(controller);
	console.log(stakingAmount);
	console.log(get(bondedAmount, "currency", 0));
	// console.log(rewardDestination);
	console.log(selectedValidators.map((v) => v.stashId));

	return (
		<Modal
			isOpen={isPaymentPopoverOpen}
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
				<ModalCloseButton
					onClick={handlePopoverClose}
					boxShadow="0 0 0 0 #fff"
					color="gray.400"
					backgroundColor="gray.100"
					rounded="1rem"
					mt={4}
					mr={4}
				/>
				<ModalBody>
					{currentStep === 0 && (
						<ConfirmSelection
							stakingAmount={stakingAmount}
							validators={validators}
							selectedValidators={selectedValidators}
							setSelectedValidators={setSelectedValidators}
							onAdvancedSelection={onAdvancedSelection}
							bondedAmount={bondedAmount}
							handleSelectionConfirmation={handleSelectionConfirmation}
							result={result}
						/>
					)}
					{currentStep === 1 && (
						<ConfirmAmountChange
							stakingAmount={stakingAmount}
							validators={validators}
							selectedValidators={selectedValidators}
							setSelectedValidators={setSelectedValidators}
							onAdvancedSelection={onAdvancedSelection}
							bondedAmount={bondedAmount}
							onConfirm={transact}
							handlePopoverClose={handlePopoverClose}
						/>
					)}
					{/* {currentStep === 1 && (
						<ConfirmAmountChange
							stakingAmount={stakingAmount}
							validators={validators}
							selectedValidators={selectedValidators}
							setSelectedValidators={setSelectedValidators}
							onAdvancedSelection={onAdvancedSelection}
						/>
					)} */}
					{/* {state === WalletConnectStates.DISCLAIMER && (
						<WalletDisclaimer
							onCreate={() => setState(WalletConnectStates.CREATE)}
						/>
					)}
					{state === WalletConnectStates.CREATE && (
						<CreateWallet
							onPrevious={() => setState(WalletConnectStates.DISCLAIMER)}
							onNext={() => setState(WalletConnectStates.IMPORT)}
						/>
					)}
					{state === WalletConnectStates.IMPORT && (
						<ImportAccount
							onPrevious={() => setState(WalletConnectStates.CREATE)}
							onNext={() => setState(WalletConnectStates.CONNECTED)}
						/>
					)} */}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export { PaymentPopover };
