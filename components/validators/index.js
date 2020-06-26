import ValidatorsResult from "./ValidatorsResult";
import ValidatorsTable from "./ValidatorsTable";

const Validators = () => {
	return (
		<div className="px-10 py-5">
			<ValidatorsResult />
			<ValidatorsTable />
		</div>
	);
}

export default Validators;