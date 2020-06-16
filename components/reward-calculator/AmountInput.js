const AmountInput = () => {
	return (
		<div className="flex items-center justify-between p-2 py-1 rounded-full border border-gray-300 w-2/3">
			<div className="flex flex-col ml-6">
				<input type="number" value={3000} className="w-24 text-2xl p-0 outline-none" />
				<h6 className="text-gray-600 text-sm">$1500</h6>
			</div>
			<div className="flex-center">
				<div className="bg-gray-800 px-10 py-3 text-white rounded-full">
					<div className="flex items-center relative cursor-pointer">
						<span>KSM</span>
					</div>
				</div>
			</div>
			<style jsx>{`
				/* hides number input controls */
				input[type=number]::-webkit-inner-spin-button, 
				input[type=number]::-webkit-outer-spin-button { 
					-webkit-appearance: none; 
					margin: 0; 
				}
			`}</style>
		</div>
	);
};

export default AmountInput;
