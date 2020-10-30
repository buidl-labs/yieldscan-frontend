import { Avatar, Box } from "@chakra-ui/core";
import axios from "@lib/axios";
import { times } from "lodash";
import { useEffect, useState } from "react";
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider";

const fakeData = [
	{
		name: "Dr. Gavid Wood",
		avatar: "https://bit.ly/dan-abramov",
		designation: "President & Founder, Web3 Foundation",
		comment:
			"Enim laboris ullamco quis ullamco proident occaecat et deserunt eiusmod pariatur aliquip nulla minim officia. Id minim ut sit aliquip minim aute ex. Excepteur et ipsum consequat aliqua excepteur. Enim laboris ullamco quis ullamco proident occaecat et deserunt eiusmod pariatu sit.",
	},
	{
		name: "David Hawig",
		avatar: "https://bit.ly/ryan-florence",
		designation: "Head of Grants, Web3 Foundation",
		comment:
			"Enim laboris ullamco quis ullamco proident occaecat et deserunt eiusmod pariatur aliquip nulla minim officia. Id minim ut sit aliquip minim aute ex. Excepteur et ipsum consequat aliqua excepteur. Enim laboris ullamco quis ullamco proident occaecat et deserunt eiusmod pariatu sit.",
	},
	{
		name: "Bruno Skvorc",
		avatar: "https://bit.ly/kent-c-dodds",
		designation: "Technical Educator, Web3 Foundation",
		comment:
			"Enim laboris ullamco quis ullamco proident occaecat et deserunt eiusmod pariatur aliquip nulla minim officia. Id minim ut sit aliquip minim aute ex. Excepteur et ipsum consequat aliqua excepteur. Enim laboris ullamco quis ullamco proident occaecat et deserunt eiusmod pariatu sit.",
	},
	{
		name: "Baroque",
		avatar: "https://bit.ly/prosper-baba",
		designation: null,
		comment:
			"Enim laboris ullamco quis ullamco proident occaecat et deserunt eiusmod pariatur aliquip nulla minim officia. Id minim ut sit aliquip minim aute ex.",
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
			<Marquee velocity={isPaused ? 0 : 30} className="justify-start flex">
				{fakeData.map(({ name, avatar, designation, comment }) => (
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
