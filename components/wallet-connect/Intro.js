const IntroPage = ({ onConnected, onDisclaimer }) => (
	<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
		<img src="/images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-2xl">
			Connect to the PolkadotJS browser extension
		</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">
			PolkadotJS extension is a simple browser extension for managing accounts
			in a browser and allowing the signing of extrinsics using these accounts.
		</span>
		<button
			className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
			onClick={onConnected}
		>
			Connect my wallet
		</button>
		{/* <button
			className="mt-2 px-12 py-4 bg-white text-teal-500 rounded-lg border border-teal-500"
			onClick={onDisclaimer}
		>
			Create a wallet for my account
		</button> */}
		<a
			href="https://github.com/polkadot-js/extension#installation"
			className="mt-6 text-gray-500"
			target="_blank"
		>
			Install PolkadotJS browser extension
		</a>
	</div>
);

export default IntroPage;
