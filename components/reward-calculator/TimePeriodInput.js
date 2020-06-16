import { Select } from "@chakra-ui/core";

const TimePeriodInput = ({ value, unit, onChange, onUnitChange }) => {
	return (
		<div className="flex items-center justify-between p-2 rounded-full border border-gray-300 w-2/3">
			<div className="ml-6">
				<input
					type="number"
					value={value}
					placeholder="0"
					onChange={ev => onChange(ev.target.value)}
					className="w-24 text-2xl p-0 outline-none"
				/>
			</div>
			<div className="flex-center">
				<Select
					backgroundColor="gray.800"
					rounded="full"
					color="white"
					pl="2rem"
					width="8.5rem"
					fontSize="1.125rem"
					cursor="pointer"
					height="3rem"
					value={unit}
					onChange={ev => onUnitChange(ev.target.value)}
				>
					<option value="eras">Eras</option>
					<option value="days">Days</option>
					<option value="months">Months</option>
				</Select>
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
};

export default TimePeriodInput;
