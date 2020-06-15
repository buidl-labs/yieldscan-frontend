const Header = () => {
	return (
		<div className="flex items-center justify-between border border-bottom border-gray-200 bg-white p-8 h-12">
			<div>
				<span className="text-lg text-black">YieldScan</span>
			</div>
			<div>
				<button className="rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800 mr-2">
					Connect Wallet
				</button>
				<button className="rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800">
					>
				</button>
			</div>
		</div>
	);
};

export default Header;
