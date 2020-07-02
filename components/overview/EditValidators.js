import withSlideIn from "@components/common/withSlideIn";
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

const EditValidators = withSlideIn(({ styles, close }) => {
	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="90vw" height="84vh" {...styles}>
				<ModalHeader>
					<h1>Edit Validators</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody px="4rem">
					<div className="flex justify-around">
						<div className="bg-gray-300 p-2">
							<div className="flex items-center px-2">
								<h3 className="text-lg">Candidate Validators</h3>
							</div>
						</div>
						<div className="border border-gray-300 p-2">
							<div className="flex justify-between items-center">
								<h3 className="text-lg">
									Selected Validators
									<span className="text-sm rounded-full bg-gray-300 text-gray-800 font-semibold">
										16
									</span>
								</h3>
								<div></div>
							</div>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditValidators;
