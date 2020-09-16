import { ExternalLink } from "react-feather";
const SuccessfullyBonded = ({ transactionHash, onConfirm }) => {
	return (
		<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
			<img src="/images/polkadot-successfully-bonded.png" width="200px" />
			<h3 className="mt-4 text-2xl">
				Your staking request is successfully sent to the network
			</h3>
			<span className="mt-1 px-4 text-sm text-gray-500">
				Your transaction is successfully sent to the network. You can safely
				close this page now. You can view the status of this transaction using
				the link below:
			</span>
			<a
				href={`https://kusama.subscan.io/block/${transactionHash}`}
				className="mt-6 text-blue-400"
				target="_blank"
			>
				Track this transaction on Subscan
			</a>
			<button
				className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
				onClick={onConfirm}
			>
				Continue
			</button>
		</div>
	);
};

export default SuccessfullyBonded;
