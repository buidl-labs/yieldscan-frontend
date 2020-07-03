import { Edit2, ChevronLeft, Settings, Check } from "react-feather";
import { isNil, noop } from "lodash";
import RiskTag from "./RiskTag";
import { useState } from "react";

const ValidatorInfo = ({ name, riskScore, amountPerValidator, editMode, selected, toggleSelected }) => (
	<div
		className={`
			rounded-lg flex items-center px-4 py-2 mb-2 cursor-pointer transition duration-500 w-full overflow-x-hidden
			${selected ? 'border-2 border-teal-500' : 'border border-gray-200'}
		`}
		onClick={toggleSelected}
	>
		{selected && (
			<div className="w-1/5">
				<Check
					size="1.75rem"
					className="p-1 bg-teal-500 text-white mr-2 rounded-full" 
					strokeWidth="4px"
				/>
			</div>
		)}
		<div
			className={`flex items-center justify-between transition duration-200 ${selected && 'transform translate-x-4'}`}
			style={{ width: '26rem' }}
		>
			<div className="flex items-center w-4/5">
				<img src="http://placehold.it/255" className="rounded-full w-16 h-16 mr-4" />
				<div className="flex flex-col items-start w-4/5">
					<h3 className="text-gray-700 truncate w-4/5">{name}</h3>
					<span className="select-none flex text-gray-500 text-sm">
						Risk Score
						<RiskTag risk={riskScore} />
					</span>
				</div>
			</div>
			{!editMode && (
				<div className="flex flex-col ml-5 w-1/5">
					<span className="text-red-400">Amount</span>
					<h5 className="text-gray-700 text-lg truncate">{amountPerValidator.currency} KSM</h5>
					<span className="text-gray-500 text-sm">${amountPerValidator.subCurrency}</span>
				</div>
			)}
		</div>
	</div>
);

// TODO: subCurrency to be calculated right
const ValidatorsList = ({
	disableList,
	totalAmount = 0,
	validators = [],
	selectedValidators = {},
	setSelectedValidators = {},
	onAdvancedSelection = noop,
}) => {
	const [editMode, setEditMode] = useState(false);
	const amountPerValidator = Number((totalAmount / validators.length).toFixed(2));
	const selectedValidatorsList = Object.values(selectedValidators).filter(v => !isNil(v));

	const toggleSelected = (validator) => {
		const { stashId } = validator;

		if (selectedValidatorsList.length === 16 && !selectedValidators[stashId]) return;

		setSelectedValidators({
			...selectedValidators,
			[stashId]: isNil(selectedValidators[stashId]) ? validator : null,
		});
	};

	if (disableList) {
		return (
			<div className="rounded-xl border border-gray-200 px-8 py-6 mt-4">
				<div className="flex-center">
					<img
						src="/images/empty-state.svg"
						alt="empty-state"
						className="w-64 h-64"
					/>
					<span className="text-sm text-gray-500">Fill all inputs to see favourable validators...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-gray-200 px-8 py-6 mt-4">
			{!editMode ? (
				<div className="select-none flex items-center justify-between">
					<h1 className="font-semibold text-gray-700 text-2xl">
						Suggested Validators ({ selectedValidatorsList.length })
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
							<span className="text-gray-500">
								{selectedValidatorsList.length} / 16 selections
							</span>
						</div>
					</div>
					<button
						className="p-2 text-sm flex-center rounded-lg bg-gray-200 text-gray-500 font-semibold cursor-pointer"
						onClick={onAdvancedSelection}
					>
						<Settings className="mr-2 text-gray-700" size="1rem" />
						<span>Advanced Selections</span>
					</button>
				</div>
			)}
			<div className="mt-4 overflow-auto h-64">
				{editMode && validators.map(validator => (
					<ValidatorInfo
						editMode
						key={validator.stashId}
						name={validator.stashId}
						riskScore={Number(validator.riskScore).toFixed(2)}
						amountPerValidator={{
							currency: amountPerValidator,
							subCurrency: amountPerValidator,
						}}
						selected={selectedValidators[validator.stashId]}
						toggleSelected={() => toggleSelected(validator)}
					/>
				))}
				{!editMode && selectedValidatorsList.map(validator => (
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
				{!editMode && !validators.length && (
					<div className="flex-center">
						<img
							src="/images/empty-state.svg"
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
