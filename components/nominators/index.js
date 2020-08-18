import { Avatar, Spinner } from "@chakra-ui/core";
import Top3Section from "./Top3Section";
import NominationsTable from "./NominatorsTable";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import formatCurrency from "@lib/format-currency";
import convertCurrency from "@lib/convert-currency";

const Nominators = () => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [nominatorsData, setNominatorsData] = useState([]);
	const [
		totalAmountStakedSubCurrency,
		setTotalAmountStakedSubCurrency,
	] = useState();
	const [totalRewardsSubCurrency, setTotalRewardsSubCurrency] = useState();

	useEffect(() => {
		setLoading(true);
		setError(false);
		axios
			.get("/actors/nominators")
			.then(({ data }) => {
				setNominatorsData(data);
			})
			.catch(() => {
				setError(true);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		if (nominatorsData.stats) {
			convertCurrency(nominatorsData.stats.totalAmountStaked).then((value) =>
				setTotalAmountStakedSubCurrency(value)
			);
			convertCurrency(nominatorsData.stats.totalRewards).then((value) =>
				setTotalRewardsSubCurrency(value)
			);
		}
	}, [nominatorsData]);

	if (loading) {
		return (
			<div className="flex-center flex-col mt-40">
				<Spinner className="text-gray-700 mb-2" />
				<span className="text-gray-600 text-sm">Fetching Nominators...</span>
			</div>
		);
	}

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
		<div className="px-10 py-5">
			<h1 className="text-2xl text-gray-800 font-semibold">Nominators</h1>

			<div className="flex w-full">
				<div className="w-3/4">
					<div className="mt-6">
						<p className="text-gray-600 text-xs mb-2 tracking-widest">
							TOP NOMINATORS
						</p>
						<Top3Section nominators={nominatorsData.top3.slice(0, 3)} />
					</div>
					<NominationsTable nominators={nominatorsData.nominatorsInfo} />
				</div>
				<div className="sticky top-0 self-start pt-8 ml-8">
					<div
						className="shadow-xl flex flex-col rounded-lg pt-16 pb-10 pl-10 pr-16 text-white min-w-max-content"
						style={{ background: "#1F495B" }}
					>
						<h1 className="text-4xl">
							{formatCurrency.methods.formatNumber(
								nominatorsData.stats.nominatorsCount
							)}
						</h1>
						<h3 className="text-base">Active Nominators</h3>
					</div>
					<div
						className="shadow-xl flex flex-col rounded-lg my-10 pt-16 pb-10 pl-10 pr-16 text-white min-w-max-content"
						style={{ background: "#1F495B" }}
					>
						<h1 className="text-4xl">
							{formatCurrency.methods.formatNumber(
								Math.trunc(nominatorsData.stats.totalAmountStaked)
							)}{" "}
							<span className="text-xl">KSM</span>
						</h1>
						{totalAmountStakedSubCurrency && (
							<p>
								${" "}
								{formatCurrency.methods.formatNumber(
									totalAmountStakedSubCurrency.toFixed(2)
								)}{" "}
								USD
							</p>
						)}
						<h3 className="text-base">Total Amount Staked</h3>
					</div>
					<div className="shadow-xl flex flex-col rounded-lg pt-16 pb-10 pl-10 pr-16 bg-teal-500 text-white min-w-max-content">
						<h1 className="text-4xl">
							{formatCurrency.methods.formatNumber(
								nominatorsData.stats.totalRewards.toFixed(3)
							)}{" "}
							<span className="text-xl">KSM</span>
						</h1>
						{totalRewardsSubCurrency && (
							<p>
								${" "}
								{formatCurrency.methods.formatNumber(
									totalRewardsSubCurrency.toFixed(2)
								)}{" "}
								USD
							</p>
						)}
						<h3 className="text-base">Total Rewards</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Nominators;
