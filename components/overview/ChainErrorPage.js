const ChainErrorPage = ({ onConfirm }) => {
	return (
		<div className="mx-10 mt-8 mb-20 flex flex-col text-center items-center">
			<img src="/images/polkadot_alert.png" width="200px" />
			<h3 className="mt-4 text-2xl">
				Oops. There was an error processing this staking request
			</h3>
			<span className="mt-1 px-4 text-sm text-gray-500">
				If you think this is an error on our part, please share this with the
				help center and we will do our best to help. We typically respond within
				2-3 days.
			</span>
			{/* <a
                href={`https://polkascan.io/kusama/transaction/${transactionHash}`}
                className="mt-6 text-gray-500"
                target="_blank"
            >
                Track this transaction on PolkaScan
            </a> */}
			<button
				className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
				onClick={onConfirm}
			>
				Retry
			</button>
			<button
				className="mt-8 px-24 py-4 bg-teal-500 text-white rounded-lg"
				onClick={onConfirm}
			>
				Share this with the help center
			</button>
		</div>
	);
};

export default ChainErrorPage;
