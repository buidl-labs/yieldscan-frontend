import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/core";
import AmountInput from "@components/reward-calculator/AmountInput";
import withSlideIn from "@components/common/withSlideIn";
import { isNil, get } from "lodash";

const EditAmountModal = withSlideIn(({
	styles,
	onClose,
	freeAmount,
	stashAccount,
	bondedAmount,
	amount = '',
	setAmount,
}) => {
	const [stakingAmount, setStakingAmount] = useState(amount);

	const onConfirm = () => {
		if (stakingAmount) setAmount(stakingAmount);
		onClose();
	};

	return (
		<Modal isOpen={true} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="33rem" height="30rem" {...styles}>
				<ModalHeader>
					<h3 className="text-gray-700 font-normal text-2xl">Edit Staking Amount</h3>
				</ModalHeader>
				<ModalCloseButton onClick={onClose} />
				<ModalBody>
					<div className="mt-4">
						<div
							className="m-2 text-gray-600 text-sm"
							hidden={isNil(stashAccount)}
						>
							Free Balance: {get(freeAmount, 'currency', 0)} KSM
						</div>
						<div className="my-5">
							<AmountInput
								value={{ currency: stakingAmount, subCurrency: (stakingAmount || 0) * 2 }}
								bonded={bondedAmount}
								onChange={setStakingAmount}
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
});

export default EditAmountModal;
