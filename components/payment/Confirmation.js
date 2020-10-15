import { useState } from "react";
import { get } from "lodash";
import { Stack, Icon, Text, Link } from "@chakra-ui/core";
import Identicon from "@components/common/Identicon";
import formatCurrency from "@lib/format-currency";
import TermsAndServicePopover from "@components/payment/TermsOfService";

const ValidatorInfo = ({
	name,
	stashId,
	riskScore,
	amountPerValidator,
	networkInfo,
}) => (
	<div className="rounded-lg flex items-center border border-gray-200 px-4 py-3 my-1">
		<div className="mr-4">
			<Identicon address={stashId} />
		</div>
		<div className="flex flex-col items-start">
			<h3 className="text-gray-900 text-base">
				<span className="mr-2 text-base">
					{name
						? name.length > 16
							? name.slice(0, 6) + "..." + name.slice(-6)
							: name
						: stashId.slice(0, 6) + "..." + stashId.slice(-6) || "-"}
				</span>
			</h3>
			{/* <span className="flex items-center text-gray-500 text-sm rounded-full border border-gray-200 mt-1 pl-4">
				<span className="text-xs">Risk Score</span>
				<RiskTag
					risk={Number(riskScore).toFixed(2)}
					classes="ml-2 px-4 py-1 rounded-full text-xs"
				/>
			</span> */}
		</div>
		<div className="flex flex-col ml-auto">
			<span className="text-teal-500">Stake</span>
			<h5 className="text-gray-700">
				{formatCurrency.methods.formatAmount(
					Math.trunc(amountPerValidator * 10 ** networkInfo.decimalPlaces),
					networkInfo
				)}
			</h5>
		</div>
	</div>
);

// TODO: currency conversion in Confirmation for `stakingAmount`
const Confirmation = ({
	transactionState,
	bondedAmount,
	hasAgreed,
	setHasAgreed,
	onConfirm,
	networkInfo,
}) => {
	const stakingAmount = get(transactionState, "stakingAmount", 0);
	const selectedValidators = get(transactionState, "selectedValidators", []);
	const bonded = {
		currency: get(bondedAmount, "currency", 0),
		subCurrency: get(bondedAmount, "subCurrency", 0),
	};

	const [tcPopoverOpen, setTCPopoverOpen] = useState(false);

	return (
		<div className="mt-16">
			<h1 className="text-2xl">Confirmation</h1>
			<span className="text-gray-600">
				You are about to stake your KSM on the following validators. Please make
				sure you understand the risks before proceeding. Read the{" "}
				<Link href="/terms" className="text-blue-400" isExternal>
					Terms of Service
				</Link>
			</span>

			<div className="mt-6 rounded-xl border border-gray-200 px-8 py-3 mt-4">
				{/* {false && (
					<h1 className="text-gray-700 text-2xl">Selected Validators</h1>
				)} */}
				<div className="flex justify-between items-center">
					<div className="flex justify-between items-center rounded-full pl-4 border border-gray-200">
						<span>Estimated Returns</span>
						<div className="ml-2 px-3 py-2 bg-teal-500 text-white rounded-full">
							{formatCurrency.methods.formatAmount(
								Math.trunc(
									get(transactionState, "returns.currency", 0) * 10 ** networkInfo.decimalPlaces
								),
								networkInfo
							)}
						</div>
					</div>
					<div className="flex justify-between items-center rounded-full pl-4 border border-gray-200">
						<span>Risk Preference</span>
						<div
							className={`ml-2 px-4 py-2 text-white rounded-full ${
								get(transactionState, "riskPreference") === "Low"
									? "bg-green-400"
									: get(transactionState, "riskPreference") === "Medium"
									? "bg-orange-500"
									: get(transactionState, "riskPreference") === "High" &&
									  "bg-red-500"
							}`}
						>
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
							networkInfo={networkInfo}
						/>
					))}
				</div>
			</div>

			<div
				className={`
					mt-8 mb-12 rounded text-gray-900 flex items-center justify-between
					${!bonded.currency && "w-5/12"}
				`}
			>
				<div className="rounded-lg p-4 flex flex-col justify-center border-2 border-teal-500">
					<span className="text-teal-500 text-sm">Staking Amount</span>
					<h3 className="text-2xl">
						{formatCurrency.methods.formatAmount(
							Math.trunc(stakingAmount * 10 ** networkInfo.decimalPlaces),
							networkInfo
						)}
					</h3>
					{/* <span className="text-gray-500 text-sm">${stakingAmount}</span> */}
				</div>
			</div>
			<Stack isInline>
				<Icon name="warning" size="32px" color="#F5B100" />
				<Text>
					These funds will be locked for a period of 28 eras or 7 days{" "}
				</Text>
			</Stack>
			<button
				className="px-6 py-2 shadow-lg rounded-lg text-white bg-teal-500"
				onClick={() => (hasAgreed ? onConfirm() : setTCPopoverOpen(true))}
			>
				Confirm
			</button>
			<TermsAndServicePopover
				tcPopoverOpen={tcPopoverOpen}
				setTCPopoverOpen={setTCPopoverOpen}
				setHasAgreed={setHasAgreed}
				onConfirm={onConfirm}
			/>
		</div>
	);
};

export default Confirmation;
