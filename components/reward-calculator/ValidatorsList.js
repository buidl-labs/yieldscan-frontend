import {
	Edit2,
	ChevronLeft,
	Settings,
	Check,
	ExternalLink,
} from "react-feather";
import { isNil, noop, cloneDeep } from "lodash";
import RiskTag from "./RiskTag";
import { useState, useEffect } from "react";
import Routes from "@lib/routes";
import Identicon from "@components/common/Identicon";
import CountUp from "react-countup";
import formatCurrency from "@lib/format-currency";

const ValidatorInfo = ({
	name,
	stashId,
	riskScore,
	amountPerValidator,
	editMode,
	selected,
	toggleSelected,
	onProfile = noop,
}) => {
	return (
		<div
			className={`
			rounded-lg flex items-center px-4 py-2 mb-2 cursor-pointer transition duration-500 w-full overflow-x-hidden
			${selected ? "border-2 border-teal-500" : "border border-gray-200"}
		`}
			onClick={toggleSelected}
		>
			{selected && (
				<div className="w-1/5">
					<Check
						size="1.75rem"
						className="p-1 bg-teal-500 text-white rounded-full"
						strokeWidth="4px"
					/>
				</div>
			)}
			<div
				className={`flex items-center justify-between transition duration-200 ${
					selected && "transform translate-x-4"
				}`}
				style={{ width: "26rem" }}
			>
				<div className="flex items-center w-2/3" onClick={onProfile}>
					<div className="mr-4">
						<Identicon address={stashId} size="3rem" />
					</div>
					<div className="flex flex-col items-start w-4/5">
						<div className="flex items-center text-gray-700 truncate w-4/5">
							<span className="mr-2 text-base">
								{name
									? name.length > 16
										? name.slice(0, 6) + "..." + name.slice(-6)
										: name
									: stashId.slice(0, 6) + "..." + stashId.slice(-6) || "-"}
							</span>
							{/* <ExternalLink size="1rem" /> */}
						</div>
						<span className="select-none flex text-gray-500 items-center text-gray-500 text-sm rounded-full border border-gray-200 mt-1 pl-4">
							<span className="text-xs">Risk Score</span>
							<RiskTag
								risk={Number(riskScore).toFixed(2)}
								classes="ml-2 px-4 rounded-full text-xs font-bold"
							/>
						</span>
					</div>
				</div>
				{!editMode && (
					<div className="flex flex-col ml-5">
						<span className="text-teal-500 text-sm">Stake</span>
						<h5 className="text-gray-700 text-lg truncate">
							{formatCurrency.methods.formatAmount(
								Math.trunc(amountPerValidator.currency * 10 ** 12)
							)}
							{/* <CountUp
							end={amountPerValidator.currency}
							duration={0.5}
							decimals={3}
							suffix={" KSM"}
							preserveValue
						/> */}
						</h5>
						<span hidden className="text-gray-500 text-sm">
							<CountUp
								end={amountPerValidator.subCurrency}
								duration={0.5}
								decimals={2}
								prefix={"$"}
								preserveValue
							/>
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

// TODO: subCurrency to be calculated right
const ValidatorsList = ({
	disableList,
	stakingAmount = 0,
	validators = [],
	selectedValidators = {},
	setSelectedValidators = {},
	onAdvancedSelection = noop,
}) => {
	const [editMode, setEditMode] = useState(false);
	const [tempSelectedValidators, setTempSelectedValidators] = useState({});

	useEffect(() => {
		setTempSelectedValidators(cloneDeep(selectedValidators));
	}, [selectedValidators]);

	const toggleSelected = (validator) => {
		const { stashId } = validator;

		if (
			tempSelectedValidatorsList.length === 16 &&
			!tempSelectedValidators[stashId]
		)
			return;

		setTempSelectedValidators({
			...tempSelectedValidators,
			[stashId]: isNil(tempSelectedValidators[stashId]) ? validator : null,
		});
	};

	const toggleEditMode = () => {
		setTempSelectedValidators(cloneDeep(selectedValidators));
		setEditMode(!editMode);
	};

	const onConfirm = () => {
		setSelectedValidators(cloneDeep(tempSelectedValidators));
		setEditMode(false);
	};

	const sortedValidators = validators.sort((v1, v2) => {
		if (tempSelectedValidators[v1.stashId]) return -1;
		else if (tempSelectedValidators[v2.stashId]) return 1;
		else return 0;
	});

	const selectedValidatorsList = Object.values(selectedValidators).filter(
		(v) => !isNil(v)
	);
	const amountPerValidator = Number(
		stakingAmount / selectedValidatorsList.length
	);
	const tempSelectedValidatorsList = Object.values(
		tempSelectedValidators
	).filter((v) => !isNil(v));

	if (disableList) {
		return (
			<div className="rounded-xl border border-gray-200 px-8 py-6 mt-8">
				<div className="flex-center">
					<img
						src="/images/empty-state.svg"
						alt="empty-state"
						className="w-64 h-64"
					/>
					<span className="text-sm text-gray-500">
						Fill all inputs to see the most rewarding validators...
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-gray-200 px-8 py-6 mt-8">
			{!editMode ? (
				<div className="select-none flex flex-col justify-center">
					<h1 className="font-semibold text-gray-700 text-2xl">
						Suggested Validators
					</h1>
					<p className="text-gray-600 text-sm">
						Found {selectedValidatorsList.length} suggestions
					</p>
					{/* <Edit2
						size="1.5rem"
						className="cursor-pointer"
						onClick={toggleEditMode}
					/> */}
				</div>
			) : (
				<div className="select-none flex items-center justify-between">
					<div className="flex items-center font-semibold">
						<div className="mr-4">
							<ChevronLeft
								size="2rem"
								strokeWidth="2px"
								className="bg-gray-700 text-white rounded-full p-1 cursor-pointer"
								onClick={toggleEditMode}
							/>
						</div>
						<div>
							<h1 className="text-gray-700 text-xl">Edit Validators</h1>
							<span className="text-gray-500">
								{tempSelectedValidatorsList.length} / 16 selections
							</span>
						</div>
					</div>
					<button
						className="p-2 text-sm flex-center rounded-lg bg-gray-200 text-gray-500 font-semibold cursor-pointer"
						onClick={onAdvancedSelection}
					>
						<Settings className="mr-2 text-gray-700" size="1rem" />
						<span>Advanced</span>
					</button>
					<button
						className="p-2 px-4 text-sm flex-center rounded-full bg-teal-500 text-white font-semibold cursor-pointer"
						onClick={onConfirm}
					>
						Confirm
					</button>
				</div>
			)}
			<div className="mt-4 overflow-auto h-64">
				{editMode &&
					sortedValidators.map((validator) => (
						<ValidatorInfo
							editMode
							key={validator.stashId}
							name={validator.name}
							stashId={validator.stashId}
							riskScore={Number(validator.riskScore).toFixed(2)}
							amountPerValidator={{
								currency: amountPerValidator,
								subCurrency: amountPerValidator,
							}}
							selected={tempSelectedValidators[validator.stashId]}
							toggleSelected={() => toggleSelected(validator)}
						/>
					))}
				{!editMode &&
					selectedValidatorsList.map((validator) => (
						<ValidatorInfo
							key={validator.stashId}
							name={validator.name}
							stashId={validator.stashId}
							riskScore={Number(validator.riskScore).toFixed(2)}
							amountPerValidator={{
								currency: amountPerValidator,
								subCurrency: amountPerValidator,
							}}
							onProfile={() =>
								window.open(
									`${Routes.VALIDATOR_PROFILE}/${validator.stashId}`,
									"_blank"
								)
							}
						/>
					))}
				{!editMode && !validators.length && (
					<div className="flex-center">
						<img
							src="/images/empty-state.svg"
							alt="empty-state"
							className="w-64 h-64"
						/>
						<span className="text-sm text-gray-500">
							Select risk for suggestions...
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default ValidatorsList;
