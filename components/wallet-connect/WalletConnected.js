import { useState } from "react";
import { CheckCircle, Circle } from "react-feather";

const WalletConnected = ({ accounts, onStashSelected }) => {
	const [selectedAccount, setSelected] = useState();
	return (
		<div className="mx-10 my-10 flex flex-col items-center">
			<img src="images/polkadot-wallet-connect-success.png" width="100px" />
			<h3 className="mt-4 px-5 text-2xl text-center">Cheers, your wallet is successfully connected.</h3>
			<div className="mt-8 py-3 px-4 rounded-lg">
				<h3 className="text-gray-600 mb-2">As a final step, please select stash account:</h3>
				<div className="mt-1 overflow-y-scroll text-sm accounts-container">
					{accounts.map(account => (
						<div
							key={account.address}
							className={`
								flex items-center rounded-lg border-2 border-teal-500 cursor-pointer px-3 py-2 mb-2
								${selectedAccount === account ? 'text-white bg-teal-500' : 'text-gray-600'}
							`}
							onClick={() => setSelected(account)}
						>
							{selectedAccount === account ? (
								<CheckCircle className="mr-2" />
							) : (
								<Circle className="mr-2" />
							)}
							<div className="flex flex-col">
								<span>{account.meta.name}</span>
								<p>{account.address}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="mt-6 flex justify-end">
				<button
					className={`
						px-12 py-3 text-white rounded-lg
						${selectedAccount ? 'bg-teal-500' : 'bg-gray-400 cursor-not-allowed'}
					`}
					onClick={() => onStashSelected(selectedAccount)}
				>
					Proceed
				</button>
			</div>
			<style jsx>{`
				.accounts-container {
					height: 12.75rem;
				}
			`}</style>
		</div>
	);
};

export default WalletConnected;
