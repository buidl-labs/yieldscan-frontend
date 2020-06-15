const RiskSelect = ({ selected = 'Low' }) => {
	const options = ['Low', 'Medium', 'High'];
	return (
		<div className="flex rounded-full border border-gray-300 py-2 px-2 w-2/3">
			{options.map(option => (
				<span key={option} className={`
					w-1/3 font-semibold py-4 flex-center rounded-full cursor-pointer
					${selected === option ? 'bg-orange-500 text-white' : 'text-gray-600'}
				`}>
					{option}
				</span>
			))}
		</div>
	);
};

export default RiskSelect;
