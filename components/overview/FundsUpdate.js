import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	Spinner,
	useToast
} from "@chakra-ui/core";
import withSlideIn from "@components/common/withSlideIn";
import { CheckCircle, Circle } from "react-feather";

const FundsUpdate = withSlideIn(({ styles, type, close }) => {
	return (
		<Modal isOpen={true} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent rounded="lg" maxWidth="40rem" height="36rem" {...styles}>
				<ModalHeader>
				<h1>{type === 'bond' ? 'Bond Additional' : 'Unbond'} Funds</h1>
				</ModalHeader>
				<ModalCloseButton onClick={close} />
				<ModalBody>
					<h1>Funds Update</h1>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default FundsUpdate;
