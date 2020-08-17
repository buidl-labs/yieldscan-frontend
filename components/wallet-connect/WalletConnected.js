import { useState } from "react";
import { Spinner } from "@chakra-ui/core";
import Identicon from "@components/common/Identicon";
import { get } from "lodash";

const WalletConnected = ({ accounts, onStashSelected, ledgerLoading }) => {
	const [selectedAccount, setSelected] = useState();
	return (
		<div className="mx-6 mb-6 flex flex-col items-center">
			<div className="py-3 self-stretch rounded-lg">
				<div className="mt-1 px-5 py-2 overflow-y-scroll text-sm accounts-container">
					{accounts.map((account) => (
						<div
							key={account.address}
							className={`
								flex items-center rounded-lg border-1 border-gray-200 ${
									selectedAccount === account
										? "border-teal-500 border-2"
										: "border-2 transform hover:scale-105"
								} cursor-pointer px-3 py-2 mb-2 text-gray-600
								transition-all duration-300 ease-in-out
							`}
							onClick={() => setSelected(account)}
						>
							<Identicon address={get(account, "address")} />
							{selectedAccount === account &&
								console.log(get(account, "address"))}
							<div className="ml-2 flex flex-col">
								<p className="text-gray-800 text-base">{account.meta.name}</p>
								<p className="text-xs">{account.address}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="flex justify-end">
				<button
					className={`
						flex items-center px-12 py-3 text-white rounded-lg
						${selectedAccount ? "bg-teal-500" : "bg-gray-400 cursor-not-allowed"}
					`}
					onClick={() => onStashSelected(selectedAccount)}
				>
					<span>Proceed</span>
					{ledgerLoading && <Spinner color="white" className="ml-4" />}
				</button>
			</div>
			<style jsx>{`
				.accounts-container {
					height: 23rem;
				}
			`}</style>
		</div>
	);
};

export default WalletConnected;
