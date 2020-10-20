import ValidatorsList from "./ValidatorsList";
import { ArrowRight } from "react-feather";
import formatCurrency from "@lib/format-currency";
import { Spinner, Alert, AlertIcon } from "@chakra-ui/core";
const ConfirmAmountChange = ({
	stakingAmount,
	validators,
	selectedValidators,
	setSelectedValidators,
	onAdvancedSelection,
	bondedAmount,
	stakingLoading,
	stakingEvent,
	onConfirm,
	transactionHash,
	handlePopoverClose,
	networkInfo,
}) => (
	<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
		{!stakingLoading && (
			<>
				<Alert status="success">
					<AlertIcon />
					Your nominations have been successfully updated.
					<a
						href={`https://${networkInfo.coinGeckoDenom}.subscan.io/block/${transactionHash}`}
						className="mt-6 text-gray-500"
						target="_blank"
					>
						Track this transaction on Subscan
					</a>
				</Alert>
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
					You used a staking budget different than your currently bonded amount
					on the calculator. Would you like to update the amount to match?
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
			</>
		)}
		{stakingLoading && (
			<div className="mt-6">
				{/* <h1 className="font-semibold text-xl text-gray-700">Status:</h1> */}
				<div className="flex items-center justify-between">
					<span>{stakingEvent}</span>
					<Spinner className="ml-4" />
				</div>
			</div>
		)}
	</div>
);

export default ConfirmAmountChange;
