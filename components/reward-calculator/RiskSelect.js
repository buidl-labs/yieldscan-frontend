const RiskSelect = ({ selected = 'Medium', setSelected }) => {
	const options = ['Low', 'Medium', 'High'];
	return (
		<div className="relative flex rounded-full border border-gray-300 py-2 px-2 w-2/3">
			<div className="absolute left-0 h-100 mx-2 my-2 rounded-full w-1/3 bg-orange-500"></div>
			{options.map(option => (
				<span
					key={option}
					className={`
						w-1/3 font-semibold py-4 mx-1 flex-center rounded-full cursor-pointer z-50 transition duration-200
						${selected === option ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-200'}
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
