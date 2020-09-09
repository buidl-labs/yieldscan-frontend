import { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
} from "@chakra-ui/core";
import AmountInput from "@components/reward-calculator/AmountInput";
import withSlideIn from "@components/common/withSlideIn";
import { isNil, get } from "lodash";

const EditAmountModal = withSlideIn(
	({
		styles,
		onClose,
		freeAmount,
		stashAccount,
		bondedAmount,
		amount = "",
		setAmount,
		subCurrency,
	}) => {
		const [stakingAmount, setStakingAmount] = useState(amount);

		const onConfirm = () => {
			if (stakingAmount) setAmount(stakingAmount);
			onClose();
		};

		const totalBalance = bondedAmount + get(freeAmount, "currency", 0);
		const calculationDisabled =
			(!totalBalance ||
				stakingAmount == 0 ||
				stakingAmount > totalBalance - 0.1) &&
			stashAccount;

		console.log("stakingAmount");
		console.log(stakingAmount);

		console.log("freeAmount");
		console.log("stashAccount");
		console.log("bondedAmount");
		console.log("amount");
		console.log(freeAmount);
		console.log(stashAccount);
		console.log(bondedAmount);
		console.log(amount);
		console.log("totalBalance");
		console.log(totalBalance);

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
							<div
								className="rounded-lg px-5 py-2 text-sm bg-red-200 text-red-600 my-4"
								hidden={!stashAccount || stakingAmount < totalBalance - 0.1}
							>
								<span>
									We cannot stake this amount since you need to maintain a
									minimum balance of 0.1 KSM in your account at all times.{" "}
								</span>
								{/* <a href="#" className="text-blue-500">Learn More?</a> */}
							</div>
							<div
								className="m-2 text-gray-600 text-sm"
								hidden={isNil(stashAccount)}
							>
								Free Balance: {get(freeAmount, "currency", 0)} KSM
							</div>
							<div className="my-5">
								<AmountInput
									value={{ currency: amount, subCurrency: subCurrency }}
									bonded={bondedAmount}
									onChange={setStakingAmount}
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
