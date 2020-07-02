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
						<div className="w-1/2 bg-gray-300 p-2 mr-2 rounded-lg">
							<div className="">
								<h3 className="font-semibold">CANDIDATE VALIDATORS</h3>
							</div>
							<div>
								validators card here
							</div>
						</div>
						<div className="w-1/2 border border-gray-300 p-2 rounded-lg">
							<div className="flex justify-between items-center">
								<h3 className="font-semibold">
									SELECTED VALIDATORS
									<span className="p-1 ml-2 rounded-full bg-gray-300 text-gray-600 font-semibold">
										16
									</span>
								</h3>
								<div className="flex items-center text-sm">
									<span className="mr-2">Estimated Monthly Returns</span>
									<div className="w-32 border border-teal-500 text-teal-500 p-1 rounded-lg">
										450 KSM
									</div>
								</div>
							</div>
							<div>
								validators card here
							</div>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditValidators;
