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
import { CheckCircle, PlusCircle } from "react-feather";
import useHover from "@components/common/hooks/useHover";
import { useState, useEffect } from "react";
import axios from "@lib/axios";

const EditValidators = withSlideIn(({ styles, close }) => {
	const [validators, setValidators] = useState([]);
	const [validatorsLoading, setValidatorsLoading] = useState(true);

	useEffect(() => {
		axios.get('/rewards/risk-set').then(({ data }) => {
			const validators = data.totalset;
			setValidators(validators);
			setValidatorsLoading(false);
		});
	}, []);

	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="90vw" height="84vh" {...styles}>
				<ModalHeader>
					<h1>Edit Validators</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody px="4rem">
					{validatorsLoading ? (
						<div className="flex flex-col items-center justify-center mt-40">
							<Spinner size="lg" />
							<span className="mt-5 text-sm text-gray-600">Quick deep breath...</span>
						</div>
					) : (
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
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default EditValidators;
