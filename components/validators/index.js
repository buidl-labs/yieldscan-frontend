import ValidatorsResult from "./ValidatorsResult";
import ValidatorsTable from "./ValidatorsTable";
import EditAmountModal from "./EditAmountModal";
import { useDisclosure } from "@chakra-ui/core";

const Validators = () => {
	const { isOpen, onClose } = useDisclosure(true);
	return (
		<div className="px-10 py-5">
			<EditAmountModal isOpen={isOpen} onClose={onClose} />
			<ValidatorsResult />
			<ValidatorsTable />
		</div>
	);
}

export default Validators;