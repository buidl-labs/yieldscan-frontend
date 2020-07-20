import { useAccounts } from "@lib/store";
import { get, isNil } from "lodash";
import { ChevronDown, Settings } from "react-feather";
import { WalletConnectPopover, useWalletConnect } from "@components/wallet-connect";
import { Popover, PopoverArrow, PopoverTrigger, PopoverContent } from "@chakra-ui/core";

const Header = () => {
	const { isOpen, toggle } = useWalletConnect();
	const { accounts, stashAccount, freeAmount, setStashAccount } = useAccounts();

	const stashAddress = get(stashAccount, 'address');
	const accountsWithoutCurrent = accounts.filter(account => stashAddress && account.address !== stashAddress);

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
					<Popover trigger="hover">
						<PopoverTrigger>
							<div className="cursor-pointer">
								<h3 className="flex items-center text-gray-800">
									{get(stashAccount, 'meta.name', '')}
									<ChevronDown size="20px" className="ml-1" />
								</h3>
								<span className="text-gray-500 text-xs">Balance: {get(freeAmount, 'currency', 0)} KSM</span>
							</div>
						</PopoverTrigger>
						<PopoverContent zIndex={50} width="16rem" backgroundColor="gray.900">
							<PopoverArrow />
							<div className="flex flex-col items-center justify-center my-2 bg-gray-900 text-white w-full">
								{accountsWithoutCurrent.map(account => (
									<button
										key={account.address}
										className="rounded px-5 py-1 w-56 truncate hover:bg-gray-600 hover:text-gray-200"
										onClick={() => setStashAccount(account)}
									>
										{account.meta.name}
									</button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				)}

				<Popover>
					<PopoverTrigger>
						<button className="flex items-center rounded-full border border-gray-300 p-2 px-4 ml-10 font-semibold text-gray-800">
							<img src="/images/kusama-logo.png" alt="kusama-logo" className="mr-2 w-6" />
							<ChevronDown size="20px" />
						</button>
					</PopoverTrigger>
					<PopoverContent zIndex={50}>
						<div className="text-gray-600 text-sm p-4">
							<div className="flex items-center justify-between">
								<p>Current Network: <b>Kusama</b></p>
								<button hidden className="text-blue-500 p-1">Change</button>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				<Popover trigger="hover">
					<PopoverTrigger>
						<button className="flex items-center ml-5 p-2 font-semibold text-gray-800">
							<Settings size="20px" />
						</button>
					</PopoverTrigger>
					<PopoverContent zIndex={50} width="12rem" backgroundColor="gray.900">
							<div className="flex flex-col items-center justify-center my-2 bg-gray-900 text-white w-full">
								<button
									className="w-full rounded px-5 py-1 w-56 truncate hover:bg-gray-600 hover:text-gray-200"
								>
									Edit Controller
								</button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default Header;
