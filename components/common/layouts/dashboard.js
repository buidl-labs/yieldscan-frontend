import Header from '@components/common/header';

const withDashboardLayout = (children) => {
	return () => (
		<div>
			<Header />
			<div className="dashboard-content">
				{children()}
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
