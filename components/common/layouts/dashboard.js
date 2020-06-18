import Header from '@components/common/header';
import SideMenu from '@components/common/sidemenu';

const withDashboardLayout = (children) => {
	return () => (
		<div>
			<Header />
			<div className="dashboard-content fixed flex">
				<div className="h-full relative sidemenu-container py-10">
					<SideMenu />
				</div>
				<div className="h-full core-content overflow-y-scroll">
					{children()}
				</div>
			</div>
			<style jsx>{`
				.dashboard-content {
					height: calc(100vh - 4rem);
					animation: fadein 100ms;
				}
				.sidemenu-container {
					width: 13rem;
					background: #F7FBFF;
				}
				.core-content {
					width: calc(100% - 13rem);
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
