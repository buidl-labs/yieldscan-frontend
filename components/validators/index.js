import { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/core";
import { useTransaction, useAccounts } from "@lib/store";
import ValidatorsResult from "./ValidatorsResult";
import ValidatorsTable from "./ValidatorsTable";
import EditAmountModal from "./EditAmountModal";

const Validators = () => {
	const { bondedAmount } = useAccounts();
	const { isOpen, onClose } = useDisclosure();
	const transactionState = useTransaction();

	useEffect(() => {
		console.log(transactionState);
	}, [transactionState]);

	return (
		<div className="px-10 py-5">
			<EditAmountModal
				isOpen={isOpen}
				onClose={onClose}
			/>
			<ValidatorsResult
				bondedAmount={bondedAmount}
				transactionState={transactionState}
			/>
			<ValidatorsTable
				validatorMap={transactionState.validatorMap}
				selectedValidators={transactionState.selectedValidators}
			/>
		</div>
	);
}

export default Validators;