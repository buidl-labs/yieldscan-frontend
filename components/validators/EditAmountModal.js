import { useState, useEffect } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Alert,
	AlertTitle,
	AlertDescription,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverBody,
} from "@chakra-ui/core";
import AmountInput from "@components/reward-calculator/AmountInput";
import withSlideIn from "@components/common/withSlideIn";
import { isNil, get } from "lodash";
import convertCurrency from "@lib/convert-currency";
import { useAccounts } from "@lib/store";
import formatCurrency from "@lib/format-currency";

const EditAmountModal = withSlideIn(
	({
		styles,
		onClose,
		freeAmount,
		stashAccount,
		bondedAmount,
		amount = "",
		setAmount,
		networkInfo,
	}) => {
		const [stakingAmount, setStakingAmount] = useState(amount);
		const [subCurrency, setSubCurrency] = useState(0);

		const onConfirm = () => {
			if (stakingAmount) setAmount(stakingAmount);
			onClose();
		};

		useEffect(() => {
			convertCurrency(stakingAmount || 0, networkInfo.denom).then(
				(convertedAmount) => {
					setSubCurrency(convertedAmount);
				}
			);
		}, [stakingAmount]);

		const totalBalance = bondedAmount + get(freeAmount, "currency", 0);
		const calculationDisabled =
			(!totalBalance ||
				stakingAmount == 0 ||
				stakingAmount > totalBalance - networkInfo.minAmount) &&
			stashAccount;

		return (
			<Modal isOpen={true} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent rounded="lg" maxWidth="33rem" height="30rem" {...styles}>
					<ModalHeader>
						<h3 className="text-gray-700 font-normal text-2xl">
							Edit Staking Amount
						</h3>
					</ModalHeader>
					<ModalCloseButton onClick={onClose} />
					<ModalBody>
						<div className="mt-4">
							{stashAccount &&
								stakingAmount > totalBalance - networkInfo.minAmount && (
									<Alert
										status="error"
										rounded="md"
										flex
										flexDirection="column"
										alignItems="start"
										my={4}
									>
										<AlertTitle color="red.500">
											Insufficient Balance
										</AlertTitle>
										<AlertDescription color="red.500">
											We cannot stake this amount since we recommend maintaining
											a minimum balance of {networkInfo.minAmount}{" "}
											{networkInfo.denom} in your account at all times.{" "}
											<Popover trigger="hover" usePortal>
												<PopoverTrigger>
													<span className="underline cursor-help">Why?</span>
												</PopoverTrigger>
												<PopoverContent
													zIndex={99999}
													_focus={{ outline: "none" }}
													bg="gray.700"
													border="none"
												>
													<PopoverArrow />
													<PopoverBody>
														<span className="text-white">
															This is to ensure that you have a decent amout of
															funds in your account to pay transaction fees for
															claiming rewards, unbonding funds, changing
															on-chain staking preferences, etc.
														</span>
													</PopoverBody>
												</PopoverContent>
											</Popover>
										</AlertDescription>
									</Alert>
								)}
							<div
								className="m-2 text-gray-600 text-sm"
								hidden={isNil(stashAccount)}
							>
								Transferrable Balance:{" "}
								{formatCurrency.methods.formatAmount(
									Math.trunc(
										get(freeAmount, "currency", 0) *
											10 ** networkInfo.decimalPlaces
									),
									networkInfo
								)}
							</div>
							<div className="my-5">
								<AmountInput
									value={{ currency: amount, subCurrency: subCurrency }}
									bonded={bondedAmount}
									onChange={setStakingAmount}
									networkInfo={networkInfo}
								/>
							</div>
							<div className="">
								<button
									className={`
									bg-teal-500 text-white py-2 px-5 rounded
						${
							stashAccount && calculationDisabled
								? "opacity-75 cursor-not-allowed"
								: "opacity-100"
						}
					`}
									onClick={onConfirm}
									disabled={calculationDisabled}
								>
									Confirm
								</button>
							</div>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}
);

export default EditAmountModal;
