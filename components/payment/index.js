import { useState } from "react";
import { ChevronRight } from "react-feather";
import RiskTag from "@components/reward-calculator/RiskTag";

const Steps = ({ steps, currentStep }) => (
	<>
		<div className="cursor-default select-none steps-container flex justify-start items-center text-lg font-semibold">
			{steps.map((step, index) => (
				<React.Fragment key={index}>
					<div className="flex items-center">
						<div
							className={`
								px-3 py-1 rounded-full text-white mr-4
								${index > currentStep ? 'bg-gray-500' : 'bg-teal-500'}
							`}
						>
							{index + 1}
						</div>
						<div className={index > currentStep ? 'text-gray-500' : 'text-teal-500'}>{step}</div>
					</div>
					{index !== steps.length - 1 && <ChevronRight className="text-gray-600 mx-5" />}
				</React.Fragment>
			))}
		</div>
	</>
);

const ValidatorInfo = () => (
	<div className="rounded-lg flex items-center border border-gray-200 px-4 mb-2">
		<img src="http://placehold.it/255" className="rounded-full w-12 h-12 mr-4" />
		<div className="flex flex-col items-start">
			<h3 className="text-gray-700 text-lg">Validator Name</h3>
			<span className="flex text-gray-500 text-sm">
				Risk Score
				<RiskTag risk={Number(Math.random().toFixed(2))} />
			</span>
		</div>
		<div className="flex flex-col ml-auto">
			<span className="text-red-400">Amount</span>
			<h5 className="text-gray-700">30 KSM</h5>
			<span className="text-gray-500 text-sm">$15</span>
		</div>
	</div>
);

const Payment = () => {
	const [currentStep] = useState(0);

	return (
		<div className="mx-auto my-8" style={{ width: '45rem' }}>
			<Steps
				steps={['Confirmation', 'Reward Destination', 'Payment']}
				currentStep={currentStep}
			/>
			<div className="mt-10">
				<h1 className="text-2xl">Confirmation</h1>
				<span className="text-gray-600">
					You are about to stake your KSM on the following validators. Please make sure you understand the risks before proceeding. Read the <a href="google.com" className="text-blue-500 underline">Terms of Service.</a>
				</span>

				<div className="mt-6 rounded-xl border border-gray-200 px-8 py-3 mt-4">
					{false && <h1 className="text-gray-700 text-2xl">Selected Validators</h1>}
					<div className="flex justify-between items-centerr">
						<div className="flex justify-between items-center rounded-full px-4 py-2 border border-gray-200">
							<span>Estimated Returns</span>
							<div className="ml-2 px-3 py-2 bg-teal-500 text-white rounded-full">200 KSM</div>
						</div>
						<div className="flex justify-between items-center rounded-full px-4 py-2 border border-gray-200">
							<span>Risk Preference</span>
							<div className="ml-2 px-3 py-2 bg-orange-500 text-white rounded-full">Medium</div>
						</div>
					</div>
					<div className="mt-4 overflow-auto" style={{ height: '15rem' }}>
						<ValidatorInfo />
						<ValidatorInfo />
						<ValidatorInfo />
						<ValidatorInfo />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Payment;
