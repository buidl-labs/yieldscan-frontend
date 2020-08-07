import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "react-feather";
import Confirmation from "./Confirmation";
import RewardDestination from "./RewardDestination";
import Transaction from "./Transaction";
import { useAccounts, useTransaction, usePolkadotApi } from "@lib/store";
import stake from "@lib/stake";
import { useToast, Spinner } from "@chakra-ui/core";
import { useRouter } from "next/router";
import nominate from "@lib/polkadot/nominate";
import { trackEvent } from "@lib/analytics";

const Steps = ({ steps, currentStep }) => (
	<>
		<div className="cursor-default select-none steps-container flex justify-start items-center text-lg font-semibold">
			{steps.map((step, index) => (
				<React.Fragment key={index}>
					<div className="flex items-center">
						<div
							className={`
								px-3 py-1 rounded-full text-white mr-4
								${index > currentStep ? 'bg-gray-500' : 'bg-teal-500'}
							`}
						>
							{index + 1}
						</div>
						<div className={index > currentStep ? 'text-gray-500' : 'text-teal-500'}>{step}</div>
					</div>
					{index !== steps.length - 1 && <ChevronRight className="text-gray-600 mx-5" />}
				</React.Fragment>
			))}
		</div>
	</>
);

// TODO: add `back` button from `payments` to `reward-calculator` and calculator state should be maintained
const Payment = () => {
	const toast = useToast();
	const router = useRouter();
	const { apiInstance } = usePolkadotApi();
	const [currentStep, setCurrentStep] = useState(0);
	const { accounts, stashAccount, bondedAmount } = useAccounts();
	const { setTransactionState, ...transactionState } = useTransaction();

	const [stakingEvent, setStakingEvent] = useState();
	const [stakingLoading, setStakingLoading] = useState(false);

	useEffect(() => {
		trackEvent('PAYMENT_STEP_UPDATED', {
			step: currentStep,
			transactionState,
		});
	}, [currentStep]);

	const transact = () => {
		setStakingLoading(true);

		trackEvent('INTENT_TRANSACTON', {
			transactionType: !!transactionState.stakingAmount ? 'STAKE' : 'NOMINATE',
			transactionState,
		});

		const handlers = {
			onEvent: (eventInfo) => {
				setStakingEvent(eventInfo.message);
			},
			onFinish: (status, message) => { // status = 0 for success, anything else for error code
				toast({
					title: status === 0 ? 'Successful!' : 'Error!',
					status: status === 0 ? 'success' : 'error',
					description: message,
					position: 'top-right',
					isClosable: true,
					duration: 3000,
				});
				setStakingLoading(false);
				
				if (status === 0) {
					trackEvent('TRANSACTION_SUCCESS', {
						transactionState,
						successMessage: message,
					});
				} else {
					trackEvent('TRANSACTION_FAILED', {
						transactionState,
						failureMessage: message,
					});
				}

				if (status === 0) router.replace('/overview');
			},
		};

		if (transactionState.stakingAmount) {
			stake(
				stashAccount.address,
				transactionState.controller,
				transactionState.stakingAmount,
				transactionState.selectedValidators.map(v => v.stashId),
				apiInstance,
				handlers
			).catch(error => {
				handlers.onFinish(1, error.message);
			});
		} else {
			const nominations = transactionState.selectedValidators.map(v => v.stashId);
			nominate(stashAccount.address, nominations, apiInstance, handlers).catch(error => {
				handlers.onFinish(1, error.message);
			});
		}
	};

	const back = () => {
		if (currentStep === 0) router.back();
		else setCurrentStep(step => step - 1);
	};

	return (
		<div className="mx-auto mb-8 mt-4" style={{ width: '45rem' }}>
			<div className="mb-4">
				<button className="flex items-center bg-teal-500 text-white rounded-lg px-2 py-1" onClick={back}>
					<ChevronLeft className="text-white mr-2" />
					Back
				</button>
			</div>
			<Steps
				steps={['Confirmation', 'Reward Destination', 'Payment']}
				currentStep={currentStep}
			/>
			{currentStep === 0 && (
				<Confirmation
					bondedAmount={bondedAmount}
					transactionState={transactionState}
					onConfirm={() => setCurrentStep(step => step + 1)}
				/>
			)}
			{currentStep === 1 && (
				<RewardDestination
					stashAccount={stashAccount}
					transactionState={transactionState}
					setTransactionState={setTransactionState}
					onConfirm={() => setCurrentStep(step => step + 1)}
				/>
			)}
			{currentStep === 2 && (
				<Transaction
					accounts={accounts}
					stashAccount={stashAccount}
					stakingLoading={stakingLoading}
					transactionState={transactionState}
					setController={controller => setTransactionState({ controller })}
					onConfirm={transact}
				/>
			)}
			{stakingLoading && (
				<div className="mt-6">
					<h1 className="font-semibold text-xl text-gray-700">Status:</h1>
					<div className="flex items-center justify-between">
						<span>{stakingEvent}</span>
						<Spinner className="ml-4" />
					</div>
				</div>
			)}
		</div>
	);
};

export default Payment;
