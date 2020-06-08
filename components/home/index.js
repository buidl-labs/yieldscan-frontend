import { useContext } from "react";
import PolkadotApiContext from "@lib/contexts/polkadot-api";
import PolkadotExtensionContext from "@lib/contexts/polkadot-extension";

const HomePage = () => {
	const { apiInstance } = useContext(PolkadotApiContext);
	const { isExtensionAvailable, accounts } = useContext(PolkadotExtensionContext);

	console.log(isExtensionAvailable, accounts);

	return (
		<div>
			<h1 className="m-10 text-5xl text-black font-black">
				Welcome to YieldScan!
			</h1>
		</div>
	);
};

export default HomePage;
