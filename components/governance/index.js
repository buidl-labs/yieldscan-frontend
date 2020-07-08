import { useState, useEffect } from "react";
import MembersTable from "./MembersTable";
import axios from "@lib/axios";

const Governance = () => {
	const [members, setMembers] = useState([]);

	useEffect(() => {
		axios.get('/council/members').then(({ data }) => {
			setMembers(data.members);
		});
	}, []);
	
	return (
		<div  className="px-10 py-10">
			<h1 className="text-2xl text-gray-600 font-semibold">Council Members</h1>
			<MembersTable members={members} />
		</div>
	);
};

export default Governance;
