import {
	Avatar,
	Box,
	Button,
	Icon,
	Image,
	Link,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/core";
import Footer from "@components/common/footer";
import { GitHub, Globe, Twitter } from "react-feather";
import {
	FaGithub,
	FaGlobe,
	FaLinkedin,
	FaQuoteLeft,
	FaTwitter,
} from "react-icons/fa";
import { IoIosGlobe, IoLogoGithub, IoLogoTwitter } from "react-icons/io";

const members = [
	{
		avatar_url: "/images/team/saumya-karan.png",
		bio:
			"Truth seeker. Spending mindspace in solving UX problems in onboarding people to decentralized economic networks.",
		name: "Saumya Karan",
		twitter_username: "saumya_karan",
		blog: "https://saumyakaran.com/",
		url: "https://github.com/saumyakaran",
		linked_in: "skrn",
		role: "Project Lead",
	},
	{
		avatar_url: "/images/team/sahil-nanda.png",
		bio:
			"Studying validator & nominator relationships across various PoS stakes.",
		name: "Sahil Nanda",
		url: "https://github.com/sahilnanda1995",
		linked_in: "sahil-nanda-8b1b88143",
		role: "Lead Researcher & Product Engineer",
	},
	{
		avatar_url: "/images/team/prastut-kumar.png",
		bio:
			"Insatiably curious. Currently a student of cryptoeconomics and reality.",
		name: "Prastut Kumar",
		twitter_username: "prastutkumar",
		blog: "https://prastutkumar.com/",
		url: "https://github.com/prastut",
		linked_in: "prastut",
		role: "Advisor",
	},
];

const SocialLink = ({ icon, href }) => {
	return (
		<Link
			display="inline-flex"
			alignItems="center"
			justifyContent="center"
			rounded="full"
			href={href}
			mr={2}
			isExternal
			color="gray.600"
			_focus={{ boxShadow: "none" }}
			_hover={{ color: "teal.500" }}
		>
			{/* <Icon
				as={icon}
				transition="all 0.2s"
				_hover={{ color: "teal.600" }}
				fontSize="xl"
				color="teal.500"
			/> */}
			{icon}
		</Link>
	);
};

const Member = ({ member }) => {
	const {
		avatar_url: avatarUrl,
		bio,
		name,
		twitter_username: twitterUsername,
		blog: websiteUrl,
		url,
		role,
		linked_in: linkedIn,
	} = member;

	return (
		<Box>
			<Stack direction="row" spacing={6}>
				<Avatar size="xl" src={avatarUrl} />
				<Stack spacing={3} maxW="320px">
					<Text fontWeight="semibold" fontSize="md" color="gray.600">
						{name}
						{role && (
							<Text as="span" display="block" fontSize="xs" fontWeight="normal">
								{role}
							</Text>
						)}
					</Text>

					<Text fontSize="sm" color="gray.500">
						{bio}
					</Text>
					<Stack isInline align="center" spacing={2}>
						<SocialLink href={url} icon={<FaGithub />} />
						{twitterUsername && (
							<SocialLink
								href={`https://twitter.com/${twitterUsername}`}
								icon={<FaTwitter />}
							/>
						)}
						{linkedIn && (
							<SocialLink
								href={`https://www.linkedin.com/in/${linkedIn}`}
								icon={<FaLinkedin />}
							/>
						)}
						{websiteUrl && <SocialLink href={websiteUrl} icon={<FaGlobe />} />}
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);
};

const About = () => {
	return (
		<div className="pt-24 w-full min-h-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 flex flex-col items-center">
			<h1 className="text-6xl">🏗</h1>
			<h1 className="text-5xl text-gray-700 font-bold text-center">
				We are BUIDL-ers
			</h1>
			<Text maxW="56ch" mx="auto" fontSize="lg" color="gray.600">
				We like building, especially sans the pressure of business viability.
			</Text>
			<p className="inline-flex items-center font-medium text-gray-700 text-xs mt-6">
				Project YieldScan's team is a part of{" "}
				<Link
					href="https://buidllabs.io/"
					textDecor="underline"
					color="teal.500"
					ml={1}
					isExternal
				>
					BUIDL Labs
				</Link>
			</p>
			<h1 className="text-3xl text-gray-700 font-bold text-center mt-20 mb-16">
				💪🏻 Core team
			</h1>
			<SimpleGrid columns={[1, 1, 2]} spacing="40px" pt="3">
				{members.map((member) => (
					<Member key={member.name} member={member} />
				))}
			</SimpleGrid>
			<h1 className="text-3xl text-gray-700 font-bold text-center mt-48 mb-16">
				📜 Our story
			</h1>
			<Text maxW="70ch" mx="auto" color="gray.600" textAlign="center">
				The foundation for YieldScan was laid during mid-2019, when we noticed
				that information asymmetry in the decentralized finance (DeFi) space
				leads to a high barrier of entry for newcomers and non-technical
				enthusiasts.
			</Text>
			<blockquote className="rounded-xl text-gray-700 my-8 pt-8 pb-12  flex flex-col items-center bg-gray-100 px-16">
				<span className="rounded-full bg-gray-700 h-12 w-12 flex justify-center items-center mb-4">
					<FaQuoteLeft color="white" />
				</span>
				<p className="text-center text-xl">
					The future is already here — it's just not evenly distributed.
				</p>
				<p className="mt-4 text-xs text-right">William Ford Gibson</p>
			</blockquote>
			<Text maxW="70ch" mx="auto" color="gray.600" textAlign="center" mb={16}>
				DeFi is the future and YieldScan is our attempt to distribute it
				equally.
			</Text>
			<div className="w-screen bg-teal-500 py-8 flex justify-center items-center mt-32">
				<p className="text-2xl text-white mr-8">
					Looking to help humanity get to the future faster?
				</p>
				<Link
					href="https://buidllabs.io/careers/"
					className="min-w-max-content"
					color="teal.500"
					backgroundColor="white"
					rounded="md"
					fontWeight="normal"
					fontSize="lg"
					py={2}
					px={12}
					_hover={{ bg: "white", transform: "scale(1.03)" }}
					_focus={{ boxShadow: "none" }}
					isExternal
				>
					See careers
				</Link>
			</div>
			<div className="max-w-65-rem mb-32">
				<h1 className="text-3xl text-gray-700 font-bold text-center mt-32 mb-16">
					We’re backed by the best
				</h1>
				<div className="flex items-center justify-between">
					<div className="w-1/3">
						<Image
							src="/images/web3foundation_grants_badge_black.png"
							alt="Web3 Foundation Grants Badge"
							w={300}
							h={120}
							mr={-2}
						/>
					</div>
					<Box
						h="fill-available"
						minH={300}
						borderRightWidth={1}
						borderColor="gray-300"
					/>
					<p className="w-1/3 text-gray-700">
						YieldScan is funded by{" "}
						<span className="font-semibold">Web3 Foundation</span> under{" "}
						<span className="font-semibold">Wave 6</span> of the General Grants
						Program. See{" "}
						<Link
							href="https://medium.com/web3foundation/web3-foundation-grants-wave-6-recipients-5ed8d5cc179"
							color="teal.500"
							isExternal
						>
							official announcement
						</Link>
						. <br />
						<br /> Web3 Foundation funds development work driving advancement
						and adoption of decentralized software protocols.
					</p>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default About;
