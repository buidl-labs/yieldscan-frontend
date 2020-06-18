import Header from '@components/common/header';
import SideMenu from '@components/common/sidemenu';

const withBaseLayout = (children) => {
	return () => (
		<div>
			<Header />
			<div className="dashboard-content flex">
				<div className="h-full w-full">
					{children()}
				</div>
			</div>
			<style jsx>{`
				.dashboard-content {
					height: calc(100vh - 4rem);
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

export default withBaseLayout;
