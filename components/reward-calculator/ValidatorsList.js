import { Edit2, ChevronLeft, Settings } from "react-feather";
import { get } from "lodash";
import RiskTag from "./RiskTag";
import { useState } from "react";

const ValidatorInfo = ({ name, riskScore, amountPerValidator}) => (
	<div className="rounded-lg flex items-center border border-gray-200 px-4 py-2 mb-2">
		<img src="http://placehold.it/255" className="rounded-full w-16 h-16 mr-4" />
		<div className="flex flex-col items-start w-2/5">
			<h3 className="text-gray-700 truncate w-full truncate">{name}</h3>
			<span className="flex text-gray-500 text-sm">
				Risk Score
				<RiskTag risk={riskScore} />
			</span>
		</div>
		<div className="flex flex-col w-2/5 ml-auto">
			<div className="ml-auto">
				<span className="text-red-400">Amount</span>
				<h5 className="text-gray-700 text-lg truncate">{amountPerValidator.currency} KSM</h5>
				<span className="text-gray-500 text-sm">${amountPerValidator.subCurrency}</span>
			</div>
		</div>
	</div>
);

// TODO: subCurrency to be calculated right
const ValidatorsList = ({ risk, totalAmount = 0, validatorMap = {} }) => {
	const [editMode, setEditMode] = useState(false);
	const validators = get(validatorMap, risk, []);
	const amountPerValidator = totalAmount / validators.length;

	return (
		<div className="rounded-xl border border-gray-200 px-8 py-6 mt-4">
			{!editMode ? (
				<div className="select-none flex items-center justify-between">
					<h1 className="font-semibold text-gray-700 text-2xl">
						Suggested Validators
					</h1>
					<Edit2
						size="1.5rem"
						className="cursor-pointer"
						onClick={() => setEditMode(true)}
					/>
				</div>
			) : (
				<div className="select-none flex items-center justify-between">
					<div className="flex items-center font-semibold">
						<div className="mr-4">
							<ChevronLeft
								size="2rem"
								strokeWidth="2px"
								className="bg-gray-700 text-white rounded-full p-1 cursor-pointer"
								onClick={() => setEditMode(false)}
							/>
						</div>
						<div>
							<h1 className="text-gray-700 text-xl">
								Edit Validators
							</h1>
							<span className="text-gray-500">16 selections</span>
						</div>
					</div>
					<button className="p-2 text-sm flex-center rounded-lg bg-gray-200 text-gray-500 font-semibold cursor-pointer">
						<Settings className="mr-2 text-gray-700" size="1rem" />
						<span>Advanced Selections</span>
					</button>
				</div>
			)}
			<div className="mt-4 overflow-auto h-64">
				{validators.map(validator => (
					<ValidatorInfo
						key={validator.stashId}
						name={validator.stashId}
						riskScore={Number(validator.riskScore).toFixed(2)}
						amountPerValidator={{
							currency: amountPerValidator,
							subCurrency: amountPerValidator,
						}}
					/>
				))}
				{!validators.length && (
					<div className="flex-center">
						<img
							src="images/empty-state.svg"
							alt="empty-state"
							className="w-64 h-64"
						/>
						<span className="text-sm text-gray-500">Select risk for suggestions...</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default ValidatorsList;
