import { Filter } from "react-feather";
import { useState, useEffect } from "react";
import { useDisclosure, Select } from "@chakra-ui/core";
import { useTransaction, useAccounts } from "@lib/store";
import calculateReward from "@lib/calculate-reward";
import ValidatorsResult from "./ValidatorsResult";
import ValidatorsTable from "./ValidatorsTable";
import EditAmountModal from "./EditAmountModal";
import { mapValues, keyBy, isNil } from "lodash";

const Validators = () => {
	const { bondedAmount } = useAccounts();
	const { isOpen, onClose, onToggle } = useDisclosure();
	const transactionState = useTransaction();

	const [amount, setAmount] = useState(transactionState.stakingAmount);
	const [timePeriodValue, setTimePeriod] = useState(transactionState.timePeriodValue);
	const [timePeriodUnit, setTimePeriodUnit] = useState(transactionState.timePeriodUnit || 'months');
	const [selectedValidatorsMap, setSelectedValidatorsMap] = useState(
		mapValues(keyBy(transactionState.selectedValidators, 'stashId'))
	);
	const [result, setResult] = useState({});

	useEffect(() => {
		// console.log(transactionState);
	}, [transactionState]);

	useEffect(() => {
		if (amount && timePeriodValue && timePeriodUnit) {
			const selectedValidatorsList = Object.values(selectedValidatorsMap).filter(v => !isNil(v));
			console.log(selectedValidatorsList);
			calculateReward(
				selectedValidatorsList,
				amount,
				timePeriodValue,
				timePeriodUnit,
				true,
				bondedAmount,
			).then(setResult).catch(error => {
				// TODO: handle error gracefully with UI toast
				alert(error);
			});
		}
	}, [amount, timePeriodValue, timePeriodUnit, selectedValidatorsMap])

	console.log(result);

	return (
		<div className="px-10 py-5">
			<EditAmountModal
				isOpen={isOpen}
				onClose={onClose}
				amount={amount}
				setAmount={setAmount}
				bondedAmount={bondedAmount}
			/>
			<ValidatorsResult
				stakingAmount={amount}
				bondedAmount={bondedAmount}
				timePeriodValue={timePeriodValue}
				timePeriodUnit={timePeriodUnit}
				onTimePeriodValueChange={setTimePeriod}
				onTimePeriodUnitChange={setTimePeriodUnit}
				onEditAmount={onToggle}
				result={result}
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
				selectedValidatorsMap={selectedValidatorsMap}
				setSelectedValidators={setSelectedValidatorsMap}
			/>
		</div>
	);
}

export default Validators;