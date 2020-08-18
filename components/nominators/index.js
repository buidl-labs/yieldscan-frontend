import { Avatar, Spinner } from "@chakra-ui/core";
import Top3Section from "./Top3Section";
import NominationsTable from "./NominatorsTable";
import { useEffect, useState } from "react";
import axios from "@lib/axios";

const Nominators = () => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [nominatorsData, setNominatorsData] = useState([]);

	useEffect(() => {
		setLoading(true);
		setError(false);
		axios.get('/actors/nominators').then(({ data }) => {
			setNominatorsData(data);
		}).catch(() => {
			setError(true);
		}).finally(() => {
			setLoading(false);
		});
	}, []);
	
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
				<h3>Sorry, something went wrong while fetching! We'll surely look into this.</h3>
			</div>
		);
	}

	return (
		<div className="px-10 py-5">
			<h1 className="text-2xl text-gray-800 font-semibold">Nominators</h1>

			<div className="flex w-full">
				<div className="w-2/3">
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
						className="shadow-xl flex flex-col rounded-lg pt-16 pb-10 px-12 text-white"
						style={{ background: "#1F495B" }}
					>
						<h1 className="text-4xl">{nominatorsData.stats.nominatorsCount}</h1>
						<h3 className="text-lg">Active Nominators</h3>
					</div>
					<div
						className="shadow-xl flex flex-col rounded-lg my-10 pt-16 pb-10 px-12 text-white"
						style={{ background: "#1F495B" }}
					>
						<h1 className="text-4xl">
							{Math.trunc(nominatorsData.stats.totalAmountStaked)} KSM
						</h1>
						<h3 className="text-lg">Total Amount Staked</h3>
					</div>
					<div className="shadow-xl flex flex-col rounded-lg pt-16 pb-10 px-12 bg-teal-500 text-white">
						<h1 className="text-4xl">
							{Math.trunc(nominatorsData.stats.totalRewards)} KSM
						</h1>
						<h3 className="text-lg">Total Rewards</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Nominators;
