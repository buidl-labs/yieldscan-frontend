import { InputGroup, Input, InputRightElement } from "@chakra-ui/core";
import formatCurrency from "@lib/format-currency";
import { useAccounts } from "@lib/store";
import { get } from "lodash";
import { useState, useEffect } from "react";

const AmountInputDefault = ({ bonded, type, value, onChange, networkInfo }) => {
	const { freeAmount, stashAccount } = useAccounts();
	const [inputValue, setInputValue] = useState(value.currency);
	const maxAmount =
		type === "bond"
			? get(freeAmount, "currency") - networkInfo.minAmount < 0
				? 0
				: get(freeAmount, "currency") - networkInfo.minAmount
			: bonded;

	// useEffect(() => {
	// 	if (bonded) {
	// 		onChange(bonded);
	// 		setInputValue(Number(Math.max(bonded, 0)));
	// 	}
	// }, [bonded]);

	const handleChange = (value) => {
		onChange(Number(value));
		setInputValue(value);
	};

	return (
		<InputGroup className="rounded-full">
			<Input
				type="number"
				rounded="full"
				autoFocus={true}
				pt={6}
				pb={10}
				px={4}
				pr={inputValue === maxAmount ? 8 : 24}
				textOverflow="ellipsis"
				placeholder={0}
				value={inputValue}
				onChange={(e) => {
					const { value } = e.target;
					handleChange(value);
				}}
				border="none"
				fontSize="lg"
				color="gray.600"
			/>
			<h6
				className={`absolute z-20 bottom-0 left-0 ml-4 mb-3 text-xs text-gray-600 cursor-not-allowed opacity-1"
				}`}
			>
				${formatCurrency.methods.formatNumber(value.subCurrency.toFixed(2))}
			</h6>
			<InputRightElement
				opacity="1"
				children={
					<span className="flex min-w-fit-content">
						{inputValue !== maxAmount && (
							<button
								className="bg-teal-200 text-teal-500 rounded-full text-xs px-2"
								onClick={() => {
									handleChange(maxAmount);
								}}
							>
								max
							</button>
						)}
						<span className="ml-2 text-sm font-medium cursor-not-allowed text-gray-700">
							{networkInfo.denom}
						</span>
					</span>
				}
				h="full"
				rounded="full"
				fontSize="xl"
				w="fit-content"
				px={4}
			/>
		</InputGroup>
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
						className="outline-none w-24 mr-2"
						onChange={(e) => {
							const { value } = e.target;
							onChange(value === "" ? 0 : Number(value));
						}}
					/>
					<h3 hidden className="">
						KSM
					</h3>
				</div>
				<span hidden className="text-gray-500">
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

const AmountInput = ({ value, bonded, type, networkInfo, onChange }) => {
	return (
		<AmountInputDefault
			value={value}
			bonded={bonded}
			type={type}
			onChange={onChange}
			networkInfo={networkInfo}
		/>
	);
};

export default AmountInput;
