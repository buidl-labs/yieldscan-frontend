import { useContext } from "react";
import PolkadotApiContext from "@lib/contexts/polkadot-api";

const HomePage = () => {
	const { apiInstance } = useContext(PolkadotApiContext);

	return (
		<div>
			<h1 className="m-10 text-5xl text-black font-black">
				Welcome to YieldScan!
			</h1>
		</div>
	);
};

export default HomePage;
