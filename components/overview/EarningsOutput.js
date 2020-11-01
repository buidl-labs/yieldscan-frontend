import { Box, FormLabel, Skeleton, Divider } from "@chakra-ui/core";
import axios from "@lib/axios";
import calculateReward from "@lib/calculate-reward";
import {
	useYearlyEarning,
	useMonthlyEarning,
	useDailyEarning,
	useValidatorData,
	useTransaction,
} from "@lib/store";
import { cloneDeep, get, isNil, keyBy, mapValues, set } from "lodash";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Twitter } from "react-feather";

const EarningsOutput = ({
	networkDenom,
	networkUrl,
	inputValue,
	validators,
	networkInfo,
}) => {
	const transactionState = useTransaction();
	const [risk, setRisk] = useState(transactionState.riskPreference || "Medium");
	const [yearlyEarning, setYearlyEarning] = useState();
	// const yearlyEarning = useYearlyEarning((state) => state.yearlyEarning);
	// const setYearlyEarning = useYearlyEarning((state) => state.setYearlyEarning);

	const [monthlyEarning, setMonthlyEarning] = useState();

	const [tweet, setTweet] = useState();

	// const monthlyEarning = useMonthlyEarning((state) => state.monthlyEarning);
	// const setMonthlyEarning = useMonthlyEarning(
	// 	(state) => state.setMonthlyEarning
	// );

	const [dailyEarning, setDailyEarning] = useState();

	const [selectedValidators, setSelectedValidators] = useState();
	const { validatorMap, setValidatorMap } = useValidatorData();

	useEffect(() => {
		if (validatorMap) {
			const selectedValidators = cloneDeep(validatorMap[risk]);
			setSelectedValidators(selectedValidators);
		}
	}, [validatorMap]);

	useEffect(() => {
		if (!validatorMap) {
			setYearlyEarning(null);
			setDailyEarning(null);
			setMonthlyEarning(null);
			setSelectedValidators(null);
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
	}, [networkInfo]);

	useEffect(() => {
		if (yearlyEarning) {
			const msg = `I am earning ${yearlyEarning.yieldPercentage.toFixed(
				2
			)}% APR by investing on the ${
				networkInfo.twitterUrl
			} through @yieldscan. What are you waiting for? \nCheck your expected earnings on https://yieldscan.onrender.com/reward-calculator and share it here.`;
			setTweet("https://twitter.com/intent/tweet?text=" + escape(msg));
		}
	}, [yearlyEarning]);

	console.log(inputValue);
	console.log(inputValue);

	useEffect(() => {
		console.log("hello1");
		if (validators) {
			console.log("hello");
			console.log(validators);
			const selectedValidatorsList = Object.values(validators).filter(
				(v) => !isNil(v)
			);
			console.log("selectedValidatorsList");
			console.log(selectedValidatorsList);
			calculateReward(
				selectedValidatorsList,
				inputValue.currency,
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
				inputValue.currency,
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
				inputValue.currency,
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
		}
	}, [inputValue, validators]);

	console.log("outside");

	console.log("yearlyEarning");
	console.log(yearlyEarning);

	return (
		<Box minW={320} maxW={500}>
			<div>
				<FormLabel fontSize="xs" className="text-gray-700">
					Estimated Earnings
				</FormLabel>
				<h2 className="text-2xl text-gray-700 font-bold">
					{!isNil(yearlyEarning) ? (
						<div className="flex justify-between">
							<CountUp
								end={get(yearlyEarning, "yieldPercentage") || 0}
								duration={0.5}
								decimals={2}
								separator=","
								suffix={`% APR`}
								preserveValue
							/>
							<a
								className="twitter-share-button mt-2"
								href={tweet}
								target="_blank"
							>
								<div className="flex text-tweet">
									<Twitter className="mr-2" size="16px" color="#1DA1F2" />
									Tweet APR
								</div>
							</a>
						</div>
					) : (
						<Skeleton>
							<span>Loading...</span>
						</Skeleton>
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
						<div className="flex">
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
							<Divider orientation="vertical" />
							<p className="text-sm font-medium text-teal-500">
								<CountUp
									end={get(yearlyEarning, "yieldPercentage") || 0}
									duration={0.5}
									decimals={2}
									separator=","
									suffix={`%`}
									preserveValue
								/>
							</p>
						</div>
					</div>
				) : (
					<div className="flex justify-between">
						<Skeleton>
							<span>Loading...</span>
						</Skeleton>
					</div>
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
						<div className="flex">
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
							<Divider orientation="vertical" />
							<p className="text-sm font-medium text-teal-500">
								<CountUp
									end={get(monthlyEarning, "yieldPercentage") || 0}
									duration={0.5}
									decimals={2}
									separator=","
									suffix={`%`}
									preserveValue
								/>
							</p>
						</div>
					</div>
				) : (
					<div className="flex justify-between">
						<Skeleton>
							<span>Loading...</span>
						</Skeleton>
					</div>
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
						<div className="flex">
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
							<Divider orientation="vertical" />
							<p className="text-sm font-medium text-teal-500">
								<CountUp
									end={get(dailyEarning, "yieldPercentage") || 0}
									duration={0.5}
									decimals={2}
									separator=","
									suffix={`%`}
									preserveValue
								/>
							</p>
						</div>
					</div>
				) : (
					<div className="flex justify-between">
						<Skeleton>
							<span>Loading...</span>
						</Skeleton>
					</div>
				)}
			</div>
		</Box>
	);
};

export default EarningsOutput;
