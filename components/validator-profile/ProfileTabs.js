const ProfileTabs = ({ tabs, selectedTab, setSelectedTab }) => {
	return (
		<div className="flex items-center">
			{Object.entries(tabs).map(([key, value]) => (
				<button
					key={key}
					className={`
						mx-3 px-1 py-3 transition duration-500 focus:outline-none
						${selectedTab === value ? 'border-b-2 border-teal-500 text-gray-900 font-semibold' : 'text-gray-700'}
					`}
					onClick={() => setSelectedTab(value)}
				>
					<span>{value}</span>
				</button>
			))}
		</div>
	);
};

export default ProfileTabs;
