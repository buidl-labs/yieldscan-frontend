import { Edit2 } from "react-feather";

const ValidatorInfo = () => (
	<div className="rounded-lg flex items-center border border-gray-200 px-4 py-2 mb-2">
		<img src="http://placehold.it/255" className="rounded-full w-16 h-16 mr-4" />
		<div className="flex flex-col items-start">
			<h3 className="text-gray-700 text-xl">Validator Name</h3>
			<span className="text-gray-500 text-sm">Risk Score 0.12</span>
		</div>
		<div className="flex flex-col ml-auto">
			<span className="text-red-400">Amount</span>
			<h5 className="text-gray-700 text-lg">30 KSM</h5>
			<span className="text-gray-500 text-sm">$15</span>
		</div>
	</div>
);

const ValidatorsList = () => {
	return (
		<div className="rounded-xl border border-gray-200 px-8 py-6 mt-4">
			<div className="flex items-center justify-between">
				<h1 className="font-semibold text-gray-700 text-2xl">Suggested Validators</h1>
				<Edit2 size="1.5rem" />
			</div>
			<div className="mt-4 overflow-auto h-64">
				<ValidatorInfo />
				<ValidatorInfo />
				<ValidatorInfo />
				<ValidatorInfo />
				<ValidatorInfo />
			</div>
		</div>
	);
};

export default ValidatorsList;
