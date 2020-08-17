import { get, isNil } from "lodash";
import { HelpCircle } from "react-feather";
import {
	Popover,
	PopoverTrigger,
	PopoverBody,
	PopoverContent,
	PopoverArrow,
} from "@chakra-ui/core";
import CountUp from "react-countup";

const ResultCardInsight = ({
	label,
	popoverContent = "",
	value,
	supportValue,
	emptyState,
}) => (
	<div className="mt-2 mr-10">
		<div className="flex items-center">
			<span className="opacity-75 mr-1">{label}</span>
			<Popover trigger="hover">
				<PopoverTrigger>
					<HelpCircle size="1rem" cursor="pointer" strokeOpacity="0.75" />
				</PopoverTrigger>
				<PopoverContent zIndex={50} _focus={{ outline: "none" }} border="none">
					<PopoverArrow />
					<PopoverBody>{popoverContent}</PopoverBody>
				</PopoverContent>
			</Popover>
		</div>
		{emptyState ? (
			<h3 className="text-center text-2xl">-</h3>
		) : (
			<>
				<h3 className="text-2xl">{value}</h3>
				<span hidden className="text-sm">
					{supportValue}
				</span>
			</>
		)}
	</div>
);

const ExpectedReturnsCard = ({
	result,
	stashAccount,
	calculationDisabled,
	onWalletConnectClick,
	onPayment,
}) => {
	const returns = {
		currency: get(result, "returns.currency"),
		subCurrency: get(result, "returns.subCurrency"),
	};

	const portfolio = {
		currency: get(result, "portfolioValue.currency"),
		subCurrency: get(result, "portfolioValue.subCurrency"),
	};

	return (
		<div className="rounded-xl bg-teal-500 text-white px-8 py-6">
			<h1 className="font-semibold text-2xl">Expected Returns</h1>
			<div className="flex flex-wrap mt-2">
				<ResultCardInsight
					label="Estimated Returns"
					value={
						<CountUp
							end={returns.currency}
							duration={0.5}
							decimals={3}
							suffix={" KSM"}
							preserveValue
						/>
					}
					supportValue={`$${returns.subCurrency}`}
					emptyState={!result.returns}
					popoverContent={
						<span className="text-sm text-gray-600">
							These returns are calculated for your entered stake amount, time
							period and risk preference. To learn about how we calculate these
							returns click{" "}
							<a
								href="https://github.com/buidl-labs/yieldscan-frontend/wiki/%5BWIP%5D-Returns-Calculation-Mechanism"
								target="_blank"
								className="text-blue-500"
							>
								here
							</a>
							.
						</span>
					}
				/>
				<ResultCardInsight
					label="Estimated Portfolio Value"
					value={
						<CountUp
							end={portfolio.currency}
							duration={0.5}
							decimals={3}
							suffix={" KSM"}
							preserveValue
						/>
					}
					supportValue={`$${portfolio.subCurrency}`}
					emptyState={!result.returns}
					popoverContent={
						<span className="text-sm text-gray-600">
							This is the estimated value of your staking portfolio based on
							your inputs. This is the sum of your staking amount and your
							expected returns.
						</span>
					}
				/>
				<ResultCardInsight
					label="Estimated Yield"
					value={
						<CountUp
							end={result.yieldPercentage}
							duration={0.5}
							decimals={3}
							suffix={"%"}
							preserveValue
						/>
					}
					emptyState={isNil(result.yieldPercentage)}
					popoverContent={
						<span className="text-sm text-gray-600">
							This is the expected percentage return for the time period you
							input.
						</span>
					}
				/>
			</div>
			<div className="flex justify-end">
				<button
					className={`
						rounded-full font-semibold text-lg mt-5 px-8 py-3
						${
							stashAccount && calculationDisabled
								? "opacity-75 cursor-not-allowed bg-gray-400 text-white"
								: "bg-white text-teal-500"
						}
					`}
					disabled={stashAccount && calculationDisabled}
					onClick={() => (stashAccount ? onPayment() : onWalletConnectClick())}
				>
					{stashAccount ? "Stake" : "Connect Wallet to Stake"}
				</button>
			</div>
		</div>
	);
};

export default ExpectedReturnsCard;
