import { useAccounts } from "@lib/store";
import { get, isNil } from "lodash";
import { ChevronDown, Settings, Menu } from "react-feather";
import { WalletConnectPopover, useWalletConnect } from "@components/wallet-connect";
import { Popover, PopoverArrow, PopoverTrigger, PopoverContent, useDisclosure, Avatar } from "@chakra-ui/core";
import EditControllerModal from "@components/overview/EditControllerModal";
import { useState, useEffect } from "react";

// TODO: replace this with actual global state
const currentNetwork = "Not Kusama"

const Header = () => {
	const { isOpen, toggle } = useWalletConnect();
	const { accounts, stashAccount, freeAmount, setStashAccount } = useAccounts();
	const {
		isOpen: editControllerModalOpen,
		onClose: closeEditControllerModal,
		onToggle: toggleEditControllerModal,
	} = useDisclosure();

	const stashAddress = get(stashAccount, 'address');
	const accountsWithoutCurrent = accounts.filter(account => stashAddress && account.address !== stashAddress);

	const [isNetworkOpen, setIsNetworkOpen] = useState(false);

	const handleEscape = e => {
		if (e.key === 'Esc' || e.key === 'Escape') {
			setIsNetworkOpen(false);
		}
	}

	return (
		<div className="flex items-center justify-between border border-bottom border-gray-200 bg-white p-8 h-12">
			<WalletConnectPopover isOpen={isOpen} />
			<EditControllerModal
				isOpen={editControllerModalOpen}
				close={closeEditControllerModal}
			/>
			<div>
				<span className="text-lg text-black">YieldScan</span>
			</div>
			<div className="flex">
				{isNil(stashAccount) ? (
					<button
						className="rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800 mr-4"
						onClick={toggle}
					>
						Connect Wallet
					</button>
				) : (
					<Popover trigger="hover">
						<PopoverTrigger>
							<div className="cursor-pointer">
								<h3 className="flex items-center text-gray-800">
									{get(stashAccount, "meta.name", "")}
									<ChevronDown size="20px" className="ml-1" />
								</h3>
								<span className="text-gray-500 text-xs">
									Balance: {get(freeAmount, "currency", 0)} KSM
								</span>
							</div>
						</PopoverTrigger>
						<PopoverContent
							zIndex={50}
							width="16rem"
							backgroundColor="gray.900"
						>
							<PopoverArrow />
							<div className="flex flex-col items-center justify-center my-2 bg-gray-900 text-white w-full">
								{accountsWithoutCurrent.map((account) => (
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

				<div className="relative">
					<button
						className="relative flex items-center rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800 z-20"
						onClick={() => {
							setIsNetworkOpen(!isNetworkOpen);
						}}
					>
						<img
							src="/images/kusama-logo.png"
							alt="kusama-logo"
							className="mr-2 w-6"
						/>
						<ChevronDown size="20px" />
					</button>
					<button
						onClick={() => {
							setIsNetworkOpen(false);
						}}
						className="fixed top-0 right-0 bottom-0 left-0 h-full w-full cursor-default z-10"
						tabIndex={-1}
						hidden={!isNetworkOpen}
					></button>
					<div
						className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg z-20"
						hidden={!isNetworkOpen}
					>
						<div className="rounded-md bg-gray-800 shadow-xs">
							<p className="text-white text-xxs tracking-widest pt-2 pl-2">
								NETWORK
							</p>
							<div
								className="py-1"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="options-menu"
							>
								<button
									href="#"
									className={`flex items-center px-4 py-2 text-white text-sm leading-5 ${
										currentNetwork === "Kusama" ? "cursor-default bg-gray-600" : "hover:bg-gray-700 focus:bg-gray-700"
									}  focus:outline-none w-full`}
									role="menuitem"
								>
									<Avatar
										name="Kusama"
										src="/images/kusama-logo.png"
										size="sm"
										mr={2}
									/>
									<span>Kusama</span>
								</button>
							</div>
							<p className="text-white text-xxs tracking-widest pt-2 pl-2">
								COMING SOON
							</p>
							<div
								className="py-1"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="options-menu"
							>
								<button
									href="#"
									className="flex items-center px-4 py-2 text-white text-sm leading-5 bg-gray-900 focus:outline-none cursor-default w-full"
									role="menuitem"
								>
									<Avatar
										name="Polkadot"
										src="/images/polkadot-logo.png"
										size="sm"
										mr={2}
									/>
									<span>Polkadot</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* <Popover placement="bottom-start">
					<PopoverTrigger>
						<button className="flex items-center rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800">
							<img src="/images/kusama-logo.png" alt="kusama-logo" className="mr-2 w-6" />
							<ChevronDown size="20px" />
						</button>
					</PopoverTrigger>
					<PopoverContent zIndex={50}>
						<div className="text-white bg-gray-800 text-sm p-4">
							<div className="flex items-center justify-between">
								<p>Current Network: <b>Kusama</b></p>
							</div>
						</div>
					</PopoverContent>
				</Popover> */}

				{!isNil(stashAccount) && (
					<Popover trigger="hover">
						<PopoverTrigger>
							<button className="flex items-center ml-5 p-2 font-semibold text-gray-800">
								<Settings size="20px" />
							</button>
						</PopoverTrigger>
						<PopoverContent
							zIndex={50}
							width="12rem"
							backgroundColor="gray.900"
						>
							<div className="flex flex-col items-center justify-center my-2 bg-gray-900 text-white w-full">
								<button
									className="w-full rounded px-5 py-1 w-56 truncate hover:bg-gray-600 hover:text-gray-200"
									onClick={toggleEditControllerModal}
								>
									Edit Controller
								</button>
							</div>
						</PopoverContent>
					</Popover>
				)}
			</div>
		</div>
	);
};

export default Header;
