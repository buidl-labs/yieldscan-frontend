import ValidatorsList from "./ValidatorsList";
import formatCurrency from "@lib/format-currency";
import { result } from "lodash";
const ConfirmSelection = ({
	stakingAmount,
	validators,
	selectedValidators,
	setSelectedValidators,
	onAdvancedSelection,
	bondedAmount,
	handleSelectionConfirmation,
	result,
}) => (
	<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
		<h3 className="mt-4 text-2xl">Confirm Selection</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">
			You are about to stake your KSM on the following validators. Please make
			sure you understand the risks before proceeding. Read the Terms of
			Service.
		</span>
		<div className="flex justify-between items-center rounded-full pl-4 border border-gray-200">
			<span>Estimated Returns</span>
			<div className="ml-2 px-3 py-2 bg-teal-500 text-white rounded-full">
				{formatCurrency.methods.formatAmount(
					Math.trunc(result.returns.currency * 10 ** 12)
				)}
			</div>
		</div>
		<ValidatorsList
			// disableList={!totalAmount || !timePeriodValue || !risk}
			stakingAmount={stakingAmount}
			validators={validators}
			selectedValidators={selectedValidators}
			setSelectedValidators={setSelectedValidators}
			onAdvancedSelection={onAdvancedSelection}
		/>
		<button
			className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
			onClick={handleSelectionConfirmation}
		>
			Confirm and Stake
		</button>
	</div>
);

export default ConfirmSelection;
