import { Avatar } from "@chakra-ui/core";
import { Twitter } from "react-feather";

const TeamMembers = ({ members }) => {
	return (
		<div className="p-4 flex flex-wrap">
			{[1,2,3,4].map(member => (
				<div key={member} className="m-2 w-48 h-56 p-5 rounded-lg border border-gray-300 flex-center flex-col">
					<Avatar mb="1rem" />
					<h3 className="text text-gray-900">Member Name</h3>
					<span className="text-sm text-gray-600 mb-2">Member Role</span>
					<Twitter size="1rem" className="text-gray-500 cursor-pointer" strokeWidth="3px" />
				</div>
			))}
		</div>
	);
};

export default TeamMembers;
