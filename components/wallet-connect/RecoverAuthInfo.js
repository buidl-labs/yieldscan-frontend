const RecoverAuthInfo = () => (
	<div className="pb-12 flex flex-col text-center items-center">
		<img src="/images/polkadot-wallet-connect.png" width="200px" />
		<h3 className="mt-4 text-xl font-semibold px-20 text-gray-700 max-w-md">
			Instructions for PolkadotJS permission recovery
		</h3>
		<p className="mt-4 px-4 text-xs text-gray-600">
			Currently the PolkadotJS extension doesn't have support for permission
			management.<br /><br /> As a workaround, please <span className="text-gray-700 font-medium">restart your browser</span>{" "}
			after quitting it and revisit this page to proceed with the authorization.
		</p>
	</div>
);

export default RecoverAuthInfo;
