import { Fragment } from "react";

const supportedNetworks = ["kusama", "polkadot"];

const SupportedNetworks = () => {
	return (
		<Fragment>
			<h1 className="text-3xl text-gray-700 font-bold text-center mb-16">
				Networks you can start investing in now
			</h1>
			<div className="flex">
				{supportedNetworks.map((network) => (
					<div className="mx-4 mb-16">
						<img
							src={`/images/${network}-logo.png`}
							alt={`${network}-logo`}
							className="h-16 w-16 rounded-full shadow-custom border border-gray-200"
						/>
						<p className="capitalize text-gray-700 mt-4">{network}</p>
					</div>
				))}
			</div>
		</Fragment>
	);
};

export default SupportedNetworks;
