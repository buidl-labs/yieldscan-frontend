import Head from 'next/head';
import { useState, useEffect } from 'react';
import PolkadotApiContext from '@lib/contexts/polkadot-api';
import createPolkadotAPIInstance from '@lib/polkadot-api';

const Page = ({ title, children, layoutProvider }) => {
	const layoutedChild = layoutProvider ? layoutProvider(children) : children;
	const [apiInstance, setApiInstance] = useState(); 

	useEffect(() => {
		// ensure only single api-instance is created in whole lifetime of this container
		createPolkadotAPIInstance().then(setApiInstance);
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
			<PolkadotApiContext.Provider value={{ apiInstance }}>
				<div>
					{layoutedChild()}
				</div>
			</PolkadotApiContext.Provider>
		</div>
	);
};

export default Page;
