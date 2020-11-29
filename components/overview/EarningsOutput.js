import {
	Box,
	FormLabel,
	Skeleton,
	Divider,
	Image,
	Alert,
	AlertDescription,
} from "@chakra-ui/core";
import axios from "@lib/axios";
import calculateReward from "@lib/calculate-reward";
import getRewards from "@lib/getRewards";
import getClaimableRewards from "@lib/getClaimableRewards";
import formatCurrency from "@lib/format-currency";
import {
	useYearlyEarning,
	useMonthlyEarning,
	useDailyEarning,
	useValidatorData,
	useTransaction,
	useTransactionHash,
} from "@lib/store";
import { cloneDeep, get, isNil, keyBy, mapValues, set } from "lodash";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Twitter } from "react-feather";
import convertCurrency from "@lib/convert-currency";
import getErasHistoric from "@lib/getErasHistoric";
import ProgressiveImage from "react-progressive-image";

const EarningsOutput = ({
	networkDenom,
	networkUrl,
	inputValue,
	apiInstance,
	validators,
	address,
	networkInfo,
}) => {
	const transactionState = useTransaction();
	const [risk, setRisk] = useState(transactionState.riskPreference || "Medium");
	const [yearlyEarning, setYearlyEarning] = useState();
	const [totalEarnings, setTotalEarnings] = useState();
	const { transactionHash } = useTransactionHash();
	// const yearlyEarning = useYearlyEarning((state) => state.yearlyEarning);
	// const setYearlyEarning = useYearlyEarning((state) => state.setYearlyEarning);

	const [monthlyEarning, setMonthlyEarning] = useState();

	const [tweet, setTweet] = useState();
	const [claimableRewards, setClaimableRewards] = useState();
	const [erasHistoric, setErasHistoric] = useState();

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
		if (!totalEarnings) {
			getRewards(address, networkInfo).then((data) => {
				const total = data.reduce((a, b) => a + parseInt(b.amount), 0);
				convertCurrency(
					total / Math.pow(10, networkInfo.decimalPlaces),
					networkInfo.denom
				)
					.then((value) =>
						setTotalEarnings({
							currency: total,
							subCurrency: value,
						})
					)
					.catch((err) => {
						console.error(err);
					});
			});
		}
	}, [networkInfo]);

	// useEffect(() => {
	// 	if (!erasHistoric && address) {
	// 		getErasHistoric(apiInstance, setErasHistoric);
	// 	}
	// }, [networkInfo, address]);
	// useEffect(() => {
	// 	if (!claimableRewards && erasHistoric && address) {
	// 		getClaimableRewards(
	// 			address,
	// 			networkInfo,
	// 			apiInstance,
	// 			erasHistoric,
	// 			setClaimableRewards
	// 		);
	// 	}
	// }, [networkInfo, erasHistoric, address]);

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

	useEffect(() => {
		if (validators) {
			const selectedValidatorsList = Object.values(validators).filter(
				(v) => !isNil(v)
			);
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

	return (
		<Box minW={320} w="full">
			<div className="flex">
				<ProgressiveImage
					src="/images/dollar-sign.svg"
					placeholder="/images/dollar-sign.jpg"
				>
					{(src) => (
						<img src={src} alt="dollar-sign" width="32px" height="32px" />
					)}
				</ProgressiveImage>
				<p className="font-semibold text-base text-gray-700 ml-2 mt-1">
					Earnings
				</p>
			</div>
			{false && (
				<div className="bg-gray-100 rounded-lg mt-4 py-4 px-8">
					<FormLabel fontSize="sm" className="font-medium text-gray-700">
						Claimable Earnings
					</FormLabel>
					<h2 className="text-xl text-gray-700 font-bold">
						{!isNil(totalEarnings) ? (
							<>
								<div className="flex justify-between">
									{formatCurrency.methods.formatAmount(
										Math.trunc(totalEarnings.currency),
										networkInfo
									)}
								</div>
								<div className="text-sm font-medium text-teal-500">
									$
									{formatCurrency.methods.formatNumber(
										totalEarnings.subCurrency.toFixed(2)
									)}
								</div>
							</>
						) : (
							<Skeleton>
								<span>Loading...</span>
							</Skeleton>
						)}
					</h2>
				</div>
			)}
			<div className="mt-4">
				<FormLabel fontSize="sm" className="font-medium text-gray-700">
					7 day earnings
				</FormLabel>
				<h2
					className={`${
						validators.length !== 0 ? "text-gray-700" : "text-light-gray"
					} font-bold`}
				>
					{!isNil(totalEarnings) ? (
						<>
							<div className="text-xl justify-between text">
								{formatCurrency.methods.formatAmount(
									Math.trunc(totalEarnings.currency),
									networkInfo
								)}
							</div>
							<div className="text-sm font-medium text-teal-500">
								$
								{formatCurrency.methods.formatNumber(
									totalEarnings.subCurrency.toFixed(2)
								)}
							</div>
						</>
					) : (
						<Skeleton>
							<span>Loading...</span>
						</Skeleton>
					)}
				</h2>
			</div>
			{transactionHash && (
				<div className="mt-4 flex">
					<Alert
						status="warning"
						color="#FDB808"
						backgroundColor="#FFF4DA"
						borderRadius="8px"
					>
						<AlertDescription color="#FDB808" fontSize="12px">
							<p>
								Your staking investment will start earning returns in
								approximately {(2 * 24) / networkInfo.erasPerDay} hours.
							</p>
							<p className="mt-4">
								We recommend bookmarking this tab and checking back soon.
							</p>
						</AlertDescription>
					</Alert>
				</div>
			)}
			<div className="mt-8">
				<FormLabel fontSize="sm" className="font-medium text-gray-700">
					Estimated Earnings
				</FormLabel>
				<h2 className="text-xl text-gray-700 font-bold">
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
								className="twitter-share-button mt-2 flex text-sm font-medium justify-center items-center"
								style={{ color: "#1DA1F2" }}
								href={tweet}
								target="_blank"
							>
								<Twitter
									className="mr-2"
									size="16px"
									color="#1DA1F2"
									strokeWidth="2.5"
								/>
								<p className="mb-1">Tweet APR</p>
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
					Yearly
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
							<p className="text-sm font-medium text-teal-500 mr-2">
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
							<p className="text-sm text-gray-600 w-12 text-right">
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
					Monthly
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
							<p className="text-sm font-medium text-teal-500 mr-2">
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
							<p className="text-sm text-gray-600 w-12 text-right">
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
					Daily
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
							<p className="text-sm font-medium text-teal-500 mr-2">
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
							<p className="text-sm text-gray-600 w-12 text-right">
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
