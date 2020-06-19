import { useAccounts } from "@lib/store";
import { get, isNil } from "lodash";
import { ChevronRight } from "react-feather";
import { WalletConnectPopover, useWalletConnect } from "@components/wallet-connect";

const Header = () => {
	const { isOpen, toggle } = useWalletConnect();
	const { stashAccount, freeAmount } = useAccounts();

	return (
		<div className="flex items-center justify-between border border-bottom border-gray-200 bg-white p-8 h-12">
			<WalletConnectPopover isOpen={isOpen} />
			<div>
				<span className="text-lg text-black">YieldScan</span>
			</div>
			<div className="flex items-center mr-16">
				{isNil(stashAccount) ? (
					<button
						className="rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800 mr-2"
						onClick={toggle}
					>
						Connect Wallet
					</button>
				) : (
					<div>
						<h3 className="text-gray-800">{get(stashAccount, 'meta.name', '')}</h3>
						<span className="text-gray-500 text-xs">Balance: {get(freeAmount, 'currency', 0)} KSM</span>
					</div>
				)}

				<button hidden className="rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800">
					<ChevronRight />
				</button>
			</div>
		</div>
	);
};

export default Header;
