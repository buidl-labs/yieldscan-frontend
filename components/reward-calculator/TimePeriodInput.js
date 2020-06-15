import { ChevronDown } from "react-feather";

const TimePeriodInput = () => {
	return (
		<div className="flex items-center justify-between p-2 rounded-full border border-gray-300 w-2/3">
			<div className="ml-6">
				<input type="number" value={6} className="w-24 text-2xl p-0 outline-none" />
			</div>
			<div className="flex-center">
				<div className="bg-gray-800 px-6 py-3 text-white rounded-full">
					<div className="flex items-center relative cursor-pointer">
						<span className="mr-8">Months</span>
						<ChevronDown className="absolute right-0" />
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

export default TimePeriodInput;
