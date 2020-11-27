const IntroPage = ({ onConnected, onDisclaimer }) => (
	<div className="pb-12 flex flex-col text-center items-center">
		<img src="/images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-xl font-semibold px-20 text-gray-700">
			Connect to the PolkadotJS browser extension
		</h3>
		<span className="mt-4 px-4 text-xs text-gray-600">
			PolkadotJS extension is a simple browser extension for managing your
			accounts. It allows you to securely sign transactions using these accounts
			while maintaining complete control over your funds.
		</span>
		<span className="mt-4 px-4 text-xs text-gray-700 font-semibold">
			Extension not installed?
		</span>
		<a
			className="mt-2 px-16 py-3 bg-teal-500 text-white rounded-full"
			href="https://github.com/polkadot-js/extension#installation"
			target="_blank"
		>
			Install extension
		</a>
		<span className="mt-4 px-4 text-xl text-gray-700 font-semibold">or</span>
		<span className="mt-4 px-4 text-xs text-gray-700 font-semibold">
			Accidently rejected the request for permission?
		</span>
		<span className="mt-2 px-4 text-sm text-gray-700">
			Try restarting your browser or you can also toggle the extension on/off
			from browser's extension settings.
		</span>
		{/* <button
			className="mt-2 px-12 py-4 bg-white text-teal-500 rounded-lg border border-teal-500"
			onClick={onDisclaimer}
		>
			Create a wallet for my account
		</button> */}
		<span className="mt-4 text-sm text-gray-600">
			Using a different wallet?{" "}
			<a
				className="text-gray-700 font-semibold"
				href="https://yieldscan.upvoty.com/b/yieldscan/"
				target="_blank"
			>
				Request feature
			</a>
		</span>
	</div>
);

export default IntroPage;
