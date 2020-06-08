const withDashboardLayout = (children) => {
	return () => (
		<div>
			<div className="flex w-full justify-between root-container">
				<div className="dashboard-content">
					<h5 className="text-xl m-10 font-thin">Dashboard stuff</h5>
					{children()}
				</div>
			</div>
			<style jsx>{`
				.root-container {
					height: calc(100vh - 2rem);	
				}
				.dashboard-content {
					height: calc(100vh - 2rem);
					animation: fadein 100ms;
				}
				@keyframes fadein {
					from { opacity: 0; transform: scale(0.7); }
					to   { opacity: 1; transform: scale(1); }
				}
			`}</style>
		</div>
	);
};

export default withDashboardLayout;
