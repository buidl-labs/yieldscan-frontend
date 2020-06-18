import { useState } from "react";

const Payment = () => {
	const currentStep = useState(0);
	
	return (
		<div className="w-full px-56">
			<h1>Payment Confirmation</h1>
			<Steps
				steps={['Confirmation', 'Reward Destination', 'Payment']}
				currentStep={currentStep}
			/>
		</div>
	);
};

export default Payment;
