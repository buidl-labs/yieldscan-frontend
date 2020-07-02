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
import { CheckCircle, Circle } from "react-feather";

const FundsUpdate = withSlideIn(({ styles, type, close }) => {
	const title = `${type === 'bond' ? 'Bond Additional' : 'Unbond'} Funds`;
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
								<h3 className="text-lg">VALIDATORS</h3>
								<div className="flex items-center">
									<span className="mr-2 text-sm">Estimated Monthly Returns</span>
									<div className="py-1 px-2 flex flex-col rounded-lg border border-teal-500 w-24">
										<h3 className="text-teal-500">460 KSM</h3>
										<span hidden className="text-gray-600 text-sm">$120</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default FundsUpdate;
