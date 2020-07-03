import { useRouter } from "next/router";
import { Twitter, Link, ChevronRight } from "react-feather";
import { useState } from "react";
import { Avatar, AvatarGroup } from "@chakra-ui/core";

const ProfileTabs = {
	ACTIVITY: 'Activity',
	VISUALISATION: 'Visualisation',
	TEAM: 'Team',
};

const ValidatorProfile = () => {
	const router = useRouter();
	const [selectedTab, setSelectedTab] = useState(ProfileTabs.ACTIVITY);
	console.log(router.query);

	return (
		<div className="px-16 py-16">
			<div className="flex">
				<img src="http://placehold.it/300" className="w-24 h-24 mr-5 rounded-full" />
				<div className="flex flex-col">
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-2xl text-gray-700 font-semibold">Validator Name</h3>
						<div className="flex items-center">
							<button className="mr-4 text-sm flex items-center hover:underline" style={{ color: '#1DA1F2' }}>
								<Twitter className="mr-1 mt-px" size="1rem" />
								<span>@akshatbhargava123</span>
							</button>
							<button className="text-sm flex items-center hover:underline">
								<Link className="mr-1 mt-px" size="1rem" />
								<span>www.staking.com</span>
							</button>
						</div>
					</div>
					<p className="text-gray-500 text-sm mb-2">
						Staked runs the most reliable and secure validation services for crypto investors. The smartest investors in crypto choose Staked because of our secure technology and offerings that encompass the most proof-of-stake chains.
					</p>
					<div>
						<button className="flex items-center text-xs text-gray-700 hover:underline">
							<span>Own this profile? Connect Wallet now to verify</span>
							<ChevronRight size="1rem" className="text-gray-700" />
						</button>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between my-5">
				<div className="flex items-center">
					{Object.entries(ProfileTabs).map(([key, value]) => (
						<button
							className={`
								mx-3 px-1 py-3 transition duration-500 focus:outline-none
								${selectedTab === value ? 'border-b-2 border-teal-500 text-gray-900 font-semibold' : 'text-gray-700'}
							`}
							onClick={() => setSelectedTab(value)}
						>
							<span>{value}</span>
						</button>
					))}
				</div>
				<div className="flex items-center">
					<span className="text-gray-700 text-xs mr-2 font-semibold">LINKED VALIDATORS</span>
					<AvatarGroup size="md" max={3}>
						<Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
						<Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
						<Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
						<Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
						<Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
					</AvatarGroup>
				</div>
			</div>
		</div>
	);
};

export default ValidatorProfile;
