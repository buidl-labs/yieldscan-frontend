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
	Button,
} from "@chakra-ui/core";
import CompoundRewardSlider from "@components/reward-calculator/CompoundRewardSlider";
import { useAccounts, usePolkadotApi } from "@lib/store";
import { useState, useEffect } from "react";
import { Circle, CheckCircle } from "react-feather";
import { web3FromAddress } from "@polkadot/extension-dapp";
import updatePayee from "@lib/polkadot/update-payee";
import ChainErrorPage from "@components/overview/ChainErrorPage";
import SuccessfullyBonded from "@components/overview/SuccessfullyBonded";
import Identicon from "@components/common/Identicon";

const RewardDestinationModal = withSlideIn(
	({ close, styles, onEditController }) => {
		const toast = useToast();
		const { apiInstance } = usePolkadotApi();
		const { stashAccount } = useAccounts();
		const [updatingFunds, setUpdatingFunds] = useState(false);
		const [stakingEvent, setStakingEvent] = useState();
		const [processComplete, setProcessComplete] = useState(false);
		const [chainError, setChainError] = useState(false);
		const [errMessage, setErrMessage] = useState();
		const [transactionHash, setTransactionHash] = useState();
		const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);
		const [destination, setDestination] = useState("");
		const [compounding, setCompounding] = useState(false);

		const accounts = ["Stash"];
		if (!compounding) accounts.push("Controller");

		useEffect(() => {
			apiInstance.query.staking.payee(stashAccount.address).then((payee) => {
				if (payee.isStaked) setCompounding(true);
				else {
					setCompounding(false);
					if (payee.isController) {
						setDestination("Controller");
					} else {
						setDestination("Stash");
					}
				}
			});
		}, []);

		const onUpdatePayee = () => {
			const payee = compounding ? 0 : destination === "Stash" ? 1 : 2;

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

					if (status === 0) {
						// setProcessComplete(true);
						setUpdatingFunds(false);
						setCloseOnOverlayClick(true);
					} else {
						setUpdatingFunds(false);
						setCloseOnOverlayClick(true);
						setErrMessage(message);
						if (message !== "Cancelled") setChainError(true);
					}
				},
			};
			updatePayee(stashAccount.address, payee, apiInstance, handlers).catch(
				(error) => {
					handlers.onFinish(1, error.message);
				}
			);
		};
		const handleOnClickForSuccessfulTransaction = () => {
			close();
		};

		return (
			<Modal
				isOpen={true}
				onClose={close}
				closeOnOverlayClick={closeOnOverlayClick}
				closeOnEsc={closeOnOverlayClick}
				isCentered
			>
				<ModalOverlay />
				<ModalContent rounded="lg" maxWidth="40rem" height="36rem" {...styles}>
					<ModalHeader>
						<h1>Payment Destination</h1>
					</ModalHeader>
					{closeOnOverlayClick && (
						<ModalCloseButton
							onClick={close}
							boxShadow="0 0 0 0 #fff"
							color="gray.400"
							backgroundColor="gray.100"
							rounded="1rem"
							mt={4}
							mr={4}
						/>
					)}
					<ModalBody>
						<div className="px-20 py-5">
							{!updatingFunds && !processComplete && !chainError && (
								<>
									<h1 className="text-xl">Compound Rewards</h1>
									<span className="text-gray-600 text-sm">
										Your rewards will be locked for staking for the unbonding
										period (approx. 7 days on Kusama)
									</span>
									<div className="mt-5">
										<CompoundRewardSlider
											checked={compounding}
											setChecked={setCompounding}
										/>
									</div>
									<div className="mt-8">
										<h1 className="text-lg">Selected Account</h1>
										<div className="mt-4">
											{accounts.length > 1 ? (
												accounts.map((accountType) => (
													<div
														key={accountType}
														className={`
											w-full flex items-center rounded-lg border-2 border-teal-500 cursor-pointer px-3 py-2 mb-2
											${accountType === destination ? "text-white bg-teal-500" : "text-gray-600"}
										`}
														onClick={() => setDestination(accountType)}
													>
														{destination === accountType ? (
															<CheckCircle className="mr-2" />
														) : (
															<Circle className="mr-2" />
														)}
														<div className="flex flex-col">
															<span>{accountType}</span>
														</div>
													</div>
												))
											) : (
												<div>
													<span className="text-gray-600 text-sm">
														When compounding is enabled, reward destination can
														only be stash account.
													</span>
													{/* <div className="mt-2 flex items-center rounded-lg text-white bg-teal-500 cursor-pointer px-3 py-2 mb-2">
											<div className="flex flex-col">
												<h3>{stashAccount.meta.name}</h3>
												<span className="text-sm">{stashAccount.address}</span>
											</div>
										</div> */}
													<div className="mr-2 flex items-center rounded-lg bg-gray-100 border border-gray-200 px-3 py-4 mb-2 w-full mt-4">
														<Identicon
															address={stashAccount.address}
															size="3.25rem"
														/>
														<div className="ml-2 flex flex-col">
															<h3 className="text-lg">
																{stashAccount.meta.name}
															</h3>
															<span className="text-xs text-gray-600">
																{stashAccount.address}
															</span>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
									{/* <button
							className="text-sm text-gray-600 hover:underline"
							onClick={onEditController}
						>
							Edit Controller
						</button> */}
									<div className="mt-8 flex-center">
										<Button
											px="8"
											py="2"
											mt="5"
											rounded="0.5rem"
											backgroundColor="teal.500"
											color="white"
											onClick={onUpdatePayee}
											isLoading={updatingFunds}
										>
											Update
										</Button>
									</div>
								</>
							)}
							{updatingFunds && !processComplete && !chainError && (
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
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}
);

export default RewardDestinationModal;
