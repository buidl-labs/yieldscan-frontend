import { Box, FormLabel } from "@chakra-ui/core";
import axios from "@lib/axios";
import calculateReward from "@lib/calculate-reward";
import {
	useYearlyEarning,
	useMonthlyEarning,
	useDailyEarning,
	useValidatorData,
    useTransaction,
} from "@lib/store";
import { cloneDeep, get, isNil, keyBy, mapValues } from "lodash";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const EarningsOutput = ({
	networkDenom,
	networkUrl,
	inputValue,
	networkInfo,
}) => {
    const transactionState = useTransaction();
	const [risk, setRisk] = useState(transactionState.riskPreference || "Medium");
	const yearlyEarning = useYearlyEarning((state) => state.yearlyEarning);
	const setYearlyEarning = useYearlyEarning((state) => state.setYearlyEarning);

	const monthlyEarning = useMonthlyEarning((state) => state.monthlyEarning);
	const setMonthlyEarning = useMonthlyEarning(
		(state) => state.setMonthlyEarning
	);

	const dailyEarning = useDailyEarning((state) => state.dailyEarning);
	const setDailyEarning = useDailyEarning((state) => state.setDailyEarning);

	const [selectedValidators, setSelectedValidators] = useState({});
	const { validatorMap, setValidatorMap } = useValidatorData();

	useEffect(() => {
		if (get(validatorMap, risk)) {
			const selectedValidators = cloneDeep(validatorMap[risk]);
			setSelectedValidators(selectedValidators);
		}
	}, [validatorMap, risk, setSelectedValidators]);

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
					{!isNil(yearlyEarning) ? (
						<CountUp
							end={get(yearlyEarning, "yieldPercentage") || 0}
							duration={0.5}
							decimals={2}
							separator=","
							suffix={`% APR`}
							preserveValue
						/>
					) : (
						"Loading..."
					)}
				</h2>
			</div>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700" mt={8}>
					Yearly Earning
				</FormLabel>
				{!isNil(yearlyEarning) ? (
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
				) : (
					<p>Loading...</p>
				)}
			</div>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700" mt={6}>
					Monthly Earning
				</FormLabel>
				{!isNil(monthlyEarning) ? (
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
				) : (
					<p>Loading...</p>
				)}
			</div>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700" mt={6}>
					Daily Earning
				</FormLabel>
				{!isNil(dailyEarning) ? (
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
				) : (
					<p>Loading...</p>
				)}
			</div>
		</Box>
	);
};

export default EarningsOutput;
