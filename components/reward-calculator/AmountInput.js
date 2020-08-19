import {
	InputGroup,
	InputRightAddon,
	Input,
	InputRightElement,
} from "@chakra-ui/core";

const AmountInputDefault = ({ bonded, value, onChange }) => {
	console.log(bonded);
	const [isEditable, setIsEditable] = React.useState(true);
	return (
		<div>
			<div className="flex items-center justify-between rounded-full border border-gray-200 w-2/3">
				<InputGroup border="1px solid gray.100">
					<InputRightElement
						opacity={isEditable ? "1" : "0.4"}
						children="KSM"
						rounded="full"
						py={8}
						px={12}
						fontSize="xl"
					/>
					<Input
						type="number"
						rounded="full"
						py={8}
						px={8}
						placeholder="0"
						defaultValue={value.currency === 0 ? "" : value.currency}
						onChange={(e) => {
							const { value } = e.target;
							onChange(value === "" ? 0 : Number(value));
						}}
						border="none"
						fontSize="2xl"
						isDisabled={!isEditable}
						backgroundColor={!isEditable && "gray.200"}
					/>
				</InputGroup>
				{/* <div className="flex flex-col ml-6">
			<input
				type="number"
				placeholder="0"
				defaultValue={value.currency === 0 ? "" : value.currency}
				onChange={(e) => {
					const { value } = e.target;
					onChange(value === "" ? 0 : Number(value));
				}}
				className="w-24 text-2xl p-0 outline-none"
			/>
			<h6 className="text-gray-600 text-sm">${value.subCurrency}</h6> 
		</div> */}
				{/* <div className="flex-center">
			<div className="px-5 py-4 rounded-r-full border-l border-gray-200">
				<div className="flex items-center relative text-xl">
					<span>KSM</span>
				</div>
			</div>
		</div> */}
			</div>
			{bonded && (
				<button
					className="mt-4 py-2 px-4 shadow-custom rounded-full text-sm border border-gray-200"
					onClick={() => {
						setIsEditable(!isEditable);
					}}
				>
					{isEditable ? "Use Currently Bonded Amount" : "Use Custom Amount"}
				</button>
			)}
		</div>
	);
};

// TODO: handle `subCurrency` properly
const AmountInputAlreadyBonded = ({ value, bonded, total, onChange }) => (
	<div className="flex flex-col">
		<div className="flex justify-between bg-gray-200 p-3 rounded-xl">
			<div className="flex flex-col ml-4 rounded-lg py-1">
				<span className="text-gray-700 text-sm">Currently Bonded</span>
				<h3 className="text-xl">{bonded.currency} KSM</h3>
				<span hidden className="text-gray-500 text-xs">
					${bonded.subCurrency}
				</span>
			</div>
			<div className="flex flex-col bg-white px-6 rounded-lg py-1">
				<span className="text-gray-700 text-sm">Bond Additional Funds</span>
				<div className="flex">
					<input
						type="number"
						placeholder="0"
						defaultValue={value.currency === 0 ? "" : value.currency}
						className="text-xl outline-none w-24 mr-2"
						onChange={(e) => {
							const { value } = e.target;
							onChange(value === "" ? 0 : Number(value));
						}}
					/>
					<h3 hidden className="text-xl">
						KSM
					</h3>
				</div>
				<span hidden className="text-gray-500 text-xs">
					${value.subCurrency}
				</span>
			</div>
		</div>
		<div className="bg-gray-800 mt-2 p-3 px-6 flex flex-col rounded-xl">
			<span className="text-teal-500 text-sm">Total Staking Amount</span>
			<h3 className="text-xl text-white">{total.currency} KSM</h3>
			<span hidden className="text-gray-500 text-xs">
				${total.subCurrency}
			</span>
		</div>
		<style jsx>{`
			/* hides number input controls */
			input[type="number"]::-webkit-inner-spin-button,
			input[type="number"]::-webkit-outer-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
		`}</style>
	</div>
);

const AmountInput = ({ value, bonded, onChange }) => {
	return (
		<div className="w-4/5">
			{/* {get(bonded, 'currency') ? (
				<AmountInputAlreadyBonded
					value={value}
					bonded={bonded}
					total={{
						currency: Number(((value.currency || 0) + bonded.currency).toFixed(4)),
						subCurrency: Number((value.subCurrency + bonded.subCurrency).toFixed(4)),
					}}
					onChange={onChange}
				/>
			): ( */}
			<AmountInputDefault value={value} onChange={onChange} />
			{/* )} */}
		</div>
	);
};

export default AmountInput;
