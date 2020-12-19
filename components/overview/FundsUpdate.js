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
	Input,
	Button,
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import RiskTag from "@components/reward-calculator/RiskTag";
import { random, get, noop } from "lodash";
import calculateReward from "@lib/calculate-reward";
import formatCurrency from "@lib/format-currency";
import updateFunds from "@lib/polkadot/update-funds";
import { usePolkadotApi, useAccounts } from "@lib/store";
import { ExternalLink } from "react-feather";
import Routes from "@lib/routes";
import Identicon from "@components/common/Identicon";
import ChainErrorPage from "@components/overview/ChainErrorPage";
import SuccessfullyBonded from "@components/overview/SuccessfullyBonded";
import AmountInput from "./AmountInput";
import axios from "@lib/axios";
import AmountConfirmation from "./AmountConfirmation";
import convertCurrency from "@lib/convert-currency";

const FundsUpdate = withSlideIn(
	({ styles, type, close, nominations, bondedAmount, networkInfo }) => {
		const toast = useToast();
		const { stashAccount, freeAmount } = useAccounts();
		const { apiInstance } = usePolkadotApi();
		const [currentStep, setCurrentStep] = useState(0);
		const [amount, setAmount] = useState(0);
		const [subCurrency, setSubCurrency] = useState(0);
		const [compounding, setCompounding] = useState(false);
		const [validators, setValidators] = useState([]);
		const [updatingFunds, setUpdatingFunds] = useState(false);
		const [estimatedReturns, setEstimatedReturns] = useState();
		const [stakingEvent, setStakingEvent] = useState();
		const [processComplete, setProcessComplete] = useState(false);
		const [chainError, setChainError] = useState(false);
		const [transactionHash, setTransactionHash] = useState();
		const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);
		const [calculationDisabled, setCalculationDisabled] = useState(true);

		const [totalStakingAmount, setTotalStakingAmount] = useState(
			get(bondedAmount, "currency", 0)
		);
		const [totalStakingAmountFiat, setTotalStakingAmountFiat] = useState(0);
		const [validatorsLoading, setValidatorsLoading] = useState(true);
		const [errMessage, setErrMessage] = useState();
		const title = `${type === "bond" ? "Invest more" : "Withdraw"}`;
		const subTitle = `${
			type === "bond"
				? "I want to invest additional funds of"
				: "I want to withdraw"
		}`;

		const updateTransactionData = (
			stashId,
			network,
			alreadyBonded,
			stakeAmount,
			tranHash,
			successful
		) => {
			axios
				.put(`${networkInfo.coinGeckoDenom}/user/transaction/update`, {
					stashId: stashId,
					network: network,
					alreadyBonded: alreadyBonded,
					stake: stakeAmount,
					transactionHash: tranHash,
					successful: successful,
				})
				.then(() => {
					console.info("successfully updated transaction info");
				})
				.catch((e) => {
					console.info("unable to update transaction info");
				});
		};

		const handlePopoverClose = () => {
			close();
			setCurrentStep(0);
			setProcessComplete(false);
		};

		const handleOnClickProceed = () => {
			setCurrentStep(1);
		};

		useEffect(() => {
			setValidatorsLoading(true);
			setValidators(nominations);
			setValidatorsLoading(false);
		}, [nominations]);

		useEffect(() => {
			apiInstance.query.staking.payee(stashAccount.address).then((payee) => {
				if (payee.isStaked) setCompounding(true);
				else {
					setCompounding(false);
				}
			});
		}, [stashAccount]);

		useEffect(() => {
			// let amountByType = amount * (type === "bond" ? 1 : -1);
			// const totalStakingAmount = Math.max(
			// 	get(bondedAmount, "currency", 0) + amountByType,
			// 	0
			// );
			const timePeriodValue = 12,
				timePeriodUnit = "months";

			calculateReward(
				validators,
				totalStakingAmount,
				timePeriodValue,
				timePeriodUnit,
				compounding,
				networkInfo
			).then((result) => {
				// setTotalStakingAmount(totalStakingAmount);
				setEstimatedReturns(get(result, "returns", 0));
			});
		}, [amount, compounding]);

		useEffect(() => {
			if (amount) {
				let amountByType = amount * (type === "bond" ? 1 : -1);
				const totalAmount = Math.max(
					get(bondedAmount, "currency", 0) + amountByType,
					0
				);
				setTotalStakingAmount(totalAmount);
			}
		}, [amount]);

		useEffect(() => {
			convertCurrency(amount || 0, networkInfo.denom).then(
				(convertedAmount) => {
					setSubCurrency(convertedAmount);
				}
			);
			convertCurrency(totalStakingAmount || 0, networkInfo.denom).then(
				(convertedAmount) => {
					setTotalStakingAmountFiat(convertedAmount);
				}
			);
		}, [amount, totalStakingAmount]);

		useEffect(() => {
			if (type === "unbond" && amount > get(bondedAmount, "currency", 0)) {
				setCalculationDisabled(true);
			} else if (
				type === "bond" &&
				amount > get(freeAmount, "currency", 0) - networkInfo.minAmount
			) {
				setCalculationDisabled(true);
			} else if (amount === 0 || amount === undefined || amount === "") {
				setCalculationDisabled(true);
			} else setCalculationDisabled(false);
		}, [amount]);

		const onConfirm = () => {
			setUpdatingFunds(true);
			setCloseOnOverlayClick(false);
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
				onFinish: (status, message, eventLogs, tranHash) => {
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
						updateTransactionData(
							stashAccount.address,
							networkInfo.coinGeckoDenom,
							get(bondedAmount, "currency", 0),
							type == "bond"
								? get(bondedAmount, "currency", 0) + amount
								: get(bondedAmount, "currency", 0) - amount,
							tranHash,
							true
						);
						setProcessComplete(true);
						setUpdatingFunds(false);
						setCloseOnOverlayClick(true);
					} else {
						setUpdatingFunds(false);
						setCloseOnOverlayClick(true);
						setErrMessage(message);
						if (message !== "Cancelled") {
							updateTransactionData(
								stashAccount.address,
								networkInfo.coinGeckoDenom,
								get(bondedAmount, "currency", 0),
								type == "bond"
									? get(bondedAmount, "currency", 0) + amount
									: get(bondedAmount, "currency", 0) - amount,
								tranHash,
								false
							);
							setChainError(true);
						}
					}
				},
			};
			updateFunds(
				type,
				stashAccount.address,
				amount,
				apiInstance,
				handlers,
				networkInfo
			).catch((error) => {
				handlers.onFinish(1, error.message);
			});
		};
		const handleOnClickForSuccessfulTransaction = () => {
			close();
		};

		return (
			<Modal
				isOpen={true}
				onClose={close}
				isCentered
				closeOnOverlayClick={closeOnOverlayClick}
				closeOnEsc={closeOnOverlayClick}
				size={currentStep == 0 ? "md" : "xl"}
			>
				<ModalOverlay />
				<ModalContent rounded="lg" {...styles}>
					{/* {!updatingFunds && !processComplete && !chainError && (
						<ModalHeader>
							<h1>{title}</h1>
						</ModalHeader>
					)} */}
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
					<ModalBody px="2rem">
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
							<div className="w-full h-full">
								{currentStep == 0 && !processComplete && !chainError && (
									<>
										<div className="flex flex-col">
											<h3 className="mt-4 text-2xl text-gray-700 font-semibold">
												{title}
											</h3>
											<div className="flex-center w-full h-full">
												<div className="mt-10 w-full">
													<div
														className="rounded-lg px-5 py-2 text-sm bg-red-200 text-red-600"
														hidden={
															!calculationDisabled || !amount || amount == 0
														}
													>
														<span hidden={type === "bond"}>
															You cannot withdraw this amount since it either
															exceeds your current investment value or doesn’t
															leave enough funds in your account for paying the
															transaction fees.{" "}
														</span>
														<span hidden={type === "unbond"}>
															We cannot stake this amount since you need to
															maintain a minimum balance of{" "}
															{networkInfo.minAmount} {networkInfo.denom} in
															your account at all times.{" "}
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-700 text-xs">
															{subTitle}
														</span>
														<span
															className="text-gray-700 text-xxs mt-2"
															hidden={type === "unbond"}
														>
															Available Balance:{" "}
															{formatCurrency.methods.formatAmount(
																Math.trunc(
																	Number(
																		(get(freeAmount, "currency", 0) || 0) *
																			10 ** networkInfo.decimalPlaces
																	)
																),
																networkInfo
															)}
														</span>
														<span
															className="text-gray-700 text-xxs mt-2"
															hidden={type === "bond"}
														>
															Current Investment:{" "}
															{formatCurrency.methods.formatAmount(
																Math.trunc(
																	Number(
																		(get(bondedAmount, "currency", 0) || 0) *
																			10 ** networkInfo.decimalPlaces
																	)
																),
																networkInfo
															)}
														</span>
													</div>
													<div className="flex flex-col">
														<AmountInput
															bonded={get(bondedAmount, "currency")}
															value={{
																currency: amount,
																subCurrency: subCurrency,
															}}
															networkInfo={networkInfo}
															type={type}
															onChange={setAmount}
														/>
													</div>
												</div>
											</div>
											<div className="flex-center">
												<button
													className={`rounded-full font-medium px-12 py-3 ${
														calculationDisabled
															? "bg-gray-700 opacity-25 cursor-not-allowed"
															: "bg-teal-500 opacity-100 cursor-pointer"
													} mt-40 mb-40 text-white`}
													onClick={handleOnClickProceed}
													disabled={
														type == "bond"
															? amount > freeAmount.currency || !amount
															: amount > bondedAmount.currency || !amount
													}
													// isLoading={updatingFunds}
												>
													Proceed
												</button>
											</div>
										</div>
									</>
								)}
								{currentStep === 1 &&
									!updatingFunds &&
									!processComplete &&
									!chainError && (
										<AmountConfirmation
											amount={amount}
											subCurrency={subCurrency}
											type={type}
											close={close}
											stashId={stashAccount.address}
											nominations={nominations}
											handlePopoverClose={handlePopoverClose}
											bondedAmount={bondedAmount}
											networkInfo={networkInfo}
											api={apiInstance}
											onConfirm={onConfirm}
										/>
									)}
								{updatingFunds && !processComplete && !chainError && (
									<div className="mt-6">
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
							.validator-table {
								height: 56vh;
							}
						`}</style>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}
);

export default FundsUpdate;
