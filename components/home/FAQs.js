import {
	Accordion,
	AccordionItem,
	AccordionHeader,
	Heading,
	AccordionIcon,
	AccordionPanel,
	Link,
	Box,
} from "@chakra-ui/core";

const FAQs = () => {
	return (
		<Box mt={16} w="full">
			<h1 className="text-3xl text-gray-700 font-bold text-center">
				Frequently Asked Questions
			</h1>
			<p className="text-gray-600 mb-16 text-center">
				Can’t find what you were looking for?{" "}
				<Link
					_hover={{ textDecor: "none" }}
					color="teal.500"
					borderBottom="1px solid"
					pr={1}
				>
					Contact us
				</Link>
			</p>
			<Accordion defaultIndex={[0]} allowMultiple maxW={520} w="full" mx="auto">
				{data.map((data, index) => (
					<AccordionItem
						key={data.id}
						pt={8}
						pb={4}
						border={index === 0 && "none"}
					>
						<AccordionHeader
							_hover={{ bg: "none" }}
							_focus={{ boxShadow: "none" }}
						>
							<Box flex="1" textAlign="left">
								<Heading
									as="h5"
									size="md"
									className="text-gray-700"
									fontWeight="normal"
									textAlign="left"
								>
									{data.question}
								</Heading>
							</Box>
							<AccordionIcon />
						</AccordionHeader>
						<AccordionPanel pt={4} pb={12} className="text-gray-700">
							{data.answer}{" "}
							{data.link !== undefined ? (
								<Link
									href={data.link.url}
									color="teal.500"
									isExternal={data.link.isExternal ? true : false}
								>
									{data.link.content}
								</Link>
							) : (
								""
							)}
						</AccordionPanel>
					</AccordionItem>
				))}
			</Accordion>
		</Box>
	);
};

export default FAQs;

const data = [
	{
		id: 1,
		question: "What is YieldScan?",
		answer:
			"YieldScan is a portfolio management platform for NPoS (nominated proof-of-stake) networks like Kusama and Polkadot. We aim to simplify portfolio management to make yield optimization easier and more accessible, for technical and non-technical users alike.",
	},
	{
		id: 2,
		question: "What is staking?",
		answer: `Staking is the act of bonding tokens by putting them up as "collateral" for a chance to produce a valid block (and thus obtain a block reward). Validators and nominators stake their tokens in order to secure the network and are rewarded for the same.`,
	},
	// {
	// 	id: 3,
	// 	question: "What are the risks involved with staking?",
	// 	answer:
	// 		"Polkadot uses NPoS (Nominated Proof-of-Stake) as its mechanism for selecting the validator set. It is designed with the roles of validators and nominators, to maximize chain security.",
	// 	link: {
	// 		url:
	// 			"https://wiki.polkadot.network/docs/en/learn-staking#how-does-staking-work-in-polkadot",
	// 		content: "Learn more about staking",
	// 		isExternal: true,
	// 	},
	// },
	// {
	// 	id: 4,
	// 	question: "How can I obtain tokens to stake?",
	// 	answer:
	// 		"Nominators secure the relay chain by selecting good validators and staking DOTs.",
	// 	link: {
	// 		url: "https://wiki.polkadot.network/docs/en/maintain-nominator",
	// 		content: "Learn more about nominators",
	// 		isExternal: true,
	// 	},
	// },
	{
		id: 5,
		question: "What are your fees?",
		answer:
			"As of right now, YieldScan is 100% free to use. If this changes in the future, then the fees would be displayed on the confirmation page before sending your transaction.",
	},
	{
		id: 6,
		question: "Who keeps the custody of my funds?",
		answer:
			"You. YieldScan is 100% non-custodial. We do not hold any of your assets, you are in control of your funds at all times.",
	},
];
