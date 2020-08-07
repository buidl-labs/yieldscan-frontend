import Head from 'next/head';
import { isMobile, isTablet } from 'react-device-detect';
import amplitude from '@lib/amplitude';
import { useEffect } from 'react';

const Page = ({ title, children, layoutProvider }) => {
	const layoutedChild = layoutProvider ? layoutProvider(children) : children;

	if (isMobile || isTablet) {
		return (
			<div className="flex-center flex-col bg-gray-100" style={{ width: '100vw', height: '100vh' }}>
				<span className="text-lg text-teal-500 font-bold text-4xl mb-10">YieldScan</span>
				<h1 className="text-xl text-center text-gray-800 font-semibold px-5">
					We don't support this device yet. To use YieldScan please visit us on your desktop / laptop.
				</h1>
			</div>
		);
	}

	useEffect(() => {
		amplitude.logEvent('PAGE_VIEW', { path: window.location.pathname });
	}, []);

	return (
		<div>
			<Head>
				<title>{title} - YieldScan</title>
				<link rel="icon" href="/favicon.ico" />
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/style.css"
				/>
				<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			</Head>
			<div>
				{layoutedChild()}
			</div>
		</div>
	);
};

export default Page;
