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
	useDisclosure,
	List,
	ListItem,
	ListIcon,
	Flex,
} from "@chakra-ui/core";
import { ChevronRight, ChevronDown, Circle } from "react-feather";
import Identicon from "@components/common/Identicon";
import formatCurrency from "@lib/format-currency";
import Transaction from "./Transaction";
import convertCurrency from "@lib/convert-currency";
import RewardDestination from "./RewardDestination";
import TermsAndServicePopover from "@components/payment/TermsOfService";
import { GlossaryModal, HelpPopover } from "@components/reward-calculator";
import RiskTag from "@components/reward-calculator/RiskTag";
import { Events, trackEvent } from "@lib/analytics";
const ValidatorCard = ({
	name,
	stashId,
	riskScore,
	commission,
	totalStake,
	networkInfo,
	estimatedReward,
	nominators,
	onProfile = noop,
}) => {
	const displayName = name
		? name.length > 13
			? name.slice(0, 5) + "..." + name.slice(-5)
			: name
		: stashId.slice(0, 5) + "..." + stashId.slice(-5);
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-200 py-2 w-full mb-2">
			<div className="flex items-center ml-4">
				<Identicon address={stashId} size="2rem" />
				<div className="text-gray-700 cursor-pointer ml-2" onClick={onProfile}>
					<span className="text-xs font-semibold">{displayName}</span>
					{/* <div className="flex items-center">
						<span className="text-xs mr-2">View Profile</span>
						<ExternalLink size="12px" />
					</div> */}
				</div>
			</div>
			{/* <StatusTag status="active" /> */}
			<div className="flex">
				{/* <div className="flex flex-col mx-8">
					<span className="text-xs text-gray-500 font-semibold">
						Nominators
					</span>
					<h3 className="text-xg">{nominators}</h3>
				</div> */}
				<div className="flex flex-col">
					<span className="text-xs text-gray-500 font-semibold">
						Risk Score
					</span>
					<div className="rounded-full font-semibold">
						<RiskTag risk={riskScore} />
					</div>
				</div>
				<div className="flex flex-col items-center mx-2">
					<span className="text-xs text-gray-500 font-semibold">
						Nominators
					</span>
					<h3>{nominators}</h3>
				</div>
				<div className="flex flex-col items-center mx-2">
					<span className="text-xs text-gray-500 font-semibold">
						Commission
					</span>
					<h3>{commission}%</h3>
				</div>
				<div className="flex flex-col items-center mx-2">
					<span className="text-xs text-gray-500 font-semibold">
						Returns/100 {networkInfo.denom}'s
					</span>
					<h3>
						{formatCurrency.methods.formatAmount(
							Math.trunc(
								estimatedReward * Math.pow(10, networkInfo.decimalPlaces)
							),
							networkInfo
						)}
					</h3>
				</div>
			</div>
			{false && (
				<button className="flex items-center justify-between border-2 border-orange-500 rounded-lg py-1 px-3">
					<Star
						className="text-orange-500 mr-2"
						fill="#F5B100"
						size="20px"
						strokeWidth="2px"
					/>
					<div className="flex flex-col items-center">
						<span className="text-sm text-gray-900">Claim Rewards</span>
						<span className="text-xs text-gray-700">3 days left</span>
					</div>
				</button>
			)}
		</div>
	);
};

const ValidatorInfo = ({
	name,
	stashId,
	riskScore,
	amountPerValidator,
	networkInfo,
}) => (
	<div className="mr-2 flex items-center rounded-lg border border-gray-200 px-3 py-2 mb-2 w-full mt-1 text-gray-700">
		<div className="mr-4">
			<Identicon address={stashId} size="2.5rem" />
		</div>
		<div className="flex flex-col items-start">
			<h3 className="font-medium text-sm">
				{name
					? name.length > 16
						? name.slice(0, 6) + "..." + name.slice(-6)
						: name
					: stashId.slice(0, 6) + "..." + stashId.slice(-6) || "-"}
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
			<span className="font-semibold text-xs">Est. Stake</span>
			<h5 className="text-sm">
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

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [tcPopoverOpen, setTCPopoverOpen] = useState(false);
	const [showValidators, setShowValidators] = useState(false);
	const [subCurrency, setSubCurrency] = useState(0);
	const [subFeeCurrency, setFeeSubCurrency] = useState(0);
	const handleValToggle = () => {
		const _showValidators = !showValidators;
		trackEvent(Events.TOGGLE_VALIDATORS, {
			suggestedValidators: _showValidators ? "show" : "hide",
		});
		setShowValidators(_showValidators);
	};
	const [showAdvPrefs, setShowAdvPrefs] = useState(false);
	const handleAdvPrefsToggle = () => {
		const _showAdvPrefs = !showAdvPrefs;
		trackEvent(Events.TOGGLE_ADV_PREFS, {
			advPrefs: _showAdvPrefs ? "show" : "hide",
		});
		setShowAdvPrefs(_showAdvPrefs);
	};

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
		<div className="mt-8 items-center text-gray-700">
			<GlossaryModal
				isOpen={isOpen}
				onClose={onClose}
				header="Investment Risks"
				maxWidth="lg"
				content={
					<List spacing={8} px={8} color="gray.600">
						<ListItem>
							<Flex>
								<span>
									<ListIcon
										icon={Circle}
										size="12px"
										color="teal.500"
										fill="teal.500"
									/>
								</span>
								<p>Capital risk of due to volatility of token price.</p>
							</Flex>
						</ListItem>
						<ListItem>
							<Flex>
								<span>
									<ListIcon
										icon={Circle}
										size="12px"
										color="teal.500"
										fill="teal.500"
									/>
								</span>
								<p>
									There is an{" "}
									<HelpPopover
										zIndex={9999}
										placement="top"
										popoverTrigger={
											<span className="underline cursor-help">
												unbonding period
											</span>
										}
										content={
											<p className="text-white text-xs">
												After staking, your investment amount is "frozen" as
												collateral for earning rewards. Whenever you decide to
												withdraw these funds, you would first need to wait for
												them to "unbond". This waiting duration is called the
												unbonding period and it can vary from network to
												network.
											</p>
										}
									/>{" "}
									of 28 days on Polkadot, 7 days on Kusama.
								</p>
							</Flex>
						</ListItem>
						<ListItem>
							<Flex>
								<span>
									<ListIcon
										icon={Circle}
										size="12px"
										color="teal.500"
										fill="teal.500"
									/>
								</span>
								<p>
									Although YieldScan mitigates this by assigning risk scores to
									validators and giving users the option to choose the level of
									risk they are comfortable with, funds could still get slashed
									if nominated validators misbehave.
								</p>
							</Flex>
						</ListItem>
					</List>
				}
			/>
			<h1 className="text-2xl font-semibold text-center">Confirmation</h1>
			<p className="text-gray-600 text-sm text-center">
				Staking returns are subject to{" "}
				<span className="underline cursor-pointer" onClick={onOpen}>
					Investment Risks
				</span>
				. <br />
				Please read the{" "}
				<Link href="/terms" className="text-blue-400" isExternal>
					Terms of Service
				</Link>{" "}
				before investing.{" "}
			</p>
			<h1 className="text-xl font-semibold mt-4">Account</h1>
			<div className="mr-2 flex items-center rounded-lg bg-gray-100 border border-gray-200 px-3 py-2 mb-2 w-full mt-4">
				<Identicon address={stashAccount.address} size="3rem" />
				<div className="ml-2 flex flex-col">
					<h3 className="font-medium">{stashAccount.meta.name}</h3>
					<span className="text-xs text-gray-600">{stashAccount.address}</span>
				</div>
			</div>
			<button
				onClick={handleValToggle}
				className="flex text-gray-600 text-xs mt-4 items-center"
			>
				<ChevronRight
					size={16}
					className={`transition ease-in-out duration-500 mr-2 ${
						showValidators && "transform rotate-90"
					}`}
				/>
				{showValidators ? "Hide" : "Show"} suggested validators{" "}
				<HelpPopover
					content={
						<p className="text-white text-xs">
							The list of most rewarding validators, selected based on your
							investment amount and risk preference.
						</p>
					}
				/>
			</button>
			<Collapse isOpen={showValidators}>
				<div className="mt-2 rounded-xl mb-8">
					<div className="mb-4 overflow-auto" style={{ height: "12rem" }}>
						{selectedValidators.map((validator) => (
							<ValidatorCard
								key={validator.stashId}
								name={validator.name}
								stashId={validator.stashId}
								riskScore={validator.riskScore.toFixed(2)}
								commission={validator.commission}
								nominators={validator.numOfNominators}
								totalStake={validator.totalStake}
								estimatedReward={Number(validator.rewardsPer100KSM)}
								networkInfo={networkInfo}
								onProfile={() => onProfile(validator)}
							/>
						))}
					</div>
				</div>
			</Collapse>

			<button
				className="flex text-gray-600 text-xs mt-2 items-center"
				onClick={handleAdvPrefsToggle}
			>
				<ChevronRight
					size={16}
					className={`transition ease-in-out duration-500 mr-2 ${
						showAdvPrefs && "transform rotate-90"
					}`}
				/>
				Advanced preferences
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

			<div className="w-full mt-8">
				<div className="flex justify-between">
					<p className="text-gray-700 text-xs">Staking amount</p>
					<div className="flex flex-col">
						<p className="text-sm font-semibold text-right">
							{formatCurrency.methods.formatAmount(
								Math.trunc(stakingAmount * 10 ** networkInfo.decimalPlaces),
								networkInfo
							)}
						</p>
						<p className="text-xs text-right text-gray-600">
							${subCurrency.toFixed(2)}
						</p>
					</div>
				</div>

				<div className="flex justify-between mt-4">
					<div className="text-xs text-gray-700 flex items-center">
						<p>Transaction Fee</p>
						<HelpPopover
							content={
								<p className="text-xs text-white">
									This fee is used to pay for the resources used for processing
									the transaction on the blockchain network. YieldScan doesn’t
									profit from this fee in any way.
								</p>
							}
						/>
					</div>

					<div className="flex flex-col">
						<p className="text-sm font-semibold text-right">
							{formatCurrency.methods.formatAmount(
								Math.trunc(transactionFee),
								networkInfo
							)}
						</p>
						<p className="text-xs text-right text-gray-600">
							${subFeeCurrency.toFixed(2)}
						</p>
					</div>
				</div>
				<Divider my={6} />
				<div className="flex justify-between">
					<p className="text-gray-700 text-sm font-semibold">Total Amount</p>
					<div className="flex flex-col">
						<p className="text-lg text-right font-bold">
							{formatCurrency.methods.formatAmount(
								Math.trunc(stakingAmount * 10 ** networkInfo.decimalPlaces) +
									transactionFee,
								networkInfo
							)}
						</p>
						<p className="text-sm text-right text-gray-600 font-medium">
							${(subCurrency + subFeeCurrency).toFixed(2)}
						</p>
					</div>
				</div>
			</div>

			{/* <div className="mt-6 flex">
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
			</div> */}
			<div className="mt-4 w-full text-center">
				<button
					className="rounded-full font-medium px-12 py-3 bg-teal-500 text-white"
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
