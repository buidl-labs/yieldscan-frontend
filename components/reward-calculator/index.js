import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@lib/axios";
import RiskSelect from "./RiskSelect";
import AmountInput from "./AmountInput";
import TimePeriodInput from "./TimePeriodInput";
import ExpectedReturnsCard from "./ExpectedReturnsCard";
import CompoundRewardSlider from "./CompoundRewardSlider";
import { useWalletConnect } from "@components/wallet-connect";
import {
	useAccounts,
	useTransaction,
	useHeaderLoading,
	usePaymentPopover,
	useSelectedNetwork,
	useNetworkElection,
	useTransactionHash,
	useValidatorData,
} from "@lib/store";
import { PaymentPopover } from "@components/new-payment";
import { get, isNil, mapValues, keyBy, cloneDeep, debounce } from "lodash";
import calculateReward from "@lib/calculate-reward";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Spinner,
	useDisclosure,
} from "@chakra-ui/core";
import Routes from "@lib/routes";
import { trackEvent, Events } from "@lib/analytics";
import convertCurrency from "@lib/convert-currency";
import { getNetworkInfo } from "yieldscan.config";
import { HelpCircle } from "react-feather";
import formatCurrency from "@lib/format-currency";

const trackRewardCalculatedEvent = debounce((eventData) => {
	trackEvent(Events.REWARD_CALCULATED, eventData);
}, 1000);

const RewardCalculatorPage = () => {
	const router = useRouter();
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { transactionHash, setTransactionHash } = useTransactionHash();

	const { toggle } = useWalletConnect();
	const {
		isOpen: isRiskGlossaryOpen,
		onClose: onRiskGlossaryClose,
		onOpen: onRiskGlossaryOpen,
	} = useDisclosure();
	const {
		isOpen: isUnbondingGlossaryOpen,
		onClose: onUnbondingGlossaryClose,
		onOpen: onUnbondingGlossaryOpen,
	} = useDisclosure();
	const setTransactionState = useTransaction(
		(state) => state.setTransactionState
	);
	const transactionState = useTransaction();
	const {
		stashAccount,
		accounts,
		freeAmount,
		bondedAmount,
		accountInfoLoading,
	} = useAccounts();
	const { setHeaderLoading } = useHeaderLoading();
	const { isInElection } = useNetworkElection();
	const { isPaymentPopoverOpen, closePaymentPopover } = usePaymentPopover();

	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(transactionState.stakingAmount || 1000);
	const [subCurrency, setSubCurrency] = useState(0);
	const [risk, setRisk] = useState(transactionState.riskPreference || "Medium");
	const [timePeriodValue, setTimePeriod] = useState(
		transactionState.timePeriodValue || 12
	);
	const [timePeriodUnit, setTimePeriodUnit] = useState(
		transactionState.timePeriodUnit || "months"
	);
	const [compounding, setCompounding] = useState(
		transactionState.compounding || true
	);
	const [selectedValidators, setSelectedValidators] = useState({});

	const { validatorRiskSets, setValidatorRiskSets } = useValidatorData();
	const [result, setResult] = useState({});

	useEffect(() => {
		convertCurrency(amount || 0, networkInfo.denom).then((convertedAmount) => {
			setSubCurrency(convertedAmount);
		});
	}, [amount, networkInfo, validatorRiskSets]);

	useEffect(() => {
		if (get(validatorRiskSets, risk)) {
			const selectedValidators = cloneDeep(validatorRiskSets[risk]);
			setSelectedValidators(selectedValidators);
		}
	}, [risk]);

	useEffect(() => {
		if (!validatorRiskSets) {
			setLoading(true);
			setHeaderLoading(true);
			axios
				.get(`/${networkInfo.coinGeckoDenom}/rewards/risk-set-only`)
				.then(({ data }) => {
					/**
					 * `mapValues(keyBy(array), 'value-key')`:
					 * 	O(N + N) operation, using since each risk set will have maximum 16 validators
					 */
					const validatorMap = {
						Low: mapValues(keyBy(data.lowriskset, "stashId")),
						Medium: mapValues(keyBy(data.medriskset, "stashId")),
						High: mapValues(keyBy(data.highriskset, "stashId")),
						total: data.totalset,
					};

					setValidatorRiskSets(validatorMap);
					setSelectedValidators(validatorMap["Medium"]);
					setLoading(false);
					setHeaderLoading(false);
				});
		} else {
			console.info("Using previous validator map.");
		}
	}, [networkInfo, validatorRiskSets]);

	useEffect(() => {
		if (risk && timePeriodValue) {
			const selectedValidatorsList = Object.values(selectedValidators).filter(
				(v) => !isNil(v)
			);
			calculateReward(
				selectedValidatorsList,
				amount || 0,
				timePeriodValue,
				timePeriodUnit,
				compounding,
				networkInfo
			)
				.then((result) => {
					setResult(result);
				})
				.catch((error) => {
					// TODO: handle error gracefully with UI toast
					alert(error);
				});
		}
	}, [
		amount,
		timePeriodValue,
		timePeriodUnit,
		compounding,
		bondedAmount,
		selectedValidators,
	]);

	const updateTransactionState = (eventType = "") => {
		let _returns = get(result, "returns"),
			_yieldPercentage = get(result, "yieldPercentage");
		const selectedValidatorsList = Object.values(selectedValidators).filter(
			(v) => !isNil(v)
		);

		if (eventType) {
			trackEvent(eventType, {
				investmentAmount: `${amount} ${get(
					networkInfo,
					"denom"
				)} ($${subCurrency})`,
				riskPreference: risk,
				timePeriod: `${timePeriodValue} ${timePeriodUnit}`,
				compounding,
				returns: `${get(_returns, "currency")} ${get(
					networkInfo,
					"denom"
				)} ($${get(_returns, "subCurrency")})`,
				yieldPercentage: `${_yieldPercentage}%`,
				// selectedValidators: selectedValidatorsList,
			});
		}

		setTransactionState({
			stakingAmount: amount,
			riskPreference: risk,
			timePeriodValue,
			timePeriodUnit,
			compounding,
			returns: _returns,
			yieldPercentage: _yieldPercentage,
			selectedValidators: selectedValidatorsList,
			validatorRiskSets,
		});
	};

	const onPayment = async () => {
		updateTransactionState(Events.INTENT_STAKING);
		if (transactionHash) setTransactionHash(null);
		router.push("/payment", "/payment", { shallow: true });
		// get(bondedAmount, "currency", 0) === 0
		// 	? router.push("/payment", "/payment", "shallow")
		// 	: openPaymentPopover();
	};

	const onAdvancedSelection = () => {
		updateTransactionState(Events.INTENT_ADVANCED_SELECTION);
		router.push(`${Routes.VALIDATORS}?advanced=true`);
	};

	const totalBalance =
		get(bondedAmount, "currency", 0) + get(freeAmount, "currency", 0);
	const calculationDisabled =
		!totalBalance ||
		!timePeriodValue ||
		(amount || 0) > totalBalance - networkInfo.minAmount ||
		amount == 0;

	return loading ? (
		<div className="flex-center w-full h-full">
			<div className="flex-center flex-col">
				<Spinner size="xl" color="teal.500" thickness="4px" />
				<span className="text-sm text-gray-600 mt-5">
					Instantiating API and fetching data...
				</span>
			</div>
		</div>
	) : (
		<div className="flex pt-12 px-10">
			<GlossaryModal
				isOpen={isRiskGlossaryOpen}
				onClose={onRiskGlossaryClose}
				header="Risk Score"
				content={
					<p className="text-gray-700 text-sm px-8">
						Risk score is calculated based on 6 on-chain variables (
						<span className="italic">
							own stake, other stake, no. of backers, no. of slashes and no. of
							eras validated
						</span>
						), where no. of slashes carry the highest weight.{" "}
						<a
							className="underline"
							href="https://github.com/buidl-labs/yieldscan-frontend/wiki/Risk-score-logic"
							target="_blank"
						>
							Learn more
						</a>
					</p>
				}
			/>
			<GlossaryModal
				isOpen={isUnbondingGlossaryOpen}
				onClose={onUnbondingGlossaryClose}
				header="Unbonding Period"
				content={
					<p className="text-gray-700 text-sm px-8">
						After staking, your investment amount is "frozen" as collateral for
						earning rewards. Whenever you decide to withdraw these funds, you
						would first need to wait for them to "unbond". This waiting duration
						is called the unbonding period and it can vary from network to
						network.
					</p>
				}
			/>
			<div>
				<div className="flex flex-wrap">
					<div className="w-1/2">
						<h1 className="font-semibold text-xl text-gray-700">
							Calculate Returns
						</h1>
						<div className="mt-8 mx-2">
							<h3 className="text-gray-700 text-xs">I want to invest:</h3>
							<div className="mt-2">
								{!accountInfoLoading ? (
									stashAccount &&
									(amount > totalBalance - networkInfo.minAmount ||
										get(freeAmount, "currency", 0) < networkInfo.minAmount) && (
										<Alert
											status={
												get(freeAmount, "currency", 0) < networkInfo.minAmount
													? amount > get(bondedAmount, "currency", 0)
														? "error"
														: get(freeAmount, "currency", 0) >
														  networkInfo.minAmount / 2
														? "warning"
														: "error"
													: "error"
											}
											rounded="md"
											flex
											flexDirection="column"
											alignItems="start"
											my={4}
										>
											<AlertTitle
												color={
													get(freeAmount, "currency", 0) < networkInfo.minAmount
														? amount > get(bondedAmount, "currency", 0)
															? "red.500"
															: get(freeAmount, "currency", 0) >
															  networkInfo.minAmount / 2
															? "#FDB808"
															: "red.500"
														: "red.500"
												}
											>
												{get(freeAmount, "currency", 0) < networkInfo.minAmount
													? amount > get(bondedAmount, "currency", 0)
														? "Insufficient Balance"
														: get(freeAmount, "currency", 0) >
														  networkInfo.minAmount / 2
														? "Low Balance"
														: "Insufficient Balance"
													: "Insufficient Balance"}
											</AlertTitle>
											<AlertDescription
												color={
													get(freeAmount, "currency", 0) < networkInfo.minAmount
														? amount > get(bondedAmount, "currency", 0)
															? "red.500"
															: get(freeAmount, "currency", 0) >
															  networkInfo.minAmount / 2
															? "#FDB808"
															: "red.500"
														: "red.500"
												}
											>
												{get(freeAmount, "currency", 0) < networkInfo.minAmount
													? amount > get(bondedAmount, "currency", 0)
														? `You need an additional of ${formatCurrency.methods.formatAmount(
																Math.trunc(
																	Number(
																		amount -
																			(totalBalance - networkInfo.minAmount)
																	) *
																		10 ** networkInfo.decimalPlaces
																),
																networkInfo
														  )} to proceed further.`
														: get(freeAmount, "currency", 0) >
														  networkInfo.minAmount / 2
														? `Your available balance is low, we recommend to add more ${networkInfo.denom}'s`
														: `You need an additional of ${formatCurrency.methods.formatAmount(
																Math.trunc(
																	Number(
																		amount -
																			(totalBalance - networkInfo.minAmount)
																	) *
																		10 ** networkInfo.decimalPlaces
																),
																networkInfo
														  )} to proceed further.`
													: `You need an additional of ${formatCurrency.methods.formatAmount(
															Math.trunc(
																Number(
																	amount -
																		(totalBalance - networkInfo.minAmount)
																) *
																	10 ** networkInfo.decimalPlaces
															),
															networkInfo
													  )} to proceed further.`}{" "}
												<Popover trigger="hover" usePortal>
													<PopoverTrigger>
														<span className="underline cursor-help">Why?</span>
													</PopoverTrigger>
													<PopoverContent
														zIndex={50}
														_focus={{ outline: "none" }}
														bg="gray.600"
														border="none"
													>
														<PopoverArrow />
														<PopoverBody>
															<span className="text-white text-xs">
																{get(freeAmount, "currency", 0) <
																networkInfo.minAmount
																	? amount > get(bondedAmount, "currency", 0)
																		? "This is to ensure that you have a decent amount of funds in your account to pay transaction fees for claiming rewards, unbonding funds, changing on-chain staking preferences, etc."
																		: "This is to ensure that you have a decent amount of funds in your account to pay transaction fees for claiming rewards, unbonding funds, changing on-chain staking preferences, etc."
																	: "This is to ensure that you have a decent amount of funds in your account to pay transaction fees for claiming rewards, unbonding funds, changing on-chain staking preferences, etc."}
															</span>
														</PopoverBody>
													</PopoverContent>
												</Popover>
											</AlertDescription>
										</Alert>
									)
								) : (
									<></>
								)}

								<AmountInput
									bonded={get(bondedAmount, "currency")}
									value={{ currency: amount, subCurrency: subCurrency }}
									networkInfo={networkInfo}
									onChange={setAmount}
									trackRewardCalculatedEvent={trackRewardCalculatedEvent}
									accountInfoLoading={accountInfoLoading}
								/>
							</div>
							<div className="flex mt-8 items-center">
								<h3 className="text-gray-700 text-xs">With a risk level:</h3>
								<HelpPopover
									content={
										<p className="text-white text-xs">
											Risk levels are an abstraction over the risk scores we
											assign to validators. If you're unsure, choose "Medium".{" "}
											<span
												onClick={onRiskGlossaryOpen}
												className="underline cursor-pointer"
											>
												How are risk scores calculated?
											</span>
										</p>
									}
								/>
							</div>
							<div className="mt-2">
								<RiskSelect
									selected={risk}
									setSelected={setRisk}
									trackRewardCalculatedEvent={trackRewardCalculatedEvent}
								/>
							</div>

							<h3 className="text-gray-700 mt-8 text-xs">
								For the time period:
							</h3>
							<Alert
								status="warning"
								color="#FDB808"
								backgroundColor="#FFF4DA"
								borderRadius="8px"
								mr={12}
								mt={2}
								mb={4}
							>
								<AlertDescription color="#FDB808" fontSize="xs">
									Time period is only used for estimating returns. It doesn’t
									affect the{" "}
									<span
										className="underline cursor-pointer"
										onClick={onUnbondingGlossaryOpen}
									>
										unbonding period
									</span>{" "}
									of approximately {networkInfo.lockUpPeriod} days.
								</AlertDescription>
							</Alert>
							<div className="mt-2">
								<TimePeriodInput
									value={timePeriodValue}
									unit={timePeriodUnit}
									onChange={setTimePeriod}
									onUnitChange={setTimePeriodUnit}
									trackRewardCalculatedEvent={trackRewardCalculatedEvent}
								/>
							</div>
							<div className="flex mt-8 items-center">
								<h3 className="text-gray-700 text-xs">
									Lock rewards for compounding?
								</h3>
								<HelpPopover
									content={
										<p className="text-white text-xs">
											If you choose not to lock your rewards, then your newly
											minted rewards will be transferrable by default. However,
											this would mean lower earnings over longer period of time.
											Please note that locking of your capital investment is
											independent of this. See{" "}
											<span
												onClick={onUnbondingGlossaryOpen}
												className="underline cursor-pointer"
											>
												unbonding period
											</span>{" "}
											for more info.
										</p>
									}
								/>
							</div>
							{/* <span className="text-sm text-gray-500">
								Your rewards will be locked for staking over the specified time
								period
							</span> */}
							<div className="mt-2 my-8">
								<CompoundRewardSlider
									checked={compounding}
									setChecked={setCompounding}
									trackRewardCalculatedEvent={trackRewardCalculatedEvent}
								/>
							</div>
						</div>
					</div>
					<div className="w-1/2">
						<ExpectedReturnsCard
							result={result}
							stashAccount={stashAccount}
							calculationDisabled={
								!totalBalance ||
								!timePeriodValue ||
								(amount || 0) > totalBalance - networkInfo.minAmount ||
								amount == 0
							}
							onWalletConnectClick={toggle}
							networkInfo={networkInfo}
							onPayment={onPayment}
						/>
						<div className="mt-3">
							<Alert
								color="gray.500"
								backgroundColor="white"
								border="1px solid #E2ECF9"
								borderRadius="8px"
								zIndex={1}
							>
								<AlertIcon name="secureLogo" />
								<div>
									<AlertTitle fontWeight="medium" fontSize="sm">
										Non-custodial & Secure
									</AlertTitle>
									<AlertDescription fontSize="xs">
										We do not own your private keys and cannot access your
										funds. You are always in control.
									</AlertDescription>
								</div>
							</Alert>
						</div>
					</div>
					<div className="w-full bg-white bottom-0 p-8 left-0 flex-center">
						<button
							className={`
						rounded-full font-medium px-12 py-3 bg-teal-500 text-white
						${
							(stashAccount &&
								(get(freeAmount, "currency", 0) < networkInfo.minAmount
									? amount > get(bondedAmount, "currency", 0)
										? calculationDisabled
										: get(freeAmount, "currency", 0) > networkInfo.minAmount / 2
										? false
										: true
									: calculationDisabled)) ||
							accountInfoLoading ||
							isInElection
								? "opacity-75 cursor-not-allowed"
								: "opacity-100"
						}
					`}
							disabled={
								(stashAccount &&
									(get(freeAmount, "currency", 0) < networkInfo.minAmount
										? amount > get(bondedAmount, "currency", 0)
											? calculationDisabled
											: get(freeAmount, "currency", 0) >
											  networkInfo.minAmount / 2
											? false
											: true
										: calculationDisabled)) ||
								accountInfoLoading ||
								isInElection
							}
							onClick={() => (stashAccount ? onPayment() : toggle())}
						>
							{isNil(accounts)
								? "Connect Wallet"
								: isNil(stashAccount)
								? "Select Account"
								: isInElection
								? "Ongoing elections, can't invest now!"
								: "Proceed to confirmation"}
						</button>
					</div>
				</div>
				{/* <div className="fixed w-full bg-white bottom-0 p-10 left-0 flex-center">
					<button
						className={`
						rounded-full font-semibold text-lg px-24 py-4 bg-teal-500 text-white
						${
							stashAccount && calculationDisabled
								? "opacity-75 cursor-not-allowed"
								: "opacity-100"
						}
					`}
						disabled={false && stashAccount && calculationDisabled}
						onClick={() => (stashAccount ? onPayment() : toggle())}
					>
						{stashAccount ? "Stake" : "Connect Wallet"}
					</button>
				</div> */}
			</div>
			{/* {isPaymentPopoverOpen && (
				<PaymentPopover
					isPaymentPopoverOpen={isPaymentPopoverOpen}
					stashAccount={stashAccount}
					stakingAmount={{ currency: amount, subCurrency: subCurrency }}
					validators={get(validatorMap, "total", [])}
					compounding={compounding}
					selectedValidators={Object.values(selectedValidators)}
					setSelectedValidators={setSelectedValidators}
					onAdvancedSelection={onAdvancedSelection}
					bondedAmount={bondedAmount}
					closePaymentPopover={closePaymentPopover}
					result={result}
					networkInfo={networkInfo}
				/>
			)} */}
		</div>
	);
};

export default RewardCalculatorPage;

const GlossaryModal = ({
	isOpen,
	onClose,
	header,
	content,
	maxWidth = "md",
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			closeOnEsc={true}
			closeOnOverlayClick={true}
		>
			<ModalOverlay />
			<ModalContent rounded="1rem" maxWidth={maxWidth} pt={4} pb={12}>
				<ModalHeader>
					<h3 className="px-3 text-2xl text-center text-gray-700">{header}</h3>
				</ModalHeader>
				<ModalCloseButton
					onClick={onClose}
					boxShadow="0 0 0 0 #fff"
					color="gray.400"
					backgroundColor="gray.100"
					rounded="1rem"
					mt={4}
					mr={4}
				/>
				<ModalBody>{content}</ModalBody>
			</ModalContent>
		</Modal>
	);
};

const HelpPopover = ({
	popoverTrigger,
	content,
	placement = "right",
	iconSize = "12px",
	zIndex = 50,
}) => {
	return (
		<Popover trigger="hover" placement={placement} usePortal>
			<PopoverTrigger>
				{popoverTrigger ? (
					popoverTrigger
				) : (
					<HelpCircle
						size={iconSize}
						className="text-gray-700 ml-2 cursor-help"
					/>
				)}
			</PopoverTrigger>
			<PopoverContent
				rounded="lg"
				zIndex={zIndex}
				_focus={{ outline: "none" }}
				bg="gray.600"
				border="none"
			>
				<PopoverArrow />
				<PopoverBody>{content}</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export { GlossaryModal, HelpPopover };
