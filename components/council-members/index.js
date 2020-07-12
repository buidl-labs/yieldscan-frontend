import axios from "@lib/axios";
import { Spinner } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import { AlertTriangle } from "react-feather";
import MembersTable from "./MembersTable";

const CouncilMembers = () => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		setError(false);
		axios.get('/council/members').then(({ data }) => {
			setMembers(data.members);
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
			<h1 className="text-2xl text-gray-600 font-semibold">Council Members</h1>
			<MembersTable members={members} />
		</div>
	);
};

export default CouncilMembers;
