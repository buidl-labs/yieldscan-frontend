import { Box, Button, FormLabel, Input } from "@chakra-ui/core";
import NetworkPopover from "@components/common/utilities/popovers/network-popover";
import { useTransaction } from "@lib/store";
import { useRouter } from "next/router";
import { Rifm } from "rifm";

const LandingPageCalculator = ({ inputValue, setInputValue }) => {
    // const router = useRouter();

    const { setStakingAmount } = useTransaction();
	const numberAccept = /[\d.]+/g;
	const parseNumber = (string) =>
		(String(string).match(numberAccept) || []).join("");

	const formatFloatingPointNumber = (value, maxDigits) => {
		const parsed = parseNumber(value);
		const [head, tail] = parsed.split(".");
		// Avoid rounding errors at toLocaleString as when user enters 1.239 and maxDigits=2 we
		// must not to convert it to 1.24, it must stay 1.23
		const scaledTail = tail != null ? tail.slice(0, maxDigits) : "";

		const number = Number.parseFloat(`${head}.${scaledTail}`);

		if (Number.isNaN(number)) {
			return "";
		}

		const formatted = number.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: maxDigits,
		});

		if (parsed.includes(".")) {
			const [formattedHead] = formatted.split(".");

			// skip zero at digits position for non fixed floats
			// as at digits 2 for non fixed floats numbers like 1.50 has no sense, just 1.5 allowed
			// but 1.0 has sense as otherwise you will not be able to enter 1.05 for example
			const formattedTail =
				scaledTail !== "" && scaledTail[maxDigits - 1] === "0"
					? scaledTail.slice(0, -1)
					: scaledTail;

			return `${formattedHead}.${formattedTail}`;
		}
		return formatted;
	};

	const formatCurrency = (string) =>
		formatFloatingPointNumber(string, 12) + " KSM";
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				setStakingAmount(inputValue);
				router.push({ pathname: "/reward-calculator" });
			}}
			className="w-full max-w-65-rem"
		>
			<div className="flex items-center justify-between mt-16 mb-8 flex-wrap">
				<div>
					<div>
						<FormLabel fontSize="xs" className="text-gray-700">
							Network
						</FormLabel>
						<NetworkPopover isExpanded />
					</div>
					<div>
						<FormLabel fontSize="xs" className="text-gray-700" mt={8}>
							Your Investment
						</FormLabel>
						<Rifm
							accept={/[\d.$]/g}
							format={formatCurrency}
							value={inputValue || 0}
							onChange={(value) => setInputValue(parseNumber(value))}
						>
							{({ value, onChange }) => (
								// type=number is not allowed
								<Input
									type="tel"
									rounded="md"
									py={6}
									px={8}
									my={2}
									mr={4}
									maxW={500}
									placeholder={`0`}
									value={value}
									onChange={onChange}
									className="text-gray-700"
									fontSize="xl"
									fontWeight="medium"
									variant="filled"
									isRequired
								/>
							)}
						</Rifm>
					</div>
					<div>
						<FormLabel fontSize="xs" className="text-gray-700" mt={8}>
							About the network
						</FormLabel>
						<p className="text-sm text-gray-600 w-80">
							Kusama is an early, unaudited, and unrefined release of Polkadot.
							The market cap is{" "}
							<span className="text-teal-500 font-semibold">$309,282,553</span>{" "}
							and the <span className="text-gray-700 font-semibold">24h</span>{" "}
							volume is{" "}
							<span className="text-teal-500 font-semibold">$23,252,260</span>.
						</p>
					</div>
				</div>
				<Box
					h="fill-available"
					minH={300}
					borderRightWidth={1}
					borderColor="gray-300"
				/>
				<Box minW={320} maxW={500}>
					<div>
						<FormLabel fontSize="xs" className="text-gray-700">
							You could be earning
						</FormLabel>
						<h2 className="text-2xl text-gray-700 font-bold">29.88% APR</h2>
					</div>
					<div>
						<FormLabel fontSize="xs" className="text-gray-700" mt={8}>
							Yearly Earning
						</FormLabel>
						<div className="flex justify-between">
							<p className="text-sm text-gray-600">25.000 KSM</p>
							<p className="text-sm font-medium text-teal-500">$857.00</p>
						</div>
					</div>
					<div>
						<FormLabel fontSize="xs" className="text-gray-700" mt={6}>
							Monthly Earning
						</FormLabel>
						<div className="flex justify-between">
							<p className="text-sm text-gray-600">25.000 KSM</p>
							<p className="text-sm font-medium text-teal-500">$857.00</p>
						</div>
					</div>
					<div>
						<FormLabel fontSize="xs" className="text-gray-700" mt={6}>
							Daily Earning
						</FormLabel>
						<div className="flex justify-between">
							<p className="text-sm text-gray-600">25.000 KSM</p>
							<p className="text-sm font-medium text-teal-500">$857.00</p>
						</div>
					</div>
				</Box>
			</div>
			<div className="w-full text-center mt-20">
				<Button
					as="button"
					className="rounded-md shadow-teal min-w-max-content"
					variantColor="teal"
					rounded="md"
					fontWeight="normal"
					size="lg"
					px={12}
					_hover={{ bg: "#2bcaca", transform: "translate(0, -8px)" }}
					_disabled={{
						bg: "#CAD2DB",
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
					Start investing
				</Button>
			</div>
		</form>
	);
};

export default LandingPageCalculator;
