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
			<ModalContent rounded="lg" maxWidth="70vw" height="36rem" {...styles}>
				<ModalHeader>
				<h1>{title}</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody px="4rem">
					<div className="flex justify-around">
						<div className="border border-gray-200 p-10 rounded-lg text-gray-800">
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
						
						<div className="border border-gray-400">
							Table here
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default FundsUpdate;
