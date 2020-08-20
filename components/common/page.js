import Head from "next/head";
import { isMobile, isTablet } from "react-device-detect";
import { trackEvent, Events } from "@lib/analytics";
import { useEffect } from "react";

window.setImmediate = (cb) => cb();

const Page = ({ title, children, layoutProvider }) => {
	const layoutedChild = layoutProvider ? layoutProvider(children) : children;

	if (isMobile || isTablet) {
		return (
			<React.Fragment>
				<Head>
					<title>{title} - YieldScan</title>
				</Head>
				<div
					className="flex-center flex-col bg-gray-100"
					style={{ width: "100vw", height: "100vh" }}
				>
					<span className="text-lg text-teal-500 font-bold text-4xl mb-10">
						YieldScan
					</span>
					<h1 className="text-xl text-center text-gray-800 px-5">
						We don't support this device yet. To use YieldScan please visit us
						on your desktop / laptop.
					</h1>
				</div>
			</React.Fragment>
		);
	}

	useEffect(() => {
		trackEvent(Events.PAGE_VIEW, { path: window.location.pathname });
	}, []);

	return <div>{layoutedChild()}</div>;
};

export default Page;
