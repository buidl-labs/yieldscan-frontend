import { useAccounts } from "@lib/store";
import { get, isNil } from "lodash";
import { ChevronDown } from "react-feather";
import { WalletConnectPopover, useWalletConnect } from "@components/wallet-connect";
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/core";

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

				<Popover>
					<PopoverTrigger>
						<button className="flex items-center rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800">
							<img src="images/kusama-logo.png" alt="kusama-logo" className="mr-2 w-6" />
							<ChevronDown size="20px" />
						</button>
					</PopoverTrigger>
					<PopoverContent zIndex={50}>
						<div className="text-gray-600 text-sm p-4">
							<div className="flex items-center justify-between">
								<p>Current Network: <b>Kusama</b></p>
								<button className="text-blue-500 p-1">Change</button>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default Header;
