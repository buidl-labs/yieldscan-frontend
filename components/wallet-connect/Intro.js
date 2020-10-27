const IntroPage = ({ onConnected, onDisclaimer }) => (
	<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
		<img src="/images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-2xl">
			Connect to the PolkadotJS browser extension
		</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">
			PolkadotJS extension is a simple browser extension for managing your
			accounts. It allows you to securely sign transactions using these accounts
			while maintaining complete control over your funds.
		</span>
		<a
			className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-full"
			href="https://github.com/polkadot-js/extension#installation"
			target="_blank"
		>
			Install extension
		</a>
		{/* <button
			className="mt-2 px-12 py-4 bg-white text-teal-500 rounded-lg border border-teal-500"
			onClick={onDisclaimer}
		>
			Create a wallet for my account
		</button> */}
		<span className="mt-6 text-gray-500">
			{"Using a different wallet? "}
			<a
				href="https://github.com/polkadot-js/extension#installation"
				target="_blank"
			>
				<strong className="text-black-500">Request feature</strong>
			</a>
		</span>
	</div>
);

export default IntroPage;
