import { HelpCircle } from "react-feather";

const ResultCardInsight = ({ label, value, supportValue }) => (
	<div className="mt-2 mr-10">
		<div className="flex-center">
			<span className="opacity-75 mr-1">{label}</span>
			<HelpCircle size="1rem" cursor="pointer" strokeOpacity="0.75" />
		</div>
		<h3 className="text-2xl">{value}</h3>
		<span className="text-sm">{supportValue}</span>
	</div>
);

const ExpectedReturnsCard = ({ onWalletConnectClick }) => (
	<div className="rounded-xl bg-teal-500 text-white px-8 py-6">
		<h1 className="font-semibold text-2xl">Expected Returns</h1>
		<div className="flex flex-wrap mt-2">
			<ResultCardInsight
				label="Estimated Returns"
				value="100 KSM"
				supportValue="$50"
			/>
			<ResultCardInsight
				label="Estimated Portfolio Value"
				value="1000 KSM"
				supportValue="$500"
			/>
			<ResultCardInsight
				label="Estimated Yield"
				value="5.46%"
			/>
		</div>
		<button
			className="rounded-full font-semibold bg-white text-teal-500 text-lg mt-5 px-8 py-3"
			onClick={onWalletConnectClick}
		>
			Connect Wallet to Stake
		</button>
	</div>
);

export default ExpectedReturnsCard;
