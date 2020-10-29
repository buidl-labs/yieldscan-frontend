import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "react-feather";
import { get } from "lodash";
import Confirmation from "./Confirmation";
import RewardDestination from "./RewardDestination";
import Transaction from "./Transaction";
import {
	useAccounts,
	useTransaction,
	usePolkadotApi,
	useHeaderLoading,
	useSelectedNetwork,
} from "@lib/store";
import stake from "@lib/stake";
import { useToast, Spinner } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import nominate from "@lib/polkadot/nominate";
import { trackEvent, Events } from "@lib/analytics";
import { getNetworkInfo } from "yieldscan.config";

const Steps = ({ steps, currentStep }) => (
	<>
		<div className="cursor-default select-none steps-container flex justify-start items-center text-lg font-semibold">
			{steps.map((step, index) => (
				<React.Fragment key={index}>
					<div className="flex items-center">
						<div
							className={`flex items-center justify-center
								w-10 h-10 rounded-full text-white text-lg mr-4
								${index > currentStep ? "bg-gray-500" : "bg-teal-500"}
							`}
						>
							<span>{index + 1}</span>
						</div>
						<div
							className={
								index > currentStep ? "text-gray-500" : "text-teal-500"
							}
						>
							{step}
						</div>
					</div>
					{index !== steps.length - 1 && (
						<ChevronRight className="text-gray-600 mx-5" />
					)}
				</React.Fragment>
			))}
		</div>
	</>
);

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
				href={`https://kusama.subscan.io/block/${transactionHash}`}
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

const ChainErrorPage = ({ onConfirm }) => {
	return (
		<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
			<img src="/images/polkadot_alert.png" width="200px" />
			<h3 className="mt-4 text-2xl">
				Oops. There was an error processing this staking request
			</h3>
			<span className="mt-1 px-4 text-sm text-gray-500">
				If you think this is an error on our part, please share this with the
				help center and we will do our best to help. We typically respond within
				2-3 days.
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
				// onClick={onConfirm}
			>
				Retry
			</button>
			<button
				className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
				// onClick={onConfirm}
			>
				Share this with the help center
			</button>
		</div>
	);
};

// TODO: add `back` button from `payments` to `reward-calculator` and calculator state should be maintained
const Payment = () => {
	const toast = useToast();
	const router = useRouter();
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { apiInstance } = usePolkadotApi();
	const [currentStep, setCurrentStep] = useState(0);
	const [chainError, setChainError] = useState(false);
	const { accounts, stashAccount, bondedAmount } = useAccounts();
	const { setTransactionState, ...transactionState } = useTransaction();
	const { setHeaderLoading } = useHeaderLoading();

	const [loading, setLoading] = useState(true);
	const [transactionHash, setTransactionHash] = useState();
	const [stakingEvent, setStakingEvent] = useState();
	const [stakingLoading, setStakingLoading] = useState(false);
	const [hasAgreed, setHasAgreed] = useState(false);

	useEffect(() => {
		trackEvent(Events.PAYMENT_STEP_UPDATED, {
			step: currentStep,
			transactionState,
		});
	}, [currentStep]);

	useEffect(() => {
		setLoading(false);
		// To prevent the user from switching accounts or networks while in the middle of the payment process
		setHeaderLoading(true);
	}, []);

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
				} else {
					setStakingLoading(false);
					if (message !== "Cancelled") setChainError(true);
				}
			},
		};

		if (transactionState.stakingAmount) {
			stake(
				stashAccount.address,
				transactionState.controller,
				transactionState.stakingAmount,
				get(bondedAmount, "currency", 0),
				transactionState.rewardDestination,
				transactionState.selectedValidators.map((v) => v.stashId),
				apiInstance,
				handlers,
				networkInfo
			).catch((error) => {
				handlers.onFinish(1, error.message);
			});
		}
	};

	const back = () => {
		if (currentStep === 0) {
			setHeaderLoading(false);
			router.back();
		} else setCurrentStep((step) => step - 1);
	};

	const handleOnClickForSuccessfulTransaction = () => {
		router.replace("/overview");
	};

	if (loading) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<Spinner size="xl" color="teal.500" thickness="4px" />
					<span className="text-sm text-gray-600 mt-5">
						Loading payment page...
					</span>
				</div>
			</div>
		);
	}

	console.log("transactionState");
	console.log(transactionState.controller);

	return (
		<div className="mx-auto mb-8 mt-4" style={{ width: "45rem" }}>
			{!stakingLoading && !transactionHash && !chainError && (
				<>
					<div className="mb-10">
						<button
							className="flex items-center bg-gray-200 text-gray-900 rounded-full px-2 py-1"
							onClick={back}
						>
							<ChevronLeft className="text-gray-900" />
							<span className="mr-2">Back</span>
						</button>
					</div>
					{/* <Steps
						steps={["Confirmation", "Reward Destination", "Payment"]}
						currentStep={currentStep}
					/> */}
					{currentStep === 0 && (
						<Confirmation
							bondedAmount={bondedAmount}
							stashAccount={stashAccount}
							accounts={accounts}
							stakingLoading={stakingLoading}
							setController={(controller) =>
								setTransactionState({ controller })
							}
							transactionState={transactionState}
							setTransactionState={setTransactionState}
							hasAgreed={hasAgreed}
							setHasAgreed={setHasAgreed}
							onConfirm={transact}
							networkInfo={networkInfo}
						/>
					)}
					{currentStep === 1 && (
						<RewardDestination
							stashAccount={stashAccount}
							transactionState={transactionState}
							setTransactionState={setTransactionState}
							onConfirm={() => setCurrentStep((step) => step + 1)}
							networkInfo={networkInfo}
						/>
					)}
					{currentStep === 2 && (
						<Transaction
							accounts={accounts}
							stashAccount={stashAccount}
							stakingLoading={stakingLoading}
							transactionState={transactionState}
							setController={(controller) =>
								setTransactionState({ controller })
							}
							onConfirm={transact}
							networkInfo={networkInfo}
						/>
					)}
				</>
			)}
			{stakingLoading && !chainError && (
				<div className="mt-6">
					{/* <h1 className="font-semibold text-xl text-gray-700">Status:</h1> */}
					<div className="flex items-center justify-between">
						<span>{stakingEvent}</span>
						<Spinner className="ml-4" />
					</div>
				</div>
			)}
			{transactionHash && (
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
					networkInfo={networkInfo}
				/>
			)}
		</div>
	);
};

export default Payment;
