import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDisclosure } from "@chakra-ui/core";
import ValidatorsResult from "./ValidatorsResult";
import ValidatorsTable from "./ValidatorsTable";
import EditAmountModal from "./EditAmountModal";

const Validators = () => {
	const router = useRouter();
	const { isOpen, onClose } = useDisclosure();

	useEffect(() => {
		console.log(router.query);
	}, [router.query]);

	return (
		<div className="px-10 py-5">
			<EditAmountModal isOpen={isOpen} onClose={onClose} />
			<ValidatorsResult />
			<ValidatorsTable />
		</div>
	);
}

export default Validators;