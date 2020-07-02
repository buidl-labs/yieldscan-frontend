import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	Spinner,
	useToast,
	Input
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import RiskTag from "@components/reward-calculator/RiskTag";

const ValidatorCard = ({
	stashId,
	riskScore,
	stakedAmount,
	returnsPer100KSM,
}) => (
	<div className="flex justify-around items-center py-2 my-2 rounded-lg cursor-pointer border border-gray-300">
		<img src="http://placehold.it/255" className="rounded-full w-10 h-10 mr-4" />
		<h3 className="text-gray-700 text-xs w-48 truncate">{stashId}</h3>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Risk Score</span>
			<div className="rounded-full font-semibold"><RiskTag risk={riskScore} /></div>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Staked Amount</span>
			<h3 className="text-lg">{stakedAmount} KSM</h3>
		</div>
		<div className="flex flex-col">
			<span className="text-xs text-gray-500 font-semibold">Returns / 100 KSM</span>
			<h3 className="text-lg">{returnsPer100KSM.toFixed(4)} KSM</h3>
		</div>
	</div>
);

const FundsUpdate = withSlideIn(({ styles, type, close }) => {
	const title = `${type === 'bond' ? 'Bond Additional' : 'Unbond'} Funds`;
	const [validatorsLoading, setValidatorsLoading] = useState(true);

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="90vw" height="80vh" {...styles}>
				<ModalHeader>
				<h1>{title}</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody px="4rem">
					<div className="flex justify-around">
						<div className="border border-gray-200 p-10 rounded-lg text-gray-800 w-1/3">
							<div>
								<h3 className="text-xl">Currently Bonded</h3>
								<h1 className="text-3xl">700 KSM</h1>
								<span className="text-lg text-gray-600">$350</span>
							</div>
							<div className="mt-10">
								<h3>{title}</h3>
								<div className="border border-gray-200 rounded-lg">
									<input
										className="rounded outline-none p-2 text-xl text-teal-500 rounded-lg"
									/>
								</div>
							</div>
							<div className="mt-10">
								<h3 className="text-xl">Total Staking Amount</h3>
								<h1 className="text-3xl">1000 KSM</h1>
								<span className="text-lg text-gray-600">$500</span>
							</div>
						</div>
						
						<div className="border border-gray-400 rounded-lg w-2/3">
							<div className="flex justify-between items-center px-4 py-2 text-gray-700">
								<h3 className="text-lg font-semibold">VALIDATORS</h3>
								<div className="flex items-center">
									<span className="mr-2 text-sm">Estimated Monthly Returns</span>
									<div className="py-1 px-2 flex flex-col rounded-lg border border-teal-500 w-24">
										<h3 className="text-teal-500">460 KSM</h3>
										<span hidden className="text-gray-600 text-sm">$120</span>
									</div>
								</div>
							</div>
							<div className="overflow-y-scroll">

							</div>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default FundsUpdate;
