import { get } from "lodash";

const AmountInputDefault = ({ value, onChange }) => (
	<div className="flex items-center justify-between p-2 py-1 rounded-full border border-gray-300 w-2/3">
		<div className="flex flex-col ml-6">
			<input
				type="number"
				placeholder="0"
				defaultValue={value.currency === 0 ? null : value.currency}
				onChange={e => onChange(Number(e.target.value))}
				className="w-24 text-2xl p-0 outline-none"
			/>
			<h6 className="text-gray-600 text-sm">${value.subCurrency}</h6>
		</div>
		<div className="flex-center">
			<div className="bg-gray-800 px-10 py-3 text-white rounded-full">
				<div className="flex items-center relative">
					<span>KSM</span>
				</div>
			</div>
		</div>
		<style jsx>{`
			/* hides number input controls */
			input[type=number]::-webkit-inner-spin-button, 
			input[type=number]::-webkit-outer-spin-button { 
				-webkit-appearance: none; 
				margin: 0; 
			}
		`}</style>
	</div>
);

// TODO: handle `subCurrency` properly
const AmountInputAlreadyBonded = ({ value, bonded, total, onChange }) => (
	<div className="flex flex-col">
		<div className="flex justify-between bg-gray-200 p-3 rounded-xl">
			<div className="flex flex-col ml-4 rounded-lg py-1">
				<span className="text-gray-700 text-sm">Currently Bonded</span>
				<h3 className="text-xl">{bonded.currency} KSM</h3>
				<span className="text-gray-500 text-xs">${bonded.subCurrency}</span>
			</div>
			<div className="flex flex-col bg-white px-6 rounded-lg py-1">
				<span className="text-gray-700 text-sm">Bond Additional Funds</span>
				<div className="flex">
					<input
						type="number"
						placeholder="0"
						defaultValue={value.currency === 0 ? null : value.currency}
						className="text-xl outline-none w-24 mr-2"
						onChange={e => onChange(Number(e.target.value))}
					/>
					<h3 hidden className="text-xl">KSM</h3>
				</div>
				<span className="text-gray-500 text-xs">${value.subCurrency}</span>
			</div>
		</div>
		<div className="bg-gray-800 mt-2 p-3 px-6 flex flex-col rounded-xl">
			<span className="text-teal-500 text-sm">Total Staking Amount</span>
			<h3 className="text-xl text-white">{total.currency} KSM</h3>
			<span className="text-gray-500 text-xs">${total.subCurrency}</span>
		</div>
		<style jsx>{`
			/* hides number input controls */
			input[type=number]::-webkit-inner-spin-button, 
			input[type=number]::-webkit-outer-spin-button { 
				-webkit-appearance: none; 
				margin: 0; 
			}
		`}</style>
	</div>
);

const AmountInput = ({ value, bonded, onChange }) => {
	return (
		<div className="w-4/5">
			{get(bonded, 'currency') ? (
				<AmountInputAlreadyBonded
					value={value}
					bonded={bonded}
					total={{
						currency: Number(((value.currency || 0) + bonded.currency).toFixed(4)),
						subCurrency: Number((value.subCurrency + bonded.subCurrency).toFixed(4)),
					}}
					onChange={onChange}
				/>
			): (
				<AmountInputDefault
					value={value}
					onChange={onChange}
				/>
			)}
		</div>
	);
};

export default AmountInput;
