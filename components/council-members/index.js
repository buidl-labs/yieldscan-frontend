import axios from "@lib/axios";
import { Spinner } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import { AlertTriangle } from "react-feather";
import { useCouncil, useSelectedNetwork } from "@lib/store";
import MembersTable from "./MembersTable";
import { getNetworkInfo } from "yieldscan.config";

const Tabs = {
	COUNCIL_MEMBERS: "council-members",
	RUNNER_UPS: "runner-ups",
};

const CouncilMembers = () => {
	const [error, setError] = useState(false);
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const {
		councilMembers,
		setCouncilMembers,
		councilLoading,
		setCouncilLoading,
	} = useCouncil();
	const [selectedTab, setSelectedTab] = useState(Tabs.COUNCIL_MEMBERS);

	// useEffect(() => {
	// 	if (!councilMembers) {
	// 		setError(false);
	// 		axios
	// 			.get(`/${networkInfo.coinGeckoDenom}/council/members`)
	// 			.then(({ data }) => {
	// 				setCouncilMembers(data);
	// 			})
	// 			.catch(() => {
	// 				setError(true);
	// 			})
	// 			.finally(() => {
	// 				setLoading(false);
	// 			});
	// 	} else {
	// 		setLoading(true);
	// 	}
	// }, []);

	useEffect(() => {
		if (!councilMembers) {
			// setCouncilLoading(true);
			setError(false);
			axios
				.get(`/${networkInfo.coinGeckoDenom}/council/members`)
				.then(({ data }) => {
					setCouncilMembers(data);
				})
				.catch(() => {
					setError(true);
				})
				.finally(() => {
					setCouncilLoading(false);
				});
		}
	}, [councilMembers, networkInfo]);

	if (error) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<AlertTriangle size="2rem" className="text-orange-500" />
					<span className="font-semibold text-red-600 text-lg mb-10">
						Sorry, no data for your account! :(
					</span>
					<span className="text-sm text-gray-600 mt-5">
						Try changing the stash account.
					</span>
				</div>
			</div>
		);
	}

	if (councilLoading) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<Spinner size="xl" color="teal.500" thickness="4px" />
					<span className="text-sm text-gray-600 mt-5">
						Fetching council members...
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="px-10 py-10">
			<div className="flex justify-between">
				<h1 className="text-2xl text-gray-900 font-semibold">
					{selectedTab === Tabs.COUNCIL_MEMBERS
						? "Council Members"
						: "Runner ups"}
				</h1>
				<div className="flex items-center rounded-full border border-gray-200">
					<span
						className={`px-4 py-2 cursor-pointer rounded-full ${
							selectedTab === Tabs.COUNCIL_MEMBERS
								? "text-white bg-teal-500"
								: "text-gray-600"
						}`}
						onClick={() => setSelectedTab(Tabs.COUNCIL_MEMBERS)}
					>
						Council Members
					</span>
					<span
						className={`px-4 py-2 cursor-pointer  rounded-full ${
							selectedTab === Tabs.RUNNER_UPS
								? "text-white bg-teal-500"
								: "text-gray-600"
						}`}
						onClick={() => setSelectedTab(Tabs.RUNNER_UPS)}
					>
						Runner Ups
					</span>
				</div>
			</div>
			<MembersTable
				members={
					selectedTab === Tabs.COUNCIL_MEMBERS
						? councilMembers.members
						: councilMembers.runnersUp
				}
				networkInfo={networkInfo}
			/>
		</div>
	);
};

export default CouncilMembers;
