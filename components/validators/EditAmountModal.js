import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/core";
import AmountInput from "@components/reward-calculator/AmountInput";
import withSlideIn from "@components/common/withSlideIn";

const EditAmountModal = withSlideIn(({
	styles,
	onClose,
	bondedAmount,
	amount = '',
	setAmount = noop,
}) => {
	return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="33rem" height="30rem" {...styles}>
				<ModalHeader>
					<h3 className="text-gray-700 font-normal text-2xl">Edit Staking Amount</h3>
				</ModalHeader>
				<ModalCloseButton onClick={onClose} />
				<ModalBody>
					<div className="mt-10">
						<div className="my-5">
							<AmountInput
								value={{ currency: amount, subCurrency: (amount || 0) * 2 }}
								bonded={bondedAmount}
								onChange={setAmount}
							/>
						</div>
						<div className="">
							<button
								className="bg-teal-500 text-white py-2 px-5 rounded"
								onClick={onClose}
							>
								Confirm
							</button>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditAmountModal;
