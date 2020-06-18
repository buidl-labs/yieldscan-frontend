import { useState } from "react";
import { ChevronRight } from "react-feather";
import Confirmation from "./Confirmation";
import RewardDestination from "./RewardDestination";

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

const Payment = () => {
	const [currentStep, setCurrentStep] = useState(0);

	return (
		<div className="mx-auto my-8" style={{ width: '45rem' }}>
			<Steps
				steps={['Confirmation', 'Reward Destination', 'Payment']}
				currentStep={currentStep}
			/>
			{currentStep === 0 && <Confirmation onConfirm={() => setCurrentStep(step => step + 1)} />}
			{currentStep === 1 && (
				<RewardDestination
					compounding={false}
					onConfirm={() => setCurrentStep(step => step + 1)}
				/>
			)}
		</div>
	);
};

export default Payment;
