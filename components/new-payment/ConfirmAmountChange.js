import ValidatorsList from "./ValidatorsList";
import { ArrowRight } from "react-feather";
import formatCurrency from "@lib/format-currency";
const ConfirmAmountChange = ({
	stakingAmount,
	validators,
	selectedValidators,
	setSelectedValidators,
	onAdvancedSelection,
	bondedAmount,
	onConfirm,
	handlePopoverClose,
}) => (
	<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
		<h3 className="mt-4 text-2xl">Change Bonding Amount</h3>
		<div className="mt-8 mb-12 rounded text-gray-900 flex items-center justify-between">
			<div className="rounded-lg p-4 flex flex-col justify-center">
				<span className="text-gray-600 text-sm">Currently Bonded</span>
				<h3 className="text-2xl">{bondedAmount.currency}</h3>
				<span className="text-gray-500 text-sm">
					${bondedAmount.subCurrency}
				</span>
			</div>
			<ArrowRight />
			<div className="rounded-lg p-4 flex flex-col justify-center">
				<span className="text-gray-600 text-sm">Final Bonded Amount</span>
				<h3 className="text-2xl">{stakingAmount.currency}</h3>
				<span className="text-gray-500 text-sm">
					${stakingAmount.subCurrency}
				</span>
			</div>
		</div>
		<span className="mt-1 px-4 text-sm text-gray-500">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
			veniam
		</span>
		<button
			className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
			onClick={handlePopoverClose}
		>
			Back to Dashboard
		</button>
		<button
			className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
			onClick={onConfirm}
		>
			Confirm and Stake
		</button>
	</div>
);

export default ConfirmAmountChange;
