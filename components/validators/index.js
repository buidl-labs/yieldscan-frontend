import { useEffect } from "react";
import { useDisclosure, Select } from "@chakra-ui/core";
import { useTransaction, useAccounts } from "@lib/store";
import ValidatorsResult from "./ValidatorsResult";
import ValidatorsTable from "./ValidatorsTable";
import EditAmountModal from "./EditAmountModal";
import { Filter } from "react-feather";

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
			<div className="flex justify-between items-center mt-10">
				<div className="flex items-center">
					<span className="text-gray-700 mr-4">Sort by</span>
					<Select
						rounded="full"
						border="1px"
						borderColor="gray.500"
						color="gray.800"
						pl="1rem"
						width="14rem"
						fontSize="xs"
						cursor="pointer"
						height="2rem"
						value="Estimated Rewards"
						onChange={ev => onSortValueChange(ev.target.value)}
					>
						<option value="estimated-rewards">Estimated Rewards</option>
						<option value="risk-score">Risk Score</option>
						<option value="commission">Commission</option>
						<option value="other-stake">Other Stake</option>
					</Select>
				</div>
				<div>
					<button className="flex items-center select-none rounded-xl bg-gray-900 text-white px-3 py-1">
						<Filter size="1rem" className="mr-2" />
						<span>Filter</span>
					</button>
				</div>
			</div>
			<ValidatorsTable
				validatorMap={transactionState.validatorMap}
				selectedValidators={transactionState.selectedValidators}
			/>
		</div>
	);
}

export default Validators;