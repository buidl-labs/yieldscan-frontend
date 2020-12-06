import { Avatar, Box } from "@chakra-ui/core";
import axios from "@lib/axios";
import { times } from "lodash";
import { useEffect, useState } from "react";
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider";

const testimonialData = [
	{
		name: "Chris Hutchinson",
		avatar: "/images/chris-hutchinson.png",
		designation: "Head of Global Community, Web3 Foundation",
		comment:
			"Yieldscan has a very intuitive approach making it easy to select which validators to nominate with. Making staking simple for new users is a big deal, this tool does just that.",
	},
	{
		name: "Ruben Russel",
		avatar: "/images/ruben-russel.png",
		designation:
			"Co-founder, Caribbean Blockchain Network & former PolkaDAO community manager",
		comment:
			"Yieldscan is a powerful Polkadot & Kusama analytical tool, assisting its user to make valuable calculated decisions when staking your KSM or DOT tokens. It is easy, useful and fun!",
	},
	{
		name: "Baroque",
		avatar: "/images/baroque.png",
		designation: "Polkadot & Kusama community member",
		comment:
			"The yield calculator to optimise risk to reward on staking is superb. Ultimately yieldscan has value and provides great utility for stakers and nominators.",
	},
	{
		name: "Enea Arllai",
		avatar: "/images/enea-arllai.jpg",
		designation: "Polkadot & Kusama community member",
		comment:
			"As a novice in the Polkadot and Kusama ecosystems, it can be an extremely daunting introduction to the new world of parachains and relay chains, epoch periods, choosing validators, working the substrate portal, learning new terminology etc. Yieldscan brings state-of-the-art analytics to take the pressure off some of the Staking confusion and makes the general user’s experience one to remember!",
	},
	{
		name: "Dave Ramico",
		avatar: "/images/dave-ramico.jpg",
		designation: "PolkaDAO member",
		comment:
			"Yieldscan allows me to keep on top of my validator selection quickly and efficiently, leaving me more time to make Kusama pottery!",
	},
];

const Testimonials = () => {
	const [users, setUsers] = useState([]);
	const [isPaused, setIsPaused] = useState(false);
	// useEffect(() => {
	// 	axios
	// 		.get("https://dummyapi.io/data/api/user?limit=10", {
	// 			headers: { "app-id": "5f97d648839b3f7fcc501aea" },
	// 		})
	// 		.then(({ data }) => setUsers(data));
	// });

	return (
		<Box py={20} my={16}>
			<h1 className="text-3xl text-gray-700 font-bold text-center mb-16">
				See what our users are saying
			</h1>
			<Marquee velocity={isPaused ? 0 : 30}>
				{testimonialData.map(({ name, avatar, designation, comment }) => (
					<Box
						key={name}
						p={8}
						pb={12}
						mx={8}
						maxW={400}
						textAlign="center"
						rounded={20}
						className="shadow-custom"
						border="1px solid #E2ECF9"
						onPointerOver={() => setIsPaused(true)}
						onPointerLeave={() => setIsPaused(false)}
					>
						<Avatar name={name} src={avatar} size="lg" />
						<h2 className="text-2xl text-gray-700 font-bold">{name}</h2>
						<p className="text-xs font-medium tracking-widest uppercase text-gray-500 mt-1 mb-6">
							{designation}
							{/* 
							{designation ? designation : "YieldScan User"}
						*/}
						</p>
						<p className="text-center text-gray-600">{comment}</p>
					</Box>
				))}
			</Marquee>
		</Box>
	);
};

export default Testimonials;
