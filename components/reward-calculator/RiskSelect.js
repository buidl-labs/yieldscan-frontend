const RiskSelect = ({ selected, setSelected }) => {
	const options = ['Low', 'Medium', 'High'];
	return (
		<div className="relative flex rounded-full border border-gray-200 py-2 px-2 w-2/3">
			<div className="absolute left-0 h-100 mx-2 my-2 rounded-full w-1/3 bg-orange-500"></div>
			{options.map((option) => (
				<span
					key={option}
					className={`
						w-1/3 font-semibold py-3 flex-center rounded-full cursor-pointer z-50 transition duration-200
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

						${option === "Medium" && "mx-2"}
					`}
					onClick={() => setSelected(option)}
				>
					{option}
				</span>
			))}
		</div>
	);
};

export default RiskSelect;
