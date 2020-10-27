import { Box, Button, FormLabel, Image, Input, Link } from "@chakra-ui/core";
import Footer from "@components/common/footer";
import { useTransaction, useSelectedNetwork } from "@lib/store";
import { getNetworkInfo, networks } from "../../yieldscan.config";
import { useRouter } from "next/router";
import SocialProofStats from "./SocialProofStats";
import NetworkPopover from "@components/common/utilities/popovers/network-popover";
import { Rifm } from "rifm";
import LandingPageCalculator from "./landing-page-calculator";
import Testimonials from "./testimonials";
import FAQs from "./FAQs";
import SupportedNetworks from "./SupportedNetworks";

window.setImmediate = (cb) => cb();

const HomePage = () => {
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { stakingAmount, setStakingAmount } = useTransaction();
	const [inputValue, setInputValue] = React.useState(stakingAmount || 1000);

	React.useEffect(() => {
		setStakingAmount(null);
	}, []);
	return (
		<div className="pt-12 w-full min-h-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 flex flex-col items-center">
			<div className="w-full max-w-65-rem">
				<h1 className="text-4xl text-gray-700 font-bold text-center">
					Simple. Non-custodial. Secure.
				</h1>
				<p className="text-center text-gray-600">
					Maximizing yield on staking has never been easier
				</p>
			</div>
			<LandingPageCalculator
				inputValue={inputValue}
				setInputValue={(val) => setInputValue(val)}
			/>
			<SocialProofStats
				networkName={networkInfo.name}
				networkDenom={networkInfo.denom}
				networkUrl={networkInfo.coinGeckoDenom}
			/>
			<Testimonials />
			<SupportedNetworks />
			<hr className="w-screen" />
			<FAQs />
			<div className="w-screen shadow-teal bg-teal-500 py-8 flex justify-center items-center mt-40">
				<p className="text-2xl text-white mr-8">Ready to start earning?</p>
				<Button
					className="rounded-md shadow-white min-w-max-content"
					color="teal.500"
					backgroundColor="white"
					rounded="md"
					fontWeight="normal"
					fontSize="lg"
					py={6}
					px={12}
					_hover={{ bg: "white", transform: "scale(1.03)" }}
					_disabled={{
						bg: "white",
						opacity: 0.5,
						transform: "none",
						cursor: "not-allowed",
						filter: "none",
					}}
					onClick={() => {
						setStakingAmount(inputValue);
						router.push({ pathname: "/reward-calculator" });
					}}
					isDisabled={isNaN(inputValue) || Number(inputValue) <= 0}
				>
					Invest now
				</Button>
			</div>
			<div className="max-w-65-rem mb-32">
				<h1 className="text-3xl text-gray-700 font-bold text-center mt-20 mb-16">
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

export default HomePage;
