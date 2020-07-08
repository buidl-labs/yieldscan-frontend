import { Avatar } from "@chakra-ui/core";
import { Twitter } from "react-feather";

const TeamMembers = ({ members = [] }) => {
	return (
		<div>
			{members.length ? (
				<div className="p-4 flex flex-wrap">
					{members.map((member, index) => (
						<div
							key={index}
							onClick={() => window.open(`https://twitter.com/${member.twitter.slice(1)}`, '_blank')}
							className="m-2 w-48 h-56 p-5 cursor-pointer rounded-lg border border-gray-300 flex-center flex-col"
						>
							<Avatar mb="1rem" />
							<h3 className="text text-gray-900 mb-1">{member.member}</h3>
							<Twitter
								size="1rem"
								className="text-gray-500"
								strokeWidth="3px"
							/>
						</div>
					))}
				</div>
			) : (
				<div className="flex-center">
					<h1 className="text-2xl font-thin">No Members.</h1>
				</div>
			)}
		</div>
	);
};

export default TeamMembers;
