import axios from "@lib/axios";
import { Spinner } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import MembersTable from "./MembersTable";

const Governance = () => {
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get('/council/members').then(({ data }) => {
			setMembers(data.members);
			setLoading(false);
		});
	}, []);
	
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

export default Governance;
