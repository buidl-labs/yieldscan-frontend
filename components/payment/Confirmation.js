import { get } from "lodash";
import RiskTag from "@components/reward-calculator/RiskTag";
import Identicon from "@components/common/Identicon";
import { ArrowRight } from "react-feather";
import formatCurrency from "@lib/format-currency";

const ValidatorInfo = ({ name, stashId, riskScore, amountPerValidator }) => (
	<div className="rounded-lg flex items-center border border-gray-200 px-4 mb-2">
		<div className="mr-4">
			<Identicon address={stashId} />
		</div>
		<div className="flex flex-col items-start">
			<h3 className="text-gray-700 text-sm">{name}</h3>
			<span className="flex text-gray-500 text-sm">
				Risk Score
				<RiskTag risk={Number(riskScore).toFixed(2)} />
			</span>
		</div>
		<div className="flex flex-col ml-auto">
			<span className="text-teal-500">Stake</span>
			<h5 className="text-gray-700">
				{formatCurrency.methods.formatAmount(
					Math.trunc(amountPerValidator * 10 ** 12)
				)}
			</h5>
		</div>
	</div>
);

// TODO: currency conversion in Confirmation for `stakingAmount`
const Confirmation = ({ transactionState, bondedAmount, onConfirm }) => {
	const stakingAmount = get(transactionState, "stakingAmount", 0);
	const selectedValidators = get(transactionState, "selectedValidators", []);
	const bonded = {
		currency: get(bondedAmount, "currency", 0),
		subCurrency: get(bondedAmount, "subCurrency", 0),
	};

	return (
		<div className="mt-16">
			<h1 className="text-2xl">Confirmation</h1>
			<span className="text-gray-600">
				You are about to stake your KSM on the following validators. Please make
				sure you understand the risks before proceeding.
			</span>

			<div className="mt-6 rounded-xl border border-gray-200 px-8 py-3 mt-4">
				{false && (
					<h1 className="text-gray-700 text-2xl">Selected Validators</h1>
				)}
				<div className="flex justify-between items-center">
					<div className="flex justify-between items-center rounded-full px-4 py-2 border border-gray-200">
						<span>Estimated Returns</span>
						<div className="ml-2 px-3 py-2 bg-teal-500 text-white rounded-full">
							{formatCurrency.methods.formatAmount(
								Math.trunc(
									get(transactionState, "returns.currency", 0) * 10 ** 12
								)
							)}
						</div>
					</div>
					<div className="flex justify-between items-center rounded-full px-4 py-2 border border-gray-200">
						<span>Risk Preference</span>
						<div className="ml-2 px-3 py-2 bg-orange-500 text-white rounded-full">
							{get(transactionState, "riskPreference")}
						</div>
					</div>
				</div>
				<div className="mt-4 overflow-auto" style={{ height: "12rem" }}>
					{selectedValidators.map((validator) => (
						<ValidatorInfo
							key={validator.stashId}
							name={validator.name || validator.stashId}
							stashId={validator.stashId}
							riskScore={validator.riskScore}
							amountPerValidator={Number(
								stakingAmount / selectedValidators.length
							)}
						/>
					))}
				</div>
			</div>

			<div
				className={`
					mt-8 mb-12 rounded text-gray-900 flex items-center justify-between
					${!bonded.currency && "w-1/3"}
				`}
			>
				{!!bonded.currency && (
					<>
						<div className="rounded-lg p-4 flex flex-col justify-center border-2 border-teal-500">
							<span className="text-teal-500 text-sm">
								Additional Funds to Bond
							</span>
							<h3 className="text-2xl">
								{formatCurrency.methods.formatAmount(
									Math.trunc(stakingAmount * 10 ** 12)
								)}
							</h3>
							{/* <span className="text-gray-500 text-sm">${stakingAmount}</span> */}
						</div>
						<div className="rounded-lg p-4 flex flex-col justify-center">
							<span className="text-gray-600 text-sm">Currently Bonded</span>
							<h3 className="text-2xl">
								{formatCurrency.methods.formatAmount(
									Math.trunc(bonded.currency * 10 ** 12)
								)}
							</h3>
							{/* <span className="text-gray-500 text-sm">${bonded.subCurrency}</span> */}
						</div>
						<ArrowRight />
					</>
				)}
				<div
					className={`rounded-lg p-4 flex flex-col justify-center ${
						!bonded.currency &&
						"bg-gray-100 py-4 pl-6 pr-16 border border-gray-300"
					}`}
				>
					<span
						className={`text-sm ${
							!bonded.currency ? "text-teal-500" : "text-gray-600 "
						}`}
					>
						{!!bonded.currency ? "Total" : ""} Staking Amount
					</span>
					<h3 className="text-2xl">
						{formatCurrency.methods.formatAmount(
							Math.trunc(Number(bonded.currency + stakingAmount) * 10 ** 12)
						)}
					</h3>
					{/* <span className="text-gray-500 text-sm">
						${Number(bonded.subCurrency + stakingAmount).toFixed(4)} KSM
				</span>*/}
				</div>
			</div>

			<button
				className="px-6 py-2 shadow-lg rounded-lg text-white bg-teal-500"
				onClick={onConfirm}
			>
				Agree and Confirm
			</button>
		</div>
	);
};

export default Confirmation;
