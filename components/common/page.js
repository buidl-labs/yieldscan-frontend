import Head from 'next/head';

const Page = ({ title, children }) => {
	return (
		<div>
			<Head>
				<title>{title} - YieldScan</title>
				<link rel="icon" href="/favicon.ico" />
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/style.css"
				/>
				<link
					rel="stylesheet"
					href="https://cdn.rawgit.com/mfd/f3d96ec7f0e8f034cc22ea73b3797b59/raw/856f1dbb8d807aabceb80b6d4f94b464df461b3e/gotham.css"
				/>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			</Head>
			<div>
				{children()}
			</div>
		</div>
	);
};

export default Page;
