import { useState, useEffect } from "react";
import { get } from "lodash";
import {
	Stack,
	Icon,
	Text,
	Link,
	Collapse,
	Button,
	Divider,
	Alert,
	AlertDescription,
	AlertIcon,
} from "@chakra-ui/core";
import { ChevronRight, ChevronDown } from "react-feather";
import Identicon from "@components/common/Identicon";
import formatCurrency from "@lib/format-currency";
import Transaction from "./Transaction";
import convertCurrency from "@lib/convert-currency";
import RewardDestination from "./RewardDestination";
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
	setTransactionState,
	stashAccount,
	accounts,
	stakingLoading,
	setController,
	bondedAmount,
	hasAgreed,
	setHasAgreed,
	transactionFee,
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
	const [showValidators, setShowValidators] = useState(false);
	const [subCurrency, setSubCurrency] = useState(0);
	const [subFeeCurrency, setFeeSubCurrency] = useState(0);
	const handleValToggle = () => setShowValidators(!showValidators);
	const [showAdvPrefs, setShowAdvPrefs] = useState(false);
	const handleAdvPrefsToggle = () => setShowAdvPrefs(!showAdvPrefs);

	useEffect(() => {
		convertCurrency(stakingAmount, networkInfo.denom).then(
			(convertedAmount) => {
				setSubCurrency(convertedAmount);
			}
		);
	}, []);

	useEffect(() => {
		convertCurrency(
			transactionFee / Math.pow(10, networkInfo.decimalPlaces),
			networkInfo.denom
		).then((convertedAmount) => {
			setFeeSubCurrency(convertedAmount);
		});
	}, [transactionFee]);

	return (
		<div className="mt-16 items-center">
			<h1 className="text-2xl text-center">Confirmation</h1>
			<span className="text-gray-600 text-center">
				Staking returns are subject to market risks. Please read the{" "}
				<Link href="/terms" className="text-blue-400" isExternal>
					Terms of Service
				</Link>{" "}
				before investing.{" "}
			</span>
			<h1 className="text-2xl">Account</h1>
			<div className="mr-2 flex items-center rounded-lg bg-gray-100 border border-gray-200 px-3 py-4 mb-2 w-full mt-4">
				<Identicon address={stashAccount.address} size="3.25rem" />
				<div className="ml-2 flex flex-col">
					<h3 className="text-lg">{stashAccount.meta.name}</h3>
					<span className="text-xs text-gray-600">{stashAccount.address}</span>
				</div>
			</div>
			<button onClick={handleValToggle}>
				{showValidators ? (
					<div className="flex text-gray-600">
						<ChevronDown /> Hide suggested validators
					</div>
				) : (
					<div className="flex text-gray-600">
						<ChevronRight /> Show suggested validators
					</div>
				)}
			</button>
			<Collapse isOpen={showValidators}>
				<div className="mt-6 rounded-xl mt-4">
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
			</Collapse>

			<button onClick={handleAdvPrefsToggle}>
				{showAdvPrefs ? (
					<div className="flex text-gray-600">
						<ChevronDown /> Advanced preferences
					</div>
				) : (
					<div className="flex text-gray-600">
						<ChevronRight /> Advanced preferences
					</div>
				)}
			</button>
			<Collapse isOpen={showAdvPrefs}>
				<div className="mt-6 rounded-xl mt-4">
					<Transaction
						accounts={accounts}
						stashAccount={stashAccount}
						stakingLoading={stakingLoading}
						transactionState={transactionState}
						setController={setController}
						networkInfo={networkInfo}
					/>
					<RewardDestination
						stashAccount={stashAccount}
						transactionState={transactionState}
						setTransactionState={setTransactionState}
						networkInfo={networkInfo}
					/>
				</div>
			</Collapse>

			<div className="ml-2 flex w-full">
				<div className="flex w-1/2">
					<p className="text-gray-800 text-base">Staking amount</p>
				</div>
				<div className="flex w-1/2 flex-col">
					<p className="text-xs w-full text-right">
						{formatCurrency.methods.formatAmount(
							Math.trunc(stakingAmount * 10 ** networkInfo.decimalPlaces),
							networkInfo
						)}
					</p>
					<p className="text-xs w-full text-right">${subCurrency.toFixed(2)}</p>
				</div>
			</div>
			<div className="ml-2 flex w-full">
				<div className="flex w-1/2">
					<p className="text-gray-800 text-base">Transaction Fee</p>
				</div>
				<div className="flex w-1/2 flex-col">
					<p className="text-xs w-full text-right">
						{formatCurrency.methods.formatAmount(transactionFee, networkInfo)}
					</p>
					<p className="text-xs w-full text-right">
						${subFeeCurrency.toFixed(2)}
					</p>
				</div>
			</div>
			<Divider />
			<div className="ml-2 flex w-full">
				<div className="flex w-1/2">
					<p className="text-gray-800 text-base">
						<strong>Total Amount</strong>
					</p>
				</div>
				<div className="flex w-1/2 flex-col">
					<p className="text-xs w-full text-right">
						<strong>
							{formatCurrency.methods.formatAmount(
								Math.trunc(stakingAmount * 10 ** networkInfo.decimalPlaces) +
									transactionFee,
								networkInfo
							)}
						</strong>
					</p>
					<p className="text-xs w-full text-right">
						<strong>${(subCurrency + subFeeCurrency).toFixed(2)}</strong>
					</p>
				</div>
			</div>
			<div className="mt-6 flex">
				<Alert
					status="warning"
					color="#FDB808"
					backgroundColor="#FFF4DA"
					borderRadius="8px"
				>
					<AlertIcon name="info-outline" />
					<AlertDescription color="#FDB808" fontSize="14px">
						<strong>Warning:</strong> After investing, your funds will be locked
						and will remain locked after withdrawing (triggering unlock) for
						approximately <strong>{networkInfo.lockUpPeriod} days</strong>.
					</AlertDescription>
				</Alert>
			</div>
			<div className="mt-4 w-full text-center">
				<button
					className="rounded-full font-semibold text-lg px-10 py-4 bg-teal-500 text-white"
					onClick={() => onConfirm()}
				>
					Invest Now
				</button>
			</div>
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
