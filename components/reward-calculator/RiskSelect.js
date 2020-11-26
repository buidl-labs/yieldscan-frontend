const RiskSelect = ({ selected, setSelected }) => {
	const options = ["Low", "Medium", "High"];
	return (
		<div className="relative flex rounded-full border border-gray-200 py-1 px-1 w-fit-content text-gray-700">
			{options.map((option) => (
				<span
					key={option}
					className={`
						  py-2 px-6 flex-center rounded-full cursor-pointer z-50 transition duration-200 text-sm
						${
							selected === option
								? option === "Low"
									? "bg-green-400 text-white"
									: option === "Medium"
									? "bg-orange-500 text-white"
									: option === "High" && "bg-red-500 text-white"
								: option === "Low"
								? "hover:bg-green-200 text-gray"
								: option === "Medium"
								? "hover:bg-orange-200 text-gray"
								: option === "High" && "hover:bg-red-200 text-gray"
						}
					`}
					onClick={() => {
						setSelected(option);
						trackRewardCalculatedEvent({ riskPreference: option });
					}}
				>
					{option}
				</span>
			))}
		</div>
	);
};

export default RiskSelect;
