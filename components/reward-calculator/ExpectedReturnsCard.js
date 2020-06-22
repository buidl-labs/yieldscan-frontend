import { get, isNil } from 'lodash';
import { HelpCircle } from "react-feather";

const ResultCardInsight = ({ label, value, supportValue, emptyState }) => (
	<div className="mt-2 mr-10">
		<div className="flex items-center">
			<span className="opacity-75 mr-1">{label}</span>
			<HelpCircle size="1rem" cursor="pointer" strokeOpacity="0.75" />
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
}) => {
	const returns = {
		currency: get(result, 'returns.currency'),
		subCurrency: get(result, 'returns.subCurrency'),
	};

	const portfolio = {
		curency: get(result, 'portfolioValue.currency'),
		subCurrency: get(result, 'portfolioValue.subCurrency'),
	};

	return (
		<div className="rounded-xl bg-teal-500 text-white px-8 py-6">
			<h1 className="font-semibold text-2xl">Expected Returns</h1>
			<div className="flex flex-wrap mt-2">
				<ResultCardInsight
					label="Estimated Returns"
					value={`${returns.currency} KSM`}
					supportValue={`$${returns.subCurrency}`}
					emptyState={!result.returns}
				/>
				<ResultCardInsight
					label="Estimated Portfolio Value"
					value={`${portfolio.curency} KSM`}
					supportValue={`$${portfolio.subCurrency}`}
					emptyState={!result.returns}
				/>
				<ResultCardInsight
					label="Estimated Yield"
					value={`${result.yieldPercentage}%`}
					emptyState={isNil(result.yieldPercentage)}
				/>
			</div>
			<div className="flex justify-end">
				<button
					className={`
						rounded-full font-semibold text-lg mt-5 px-8 py-3
						${stashAccount && calculationDisabled ? 'opacity-75 cursor-not-allowed bg-gray-400 text-white' : 'bg-white text-teal-500'}
					`}
					disabled={stashAccount && calculationDisabled}
					onClick={() => stashAccount ? onPayment() : onWalletConnectClick()}
				>
					{stashAccount ? 'Stake' : 'Connect Wallet to Stake'}
				</button>
			</div>
		</div>
	);
};

export default ExpectedReturnsCard;
