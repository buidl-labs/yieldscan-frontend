import { Box, FormLabel } from "@chakra-ui/core";
import axios from "@lib/axios";
import calculateReward from "@lib/calculate-reward";
import { useTransaction, useValidatorData } from "@lib/store";
import { get, isNil, keyBy, mapValues } from "lodash";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const EarningsOutput = ({
	networkDenom,
	networkUrl,
	inputValue,
	networkInfo,
}) => {
    const [yearlyEarning, setYearlyEarning] = useState({});
    const [monthlyEarning, setMonthlyEarning] = useState({});
    const [dailyEarning, setDailyEarning] = useState({});

	const { validatorMap, setValidatorMap } = useValidatorData();
	const [selectedValidators, setSelectedValidators] = useState({});

	useEffect(() => {
		if (!validatorMap) {
			axios.get(`/${networkUrl}/rewards/risk-set`).then(({ data }) => {
				/**
				 * `mapValues(keyBy(array), 'value-key')`:
				 * 	O(N + N) operation, using since each risk set will have maximum 16 validators
				 */
				const validatorMap = {
					Low: mapValues(keyBy(data.lowriskset, "stashId")),
					Medium: mapValues(keyBy(data.medriskset, "stashId")),
					High: mapValues(keyBy(data.highriskset, "stashId")),
					total: data.totalset,
				};

				setValidatorMap(validatorMap);
				setSelectedValidators(validatorMap["Medium"]);
			});
		} else {
			console.info("Using previous validator map.");
		}
	}, [networkUrl, validatorMap]);

	useEffect(() => {
		const selectedValidatorsList = Object.values(selectedValidators).filter(
			(v) => !isNil(v)
		);
		calculateReward(
			selectedValidatorsList,
			inputValue,
			12,
			"months",
			true,
			networkInfo
		)
			.then((result) => {
                setYearlyEarning(result);
			})
			.catch((error) => {
				// TODO: handle error gracefully with UI toast
				alert(error);
			});
		calculateReward(
			selectedValidatorsList,
			inputValue,
			1,
			"months",
			true,
			networkInfo
		)
			.then((result) => {
				setMonthlyEarning(result);
			})
			.catch((error) => {
				// TODO: handle error gracefully with UI toast
				alert(error);
			});
		calculateReward(
			selectedValidatorsList,
			inputValue,
			1,
			"days",
			true,
			networkInfo
		)
			.then((result) => {
				setDailyEarning(result);
			})
			.catch((error) => {
				// TODO: handle error gracefully with UI toast
				alert(error);
			});
	}, [inputValue, selectedValidators, networkInfo]);

	return (
		<Box minW={320} maxW={500}>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700">
					You could be earning
				</FormLabel>
				<h2 className="text-2xl text-gray-700 font-bold">
					<CountUp
						end={get(yearlyEarning, "yieldPercentage") || 0}
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
							end={get(yearlyEarning, "returns.currency") || 0}
							duration={0.5}
							decimals={3}
							separator=","
							suffix={` ${networkDenom}`}
							preserveValue
						/>
					</p>
					<p className="text-sm font-medium text-teal-500">
						<CountUp
							end={get(yearlyEarning, "returns.subCurrency") || 0}
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
							end={get(monthlyEarning, "returns.currency") || 0}
							duration={0.5}
							decimals={3}
							separator=","
							suffix={` ${networkDenom}`}
							preserveValue
						/>
					</p>
					<p className="text-sm font-medium text-teal-500">
						<CountUp
							end={get(monthlyEarning, "returns.subCurrency") || 0}
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
							end={get(dailyEarning, "returns.currency") || 0}
							duration={0.5}
							decimals={3}
							separator=","
							suffix={` ${networkDenom}`}
							preserveValue
						/>
					</p>
					<p className="text-sm font-medium text-teal-500">
						<CountUp
							end={get(dailyEarning, "returns.subCurrency") || 0}
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
