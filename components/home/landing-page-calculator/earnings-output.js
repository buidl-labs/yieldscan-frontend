import { Box, FormLabel } from "@chakra-ui/core";

const EarningsOutput = () => {
    return (
			<Box minW={320} maxW={500}>
				<div>
					<FormLabel fontSize="xs" className="text-gray-700">
						You could be earning
					</FormLabel>
					<h2 className="text-2xl text-gray-700 font-bold">29.88% APR</h2>
				</div>
				<div>
					<FormLabel fontSize="xs" className="text-gray-700" mt={8}>
						Yearly Earning
					</FormLabel>
					<div className="flex justify-between">
						<p className="text-sm text-gray-600">25.000 KSM</p>
						<p className="text-sm font-medium text-teal-500">$857.00</p>
					</div>
				</div>
				<div>
					<FormLabel fontSize="xs" className="text-gray-700" mt={6}>
						Monthly Earning
					</FormLabel>
					<div className="flex justify-between">
						<p className="text-sm text-gray-600">25.000 KSM</p>
						<p className="text-sm font-medium text-teal-500">$857.00</p>
					</div>
				</div>
				<div>
					<FormLabel fontSize="xs" className="text-gray-700" mt={6}>
						Daily Earning
					</FormLabel>
					<div className="flex justify-between">
						<p className="text-sm text-gray-600">25.000 KSM</p>
						<p className="text-sm font-medium text-teal-500">$857.00</p>
					</div>
				</div>
			</Box>
		);
}

export default EarningsOutput;