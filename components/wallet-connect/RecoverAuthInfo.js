const RecoverAuthInfo = () => (
	<div className="pb-12 flex flex-col text-center items-center">
		<img src="/images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-xl font-semibold px-20 text-gray-700">
			Instructions for PolkadotJS permission recovery
		</h3>
		<span className="mt-4 px-4 text-xs text-gray-600">
			Currently the PolkadotJS extension doesn't have support for permission
			management. As a workaround, please restart your browser after quitting it
			and revisit this page to proceed with the authorization.
		</span>
	</div>
);

export default RecoverAuthInfo;
