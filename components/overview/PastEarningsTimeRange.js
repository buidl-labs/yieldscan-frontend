import { Select } from "@chakra-ui/core";

const PastEarningsTimeRange = ({ unit, onUnitChange }) => {
	return (
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
			onChange={(ev) => {
				onUnitChange(ev.target.value);
			}}
		>
			<option value="24h">past 24h</option>
			<option value="week">past week</option>
			<option value="all">all time</option>
		</Select>
	);
};

export default PastEarningsTimeRange;
