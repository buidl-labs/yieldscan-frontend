import React from "react";
import { Spinner } from "@chakra-ui/core";
import axios from "@lib/axios";
import convertCurrency from "@lib/convert-currency";
import formatCurrency from "@lib/format-currency";
import millify from "millify";
import Link from "next/link";

const StatCard = ({ stat, description, subText }) => {
	return (
		<div className="mb-8 items-center flex flex-col py-8 w-64 xl:w-3/12 pb-10 border border-gray-100 rounded-xl mx-2 bg-gray-100">
			<h2 className="text-3xl font-semibold text-gray-700">{stat}</h2>
			<p className="mb-4 text-sm text-gray-700">{description}</p>
			{subText}
		</div>
	);
};

const SocialProofStats = ({ networkName, networkDenom, networkUrl }) => {
	const [error, setError] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	const [nominatorsData, setNominatorsData] = React.useState([]);
	const [
		totalAmountStakedSubCurrency,
		setTotalAmountStakedSubCurrency,
	] = React.useState();
	const [
		totalRewardsSubCurrency,
		setTotalRewardsSubCurrency,
	] = React.useState();

	React.useEffect(() => {
		setLoading(true);
		setError(false);
		axios
			.get(`/${networkUrl}/actors/nominator/stats`)
			.then(({ data }) => {
				setNominatorsData(data);
			})
			.catch(() => {
				setError(true);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [networkUrl]);

	React.useEffect(() => {
		if (nominatorsData.stats) {
			convertCurrency(
				nominatorsData.stats.totalAmountStaked,
				networkDenom
			).then((value) => setTotalAmountStakedSubCurrency(value));
			convertCurrency(
				nominatorsData.stats.totalRewards,
				networkDenom
			).then((value) => setTotalRewardsSubCurrency(value));
		}
	}, [nominatorsData, networkDenom]);

	if (error) {
		return (
			<div className="flex-center flex-col mt-40">
				<div className="text-4xl">🧐</div>
				<h3>
					Sorry, something went wrong while fetching! We'll surely look into
					this.
				</h3>
			</div>
		);
	}
	return (
		<div className="flex w-full max-w-65-rem mt-32 flex-wrap justify-between">
			<StatCard
				stat={
					loading || isNaN(totalAmountStakedSubCurrency) ? (
						<Spinner />
					) : (
						`$ ${millify(totalAmountStakedSubCurrency)}+`
					)
				}
				description={`Invested in staking on ${networkName}`}
				subText={
					<div className="flex items-center">
						<div className="blob red h-fit-content">
							<div className="pulse-box"></div>
						</div>
						<p className="text-gray-700 text-xs ml-2">Live</p>
					</div>
				}
			/>
			<StatCard
				stat={
					loading || isNaN(nominatorsData.stats.nominatorsCount) ? (
						<Spinner />
					) : (
						formatCurrency.methods.formatNumber(
							Math.floor(nominatorsData.stats.nominatorsCount / 100) * 100
						) + "+"
					)
				}
				description="Active nominators"
				subText={
					<Link href="/nominators">
						<a className="text-gray-700 text-xs underline">View nominators</a>
					</Link>
				}
			/>
			<StatCard
				stat={
					loading || isNaN(totalRewardsSubCurrency) ? (
						<Spinner />
					) : (
						`$ ${millify(totalRewardsSubCurrency)}+`
					)
				}
				description="Earned as staking rewards"
				subText={<p className="text-gray-700 text-xs">In the past 24 hrs</p>}
			/>
		</div>
	);
};

export default SocialProofStats;
