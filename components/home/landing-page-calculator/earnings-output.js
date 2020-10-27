import { Box, FormLabel } from "@chakra-ui/core";
import CountUp from "react-countup";

const EarningsOutput = ({ networkDenom }) => {
	return (
		<Box minW={320} maxW={500}>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700">
					You could be earning
				</FormLabel>
				<h2 className="text-2xl text-gray-700 font-bold">
					<CountUp
						end={29.88}
						duration={0.5}
						decimals={2}
						separator=","
						suffix={`% APR`}
						preserveValue
					/>
				</h2>
			</div>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700" mt={8}>
					Yearly Earning
				</FormLabel>
				<div className="flex justify-between">
					<p className="text-sm text-gray-600">
						<CountUp
							end={25}
							duration={0.5}
							decimals={3}
							separator=","
							suffix={` ${networkDenom}`}
							preserveValue
						/>
					</p>
					<p className="text-sm font-medium text-teal-500">
						<CountUp
							end={857.0}
							duration={0.5}
							decimals={2}
							separator=","
							prefix={`$`}
							preserveValue
						/>
					</p>
				</div>
			</div>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700" mt={6}>
					Monthly Earning
				</FormLabel>
				<div className="flex justify-between">
					<p className="text-sm text-gray-600">
						<CountUp
							end={25}
							duration={0.5}
							decimals={3}
							separator=","
							suffix={` ${networkDenom}`}
							preserveValue
						/>
					</p>
					<p className="text-sm font-medium text-teal-500">
						<CountUp
							end={857.0}
							duration={0.5}
							decimals={2}
							separator=","
							prefix={`$`}
							preserveValue
						/>
					</p>
				</div>
			</div>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700" mt={6}>
					Daily Earning
				</FormLabel>
				<div className="flex justify-between">
					<p className="text-sm text-gray-600">
						<CountUp
							end={25}
							duration={0.5}
							decimals={3}
							separator=","
							suffix={` ${networkDenom}`}
							preserveValue
						/>
					</p>
					<p className="text-sm font-medium text-teal-500">
						<CountUp
							end={857.0}
							duration={0.5}
							decimals={2}
							separator=","
							prefix={`$`}
							preserveValue
						/>
					</p>
				</div>
			</div>
		</Box>
	);
};

export default EarningsOutput;
