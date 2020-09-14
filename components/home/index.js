import { Input } from "@chakra-ui/core";
import Footer from "@components/common/footer";
import { useTransaction } from "@lib/store";
import { useRouter } from "next/router";
import SocialProofStats from "./SocialProofStats";

window.setImmediate = (cb) => cb();

const HomePage = () => {
	const router = useRouter();
	const { setStakingAmount } = useTransaction();
	const [inputValue, setInputValue] = React.useState();

	const handleChange = (value) => {
		setInputValue(value);
	};

	React.useEffect(() => {
		setStakingAmount(null);
	}, []);
	return (
		<div className="pt-20 lg:pt-24 xl:pt-32 w-full min-h-full bg-landing px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 flex flex-col items-center">
			<div className="w-full max-w-65-rem">
				<h1 className="text-5xl text-black font-black">
					Maximize your yield on staking.
				</h1>
				<form
					className="flex max-w-48-rem items-center mt-8 flex-wrap"
					onSubmit={(e) => {
						e.preventDefault();
						setStakingAmount(inputValue);
						router.push({ pathname: "/reward-calculator" });
					}}
				>
					<Input
						type="number"
						step="any"
						rounded="md"
						py={6}
						px={8}
						my={2}
						mr={4}
						maxW={500}
						placeholder="Enter the amount in KSM that you want to invest"
						value={inputValue || ""}
						onChange={(e) => {
							const { value } = e.target;
							handleChange(value);
						}}
						variant="filled"
						isRequired
					/>
					<button
						className="bg-teal-500 text-white rounded-md px-8 py-4 shadow-teal min-w-max-content"
						onClick={onsubmit}
					>
						Calculate Returns
					</button>
				</form>
			</div>
			<SocialProofStats />
			<img
				src="/images/web3foundation_grants_badge_black.png"
				alt="Web3 Foundation Grants Badge"
				width="1000px"
			/>
			<Footer />
		</div>
	);
};

export default HomePage;
