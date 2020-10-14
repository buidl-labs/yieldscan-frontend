import { get, isNil } from "lodash";
import { HelpCircle, ChevronDown } from "react-feather";
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
					<HelpCircle size="1rem" cursor="help" strokeOpacity="0.75" />
				</PopoverTrigger>
				<PopoverContent
					zIndex={50}
					_focus={{ outline: "none" }}
					bg="gray.700"
					border="none"
				>
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
				<span className="text-sm">{supportValue}</span>
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
	networkInfo,
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
		<>
			<div className="relative rounded-xl bg-teal-500 shadow-teal text-white p-8">
				<h1 className="font-semibold text-2xl">Expected Returns</h1>
				<div className="flex flex-wrap mt-2">
					<ResultCardInsight
						label="Estimated Returns"
						value={
							<CountUp
								end={returns.currency || 0}
								duration={0.5}
								decimals={3}
								separator=","
								suffix={` ${networkInfo.denom}`}
								preserveValue
							/>
						}
						supportValue={
							<CountUp
								end={returns.subCurrency || 0}
								duration={0.5}
								decimals={2}
								separator=","
								prefix="$"
								suffix=" USD"
								preserveValue
							/>
						}
						emptyState={!result.returns}
						popoverContent={
							<span className="text-sm text-white bg-gray-800">
								These returns are calculated for your entered stake amount, time
								period and risk preference. To learn about how we calculate
								these returns{" "}
								<a
									href="https://github.com/buidl-labs/yieldscan-frontend/wiki/Returns-Calculation-Mechanism"
									target="_blank"
									className="underline"
								>
									click here
								</a>
								.
							</span>
						}
					/>
					<ResultCardInsight
						label="Estimated Portfolio Value"
						value={
							<CountUp
								end={portfolio.currency || 0}
								duration={0.5}
								decimals={3}
								separator=","
								suffix={` ${networkInfo.denom}`}
								preserveValue
							/>
						}
						supportValue={
							<CountUp
								end={portfolio.subCurrency || 0}
								duration={0.5}
								decimals={2}
								separator=","
								prefix="$"
								suffix=" USD"
								preserveValue
							/>
						}
						emptyState={!result.returns}
						popoverContent={
							<span className="text-sm text-white">
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
								end={result.yieldPercentage || 0}
								duration={0.5}
								decimals={2}
								suffix="%"
								preserveValue
							/>
						}
						emptyState={isNil(result.yieldPercentage)}
						popoverContent={
							<span className="text-sm text-white">
								This is the expected percentage return for the time period you
								input.
							</span>
						}
					/>
				</div>
				<div className="flex mt-4">
					<button
						className={`
						rounded-full font-semibold text-lg mt-5 px-8 py-3 bg-white text-teal-500
						${
							stashAccount && calculationDisabled
								? "opacity-75 cursor-not-allowed"
								: "opacity-100"
						}
					`}
						disabled={false && stashAccount && calculationDisabled}
						onClick={() =>
							stashAccount ? onPayment() : onWalletConnectClick()
						}
					>
						{stashAccount ? "Stake" : "Connect Wallet to Stake"}
					</button>
				</div>
				<div className="absolute bg-white h-16 w-16 -ml-8 mt-4 rounded-full text-gray-900 flex items-center justify-center shadow-teal left-50">
					<ChevronDown />
				</div>
			</div>
		</>
	);
};

export default ExpectedReturnsCard;
