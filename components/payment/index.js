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
import ConfettiGenerator from "confetti-js";
import getTransactionFee from "@lib/getTransactionFee";
import { useToast, Spinner, Flex, Button } from "@chakra-ui/core";
import { useRouter } from "next/router";
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

const ChainErrorPage = ({ onConfirm, back }) => {
	return (
		<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
			<div className="mb-10 text-left w-full">
				<button
					className="flex items-center bg-gray-200 text-gray-600 rounded-full px-2 py-1"
					onClick={back}
				>
					<ChevronLeft size={16} className="text-gray-600" />
					<span className="mx-2 text-sm">Back</span>
				</button>
			</div>
			<img src="/images/polkadot_alert.png" width="150px" />
			<h3 className="text-xl font-semibold max-w-sm">
				Oops. There was an error processing this staking request
			</h3>
			<span className="mt-4 px-4 text-sm text-gray-600">
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
			<div className="max-w-sm">
				<Button
					mt={12}
					py={6}
					w="full"
					variant="solid"
					variantColor="teal"
					fontWeight="normal"
					rounded="lg"
					onClick={onConfirm}
				>
					Retry
				</Button>
				<Button
					mt={4}
					py={6}
					w="full"
					variant="outline"
					variantColor="teal"
					fontWeight="normal"
					rounded="lg"
					// onClick={onConfirm}
				>
					Share this with the help center
				</Button>
			</div>
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
	const [loaderError, setLoaderError] = useState(false);
	const { accounts, stashAccount, bondedAmount } = useAccounts();
	const { setTransactionState, ...transactionState } = useTransaction();
	const { setHeaderLoading } = useHeaderLoading();

	const [loading, setLoading] = useState(true);
	const [transactionHash, setTransactionHash] = useState();
	const [stakingEvent, setStakingEvent] = useState();
	const [transactionFee, setTransactionFee] = useState(0);
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
		if (stashAccount) {
			getTransactionFee(
				stashAccount.address,
				stashAccount.address,
				transactionState.stakingAmount,
				get(bondedAmount, "currency", 0),
				transactionState.rewardDestination,
				transactionState.selectedValidators.map((v) => v.stashId),
				apiInstance,
				networkInfo
			).then((info) => {
				setTransactionFee(info);
			});
		}
	}, []);

	useEffect(() => {
		if (transactionHash) {
			const confettiSettings = {
				target: "confetti-holder",
				max: "150",
				size: "1",
				animate: true,
				props: ["circle", "square", "triangle", "line"],
				colors: [
					[165, 104, 246],
					[230, 61, 135],
					[0, 199, 228],
					[253, 214, 126],
				],
				clock: "150",
				rotate: true,
				start_from_edge: true,
				respawn: true,
			};
			const confetti = new ConfettiGenerator(confettiSettings);
			confetti.render();

			return () => confetti.clear();
		}
	}, [transactionHash]);

	useEffect(() => {
		if (transactionHash) {
			setTimeout(() => router.push({ pathname: "/overview" }), 2500);
		}
	}, [transactionHash]);

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
				setLoaderError(false);
				setTimeout(() => {
					setTransactionHash(get(hash, "message"));
					setStakingEvent("Your transaction was successful!");
				}, 750);
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
				setTimeout(() => {
					setStakingLoading(false);
				}, 2500);

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
					if (message !== "Cancelled") {
						setTimeout(() => {
							setStakingEvent("Transaction failed");
							setLoaderError(true);
						}, 750);
						setTimeout(() => {
							setChainError(true);
							setLoaderError(false);
							setStakingLoading(false);
						}, 2500);
					}
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

	const backToConfirmation = () => {
		setCurrentStep(0);
		setChainError(false);
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

	return (
		<>
			{transactionHash && (
				<canvas id="confetti-holder" className="absolute w-full"></canvas>
			)}
			<div className="mx-auto mb-8 mt-4 px-4 md:px-0 max-w-2xl">
				{!stakingLoading && !transactionHash && !chainError && (
					<>
						<div className="mb-10">
							<button
								className="flex items-center bg-gray-200 text-gray-600 rounded-full px-2 py-1"
								onClick={back}
							>
								<ChevronLeft size={16} className="text-gray-600" />
								<span className="mx-2 text-sm">Back</span>
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
								transactionFee={transactionFee}
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
					<Flex h="100vh" alignItems="center" justifyContent="center">
						<span
							className={`loader ${
								loaderError ? "fail" : transactionHash && "success"
							}`}
						></span>
						<p className="text-gray-700">{stakingEvent}</p>
					</Flex>
				)}
				{chainError && (
					<ChainErrorPage
						// transactionHash={transactionHash}
						back={backToConfirmation}
						onConfirm={() => {
							setStakingLoading(true);
							setChainError(false);
							transact();
						}}
						networkInfo={networkInfo}
					/>
				)}
			</div>
		</>
	);
};

export default Payment;
