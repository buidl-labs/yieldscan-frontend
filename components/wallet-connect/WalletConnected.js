const WalletConnected = () => (
	<div className="mx-10 my-10 flex flex-col text-center items-center">
		<img src="images/polkadot-wallet-connect-success.png" width="100px" />
		<h3 className="mt-4 px-5 text-2xl">Cheers, your wallet is successfully connected.</h3>
		<h3 className="mt-10 text-2xl font-semibold">Import your account</h3>
		<span className="mt-1 px-4 text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
		<div className="mt-16 flex justify-end">
			<button className="px-6 py-3 mr-4 bg-white text-teal-500 rounded-lg border border-teal-500">Create an account</button>
			<button className="px-12 py-3 bg-teal-500 text-white rounded-lg">Proceed</button>
		</div>
	</div>
);

export default WalletConnected;
