import { Select, Input, InputRightElement, InputGroup } from "@chakra-ui/core";

const TimePeriodInput = ({ value, unit, onChange, onUnitChange }) => {
	return (
		<div className="flex items-center justify-between w-2/3">
			<InputGroup className="border border-gray-200 rounded-full">
				<InputRightElement
					children={
						<Select
							backgroundColor="gray.50"
							rounded="full"
							pl={4}
							pr={6}
							width="full"
							fontSize="xs"
							cursor="pointer"
							height="1.75rem"
							border="none"
							iconSize="0.75rem"
							color="gray.600"
							value={unit}
							onChange={(ev) => onUnitChange(ev.target.value)}
						>
							<option value="eras">eras</option>
							<option value="days">days</option>
							<option value="months">months</option>
						</Select>
					}
					width="fit-content"
					rounded="full"
					py={4}
					px={2}
					fontSize="sm"
				/>
				<Input
					type="number"
					color="gray.600"
					rounded="full"
					py={4}
					px={4}
					placeholder="0"
					defaultValue={value === 0 ? null : value}
					onChange={(ev) => onChange(Number(ev.target.value))}
					border="none"
					fontSize="lg"
				/>
			</InputGroup>
			{/* <div className="ml-6">
				<input
					type="number"
					placeholder="0"
					defaultValue={value === 0 ? null : value}
					onChange={ev => onChange(Number(ev.target.value))}
					className="w-24 text-2xl p-0 outline-none"
				/>
			</div>
			<div className="flex-center">
				<Select
					backgroundColor="gray.100"
					rounded="full"
					pl="2rem"
					width="8.5rem"
					fontSize="1.125rem"
					cursor="pointer"
					height="3rem"
					border="none"
					value={unit}
					onChange={ev => onUnitChange(ev.target.value)}
				>
					<option value="eras">eras</option>
					<option value="days">days</option>
					<option value="months">months</option>
				</Select>
			</div> */}
		</div>
	);
};

export default TimePeriodInput;
