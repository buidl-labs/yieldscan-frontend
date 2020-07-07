const WalletDisclaimer = ({ onCreate }) => (
	<div className="mx-10 my-10 flex flex-col text-center items-center">
		<img src="/images/polkadot-wallet-connect-info.png" width="120px" />
		<h3 className="mt-4 px-5 text-xl">Ensure that you have an account with KSM tokens that can be connect to the PolkaJS Wallet.</h3>
		<button className="mt-10 px-24 py-3 bg-teal-500 text-white rounded-lg" onClick={onCreate}>Yes, Proceed</button>
		<button className="mt-4 px-4 py-3 bg-white text-teal-500 rounded-lg border border-teal-500 mb-12">No, how can I obtain KSM tokens?</button>
	</div>
);

export default WalletDisclaimer;
