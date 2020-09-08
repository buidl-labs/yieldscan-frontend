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
		const onConfirm = () => {
			onClose();
		};

		console.log("freeAmount");
		console.log("stashAccount");
		console.log("bondedAmount");
		console.log("amount");
		console.log(freeAmount);
		console.log(stashAccount);
		console.log(bondedAmount);
		console.log(amount);

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
								className="m-2 text-gray-600 text-sm"
								hidden={isNil(stashAccount)}
							>
								Free Balance: {get(freeAmount, "currency", 0)} KSM
							</div>
							<div className="my-5">
								<AmountInput
									value={{ currency: amount, subCurrency: subCurrency }}
									bonded={bondedAmount.currency}
									onChange={setAmount}
								/>
							</div>
							<div className="">
								<button
									className="bg-teal-500 text-white py-2 px-5 rounded"
									onClick={onConfirm}
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
