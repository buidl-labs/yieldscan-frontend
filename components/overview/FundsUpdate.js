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
import axios from "@lib/axios";
import convertCurrency from "@lib/convert-currency";

const ValidatorCard = ({
	name,
	stashId,
	riskScore,
	stakedAmount,
	estimatedReward,
	onProfile = noop,
}) => (
	<div className="flex justify-around items-center py-2 my-2 rounded-lg cursor-pointer border border-gray-300">
		<div className="flex">
			<Identicon address={stashId} size="2.5rem" />
			<div
				className="ml-2 text-gray-700 w-48 truncate cursor-pointer"
				onClick={onProfile}
			>
				<span className="text-sm font-semibold">
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

		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
			<div className="rounded-full font-semibold">
				<RiskTag risk={Number(riskScore.toFixed(2))} />
			</div>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Total Staked</span>
			<h3 className="text-lg">{stakedAmount.toFixed(1)} KSM</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">
				Estimated Pool Reward
			</span>
			<h3 className="text-lg">{estimatedReward.toFixed(4)} KSM</h3>
		</div>
	</div>
);

const FundsUpdate = withSlideIn(
	({ styles, type, close, nominations, bondedAmount }) => {
		const toast = useToast();
		const { stashAccount, freeAmount } = useAccounts();
		const { apiInstance } = usePolkadotApi();
		const [amount, _setAmount] = useState("");
		const [subCurrency, setSubCurrency] = useState("");
		const [compounding, setCompounding] = useState(false);
		const [validators, setValidators] = useState([]);
		const [updatingFunds, setUpdatingFunds] = useState(false);
		const [estimatedReturns, setEstimatedReturns] = useState();
		const [totalStakingAmount, setTotalStakingAmount] = useState(0);
		const [totalStakingAmountFiat, setTotalStakingAmountFiat] = useState(0);
		const [validatorsLoading, setValidatorsLoading] = useState(true);
		const title = `${type === "bond" ? "Bond Additional" : "Unbond"} Funds`;

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
			let amountByType = amount * (type === "bond" ? 1 : -1);
			const totalStakingAmount = Math.max(
				get(bondedAmount, "currency", 0) + amountByType,
				0
			);
			const timePeriodValue = 12,
				timePeriodUnit = "months";

			calculateReward(
				validators,
				totalStakingAmount,
				timePeriodValue,
				timePeriodUnit,
				compounding,
				{ currency: 0 }
			).then((result) => {
				setTotalStakingAmount(totalStakingAmount);
				setEstimatedReturns(get(result, "returns", 0));
			});
		}, [amount, compounding]);

		useEffect(() => {
			convertCurrency(amount || 0).then((convertedAmount) => {
				setSubCurrency(convertedAmount);
			});
			convertCurrency(totalStakingAmount || 0).then((convertedAmount) => {
				setTotalStakingAmountFiat(convertedAmount);
			});
		}, [amount, totalStakingAmount]);

		const setAmount = (value) => {
			if (value < 0) return;
			if (type === "unbond" && value >= get(bondedAmount, "currency", 0))
				return;
			if (type === "bond" && value >= get(freeAmount, "currency", 0)) return;
			_setAmount(value === "" ? "" : Number(value));
		};

		const onConfirm = () => {
			setUpdatingFunds(true);
			updateFunds(type, stashAccount.address, amount, apiInstance, {
				onEvent: ({ message }) => {
					toast({
						title: "Info",
						description: message,
						status: "info",
						duration: 3000,
						position: "top-right",
						isClosable: true,
					});
				},
				onFinish: (failed, message) => {
					toast({
						title: failed ? "Failure" : "Success",
						description: message,
						status: failed ? "error" : "success",
						duration: 3000,
						position: "top-right",
						isClosable: true,
					});
					setUpdatingFunds(false);
					close();
				},
			}).catch((error) => {
				toast({
					title: "Error",
					description: error.message,
					status: "error",
					duration: 3000,
					position: "top-right",
					isClosable: true,
				});
			});
		};

		return (
			<Modal isOpen={true} onClose={close} isCentered>
				<ModalOverlay />
				<ModalContent rounded="lg" maxWidth="90vw" height="84vh" {...styles}>
					<ModalHeader>
						<h1>{title}</h1>
					</ModalHeader>
					<ModalCloseButton onClick={close} />
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
								<div className="flex justify-around">
									<div className="border border-gray-200 p-10 rounded-lg text-gray-800 pr-8">
										<div>
											<h3 className="text-xl">Currently Bonded</h3>
											<h1 className="text-3xl">
												{formatCurrency.methods.formatAmount(
													Math.trunc(
														Number(
															(get(bondedAmount, "currency", 0) || 0) * 10 ** 12
														)
													)
												)}
											</h1>
											<span className="text-lg text-gray-600">
												$
												{formatCurrency.methods.formatNumber(
													get(bondedAmount, "subCurrency", 0).toFixed(2)
												)}
											</span>
										</div>
										<div className="mt-10">
											<h3>{title}</h3>
											<span
												className="text-gray-700 text-xs mb-2 ml-px"
												hidden={type === "unbond"}
											>
												Free Balance:{" "}
												{formatCurrency.methods.formatAmount(
													Math.trunc(
														Number(
															(get(freeAmount, "currency", 0) || 0) * 10 ** 12
														)
													)
												)}
											</span>
											<div className="flex items-center border border-gray-200 rounded-lg my-4">
												<div className="flex flex-col">
													<input
														type="number"
														className={`
													rounded outline-none p-2 text-lg rounded-lg
													${type === "bond" ? "text-teal-500" : "text-red-500"}
												`}
														placeholder="Enter amount"
														value={amount}
														onChange={(ev) => setAmount(ev.target.value)}
													/>
													<span className="text-sm text-gray-600 ml-2">
														$
														{subCurrency &&
															formatCurrency.methods.formatNumber(
																subCurrency.toFixed(2)
															)}
													</span>
												</div>
												<span
													className={`${
														type === "bond" ? "text-teal-500" : "text-red-500"
													} mx-2`}
												>
													KSM
												</span>
											</div>
										</div>
										<div className="mt-10">
											<h3 className="text-xl">Total Staking Amount</h3>
											<h1 className="text-3xl">
												{formatCurrency.methods.formatAmount(
													Math.trunc(
														Number((totalStakingAmount || 0) * 10 ** 12)
													)
												)}
											</h1>
											<span className="text-lg text-gray-600">
												$
												{formatCurrency.methods.formatNumber(
													totalStakingAmountFiat.toFixed(2)
												)}
											</span>
										</div>
									</div>

									<div className="border border-gray-200 rounded-lg w-2/3">
										<div className="flex justify-between items-center px-4 py-2 text-gray-700">
											<h3 className="tracking-widest">VALIDATORS</h3>
											{estimatedReturns && (
												<div className="flex items-center">
													<span className="mr-2 text-sm">
														Estimated Annual Returns
													</span>
													<div className="py-1 px-2 flex flex-col rounded-lg border border-teal-500 w-40">
														<h3 className="text-teal-500">
															{formatCurrency.methods.formatAmount(
																Math.trunc(
																	Number(estimatedReturns.currency || 0) *
																		10 ** 12
																)
															)}
														</h3>
														<span className="text-gray-600 text-sm">
															$
															{formatCurrency.methods.formatNumber(
																estimatedReturns.subCurrency.toFixed(2)
															)}
														</span>
													</div>
												</div>
											)}
										</div>
										<div className="validator-table overflow-y-scroll px-4">
											{validators.map((validator) => (
												<ValidatorCard
													key={validator.stashId}
													name={validator.name}
													stashId={validator.stashId}
													riskScore={validator.riskScore}
													stakedAmount={validator.totalStake}
													estimatedReward={validator.estimatedPoolReward}
													onProfile={() =>
														window.open(
															`${Routes.VALIDATOR_PROFILE}/${validator.stashId}`,
															"_blank"
														)
													}
												/>
											))}
										</div>
									</div>
								</div>
								<div className="flex-center">
									<Button
										px="8"
										py="2"
										mt="5"
										rounded="0.5rem"
										backgroundColor="teal.500"
										color="white"
										onClick={onConfirm}
										isDisabled={!amount}
										isLoading={updatingFunds}
									>
										Confirm
									</Button>
								</div>
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
