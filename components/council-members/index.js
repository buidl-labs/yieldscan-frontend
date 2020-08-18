import axios from "@lib/axios";
import { Spinner } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import { AlertTriangle } from "react-feather";
import MembersTable from "./MembersTable";

const Tabs = {
	COUNCIL_MEMBERS: 'council-members',
	RUNNER_UPS: 'runner-ups',
};

const CouncilMembers = () => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [membersData, setMembers] = useState([]);
	const [selectedTab, setSelectedTab] = useState(Tabs.COUNCIL_MEMBERS);

	useEffect(() => {
		setError(false);
		axios.get('/council/members').then(({ data }) => {
			setMembers(data);
		}).catch(() => {
			setError(true);
		}).finally(() => {
			setLoading(false);
		});
	}, []);
	
	if (error) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<AlertTriangle size="2rem" className="text-orange-500" />
					<span className="font-semibold text-red-600 text-lg mb-10">Sorry, no data for your account! :(</span>
					<span className="text-sm text-gray-600 mt-5">Try changing the stash account.</span>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<Spinner size="xl" />
					<span className="text-sm text-gray-600 mt-5">Fetching council members...</span>
				</div>
			</div>
		);
	}

	return (
		<div  className="px-10 py-10">
			<div className="flex justify-between">
				<h1 className="text-2xl text-gray-900 font-semibold">{ selectedTab === Tabs.COUNCIL_MEMBERS ? "Council Members" : "Runner ups"}</h1>
				<div className="flex items-center rounded-full border border-gray-200">
					<span
						className={`px-4 py-2 cursor-pointer rounded-full ${selectedTab === Tabs.COUNCIL_MEMBERS ? 'text-white bg-teal-500' : 'text-gray-600'}`}
						onClick={() => setSelectedTab(Tabs.COUNCIL_MEMBERS)}
					>
						Council Members
					</span>
					<span
						className={`px-4 py-2 cursor-pointer  rounded-full ${selectedTab === Tabs.RUNNER_UPS ? 'text-white bg-teal-500' : 'text-gray-600'}`}
						onClick={() => setSelectedTab(Tabs.RUNNER_UPS)}
					>
						Runner Ups
					</span>
				</div>
			</div>
			<MembersTable members={selectedTab === Tabs.COUNCIL_MEMBERS ? membersData.members : membersData.runnersUp} />
		</div>
	);
};

export default CouncilMembers;
