import { useState } from "react";
import { ChevronRight } from "react-feather";

const Steps = ({ steps, currentStep }) => (
	<>
		<div className="cursor-default select-none steps-container text-center flex justify-between items-center text-lg font-semibold">
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
					{index !== steps.length - 1 && <ChevronRight className="text-gray-600" />}
				</React.Fragment>
			))}
		</div>
		<style jsx>{`
			.steps-container {
				width: 60vw;
			}
		`}</style>
	</>
);

const Payment = () => {
	const [currentStep] = useState(0);
	
	return (
		<div className="w-full px-56">
			<div className="flex items-center justify-center mt-10">
				<Steps
					steps={['Confirmation', 'Reward Destination', 'Payment']}
					currentStep={currentStep}
				/>
			</div>

		</div>
	);
};

export default Payment;
