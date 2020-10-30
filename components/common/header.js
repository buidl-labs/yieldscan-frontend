import {
	useAccounts,
	useHeaderLoading,
	usePolkadotApi,
	useSelectedNetwork,
	useValidatorData,
	useNominatorsData,
	useCouncil,
} from "@lib/store";
import { get, isNil } from "lodash";
import { setCookie } from "nookies";
import { ChevronDown, Settings, Menu } from "react-feather";
import {
	WalletConnectPopover,
	useWalletConnect,
} from "@components/wallet-connect";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	useDisclosure,
	Avatar,
	Image,
	Spinner,
	IconButton,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Drawer,
} from "@chakra-ui/core";
import Identicon from "@components/common/Identicon";
import EditControllerModal from "@components/overview/EditControllerModal";
import { useEffect, useState } from "react";
import formatCurrency from "@lib/format-currency";
import Routes from "@lib/routes";
import Link from "next/link";
import createPolkadotAPIInstance from "@lib/polkadot-api";
import { getNetworkInfo } from "yieldscan.config";
import { parseCookies } from "nookies";
import SideMenu from "./sidemenu";

// TODO: replace this with actual global state
const currentNetwork = "Not Kusama";

const Header = ({ isBase }) => {
	const cookies = parseCookies();
	const { selectedNetwork, setSelectedNetwork } = useSelectedNetwork();
	const { validatorMap, setValidatorMap } = useValidatorData();
	const { setNominatorsData, setNomLoading } = useNominatorsData();
	const { setCouncilMembers, setCouncilLoading } = useCouncil();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const { setApiInstance } = usePolkadotApi();
	const { isOpen, toggle } = useWalletConnect();
	const {
		accounts,
		accountsWithBalances,
		stashAccount,
		freeAmount,
		accountInfoLoading,
		setStashAccount,
		setAccounts,
		setAccountsWithBalances,
		setAccountInfoLoading,
	} = useAccounts();
	const { headerLoading } = useHeaderLoading();
	const {
		isOpen: editControllerModalOpen,
		onClose: closeEditControllerModal,
		onToggle: toggleEditControllerModal,
	} = useDisclosure();

	const [accountsWithoutCurrent, setAccountsWithoutCurrent] = useState([]);

	const stashAddress = get(stashAccount, "address");

	const [isStashPopoverOpen, setIsStashPopoverOpen] = useState(false);
	const [isNetworkOpen, setIsNetworkOpen] = useState(false);
	const [isBonded, setIsBonded] = useState(false);

	const {
		isOpen: navIsOpen,
		onOpen: navOnOpen,
		onClose: navOnClose,
	} = useDisclosure();
	const btnRef = React.useRef();

	useEffect(() => {
		if (accounts) {
			const accountsWithoutCurrent =
				accountsWithBalances !== null
					? accountsWithBalances.filter(
							(account) => stashAddress && account.address !== stashAddress
					  )
					: accounts.filter(
							(account) => stashAddress && account.address !== stashAddress
					  );
			setAccountsWithoutCurrent(accountsWithoutCurrent);
		}
	}, [stashAccount, networkInfo]);

	useEffect(() => {
		if (
			(!isNil(cookies.kusamaDefault) || !isNil(cookies.polkadotDefault)) &&
			!stashAccount &&
			accounts
		) {
			selectedNetwork == "Kusama"
				? accounts
						.filter((account) => account.address == cookies.kusamaDefault)
						.map((account) => {
							setStashAccount(account);
						})
				: accounts
						.filter((account) => account.address == cookies.polkadotDefault)
						.map((account) => {
							setStashAccount(account);
						});
		}
	}, [accounts]);

	useEffect(() => {
		if (stashAccount) {
			createPolkadotAPIInstance(networkInfo.name).then((api) => {
				setApiInstance(api);
				api.query.staking
					.bonded(stashAccount.address)
					.then(({ isSome }) => {
						setIsBonded(isSome);
					})
					.catch((error) => {
						alert("Something went wrong, please reload!");
					});
			});
		}
	}, [stashAccount, networkInfo]);

	return (
		<div
			className={`header flex items-center justify-between text-gray-700 ${
				!isBase
					? "border border-bottom border-gray-200"
					: "max-w-65-rem xl:px-0"
			} bg-white px-8 py-8 h-12 mx-auto`}
		>
			<WalletConnectPopover isOpen={isOpen} networkInfo={networkInfo} />
			<EditControllerModal
				isOpen={editControllerModalOpen}
				close={closeEditControllerModal}
			/>
			<div className="flex items-center">
				{!isBase && (
					<>
						<IconButton
							ref={btnRef}
							variantColor="gray.600"
							variant="link"
							onClick={navOnOpen}
							icon={Menu}
							_focus={{ boxShadow: "none" }}
							mr={4}
							px={0}
							display={{ base: "inline", xl: "none" }}
						/>
						<Drawer
							isOpen={navIsOpen}
							placement="left"
							onClose={navOnClose}
							finalFocusRef={btnRef}
						>
							<DrawerOverlay />
							<DrawerContent>
								<DrawerCloseButton
									onClick={close}
									boxShadow="0 0 0 0 #fff"
									color="gray.400"
									backgroundColor="gray.100"
									rounded="1rem"
								/>
								<DrawerHeader>
									<Link href="/">
										<a className="flex items-center">
											<Image
												src="/images/yieldscan-logo.svg"
												alt="YieldScan Logo"
											/>
											<span className="ml-2 text-gray-700 font-medium">
												YieldScan
											</span>
										</a>
									</Link>
								</DrawerHeader>

								<DrawerBody px={0}>
									<SideMenu />
								</DrawerBody>

								<DrawerFooter>
									{/* <Button variant="outline" mr={3} onClick={onClose}>
									Cancel
								</Button>
								<Button color="blue">Save</Button> */}
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					</>
				)}
				<Link href="/">
					<a className="flex items-center">
						<Image src="/images/yieldscan-logo.svg" alt="YieldScan Logo" />
						<span className="ml-2 font-medium">YieldScan</span>
					</a>
				</Link>
			</div>
			{!accountInfoLoading && !headerLoading && isBase ? (
				<Link href={Routes.OVERVIEW}>
					<a className="border border-gray-200 rounded-full py-2 px-4">
						Dashboard
					</a>
				</Link>
			) : (
				!accountInfoLoading &&
				!headerLoading && (
					<div className="flex">
						{isNil(accounts) ? (
							<button
								className="rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800 mr-4"
								onClick={toggle}
							>
								Connect Wallet
							</button>
						) : isNil(stashAccount) ? (
							<Popover
								isOpen={isStashPopoverOpen}
								onClose={() => setIsStashPopoverOpen(false)}
								onOpen={() => setIsStashPopoverOpen(true)}
							>
								<PopoverTrigger>
									<button className="rounded-full flex border border-gray-300 p-2 px-4 items-center mr-8">
										Select Account
										<ChevronDown size="20px" className="ml-4" />
									</button>
								</PopoverTrigger>
								<PopoverContent
									zIndex={50}
									maxWidth="20rem"
									backgroundColor="gray.700"
									border="none"
								>
									<p className="text-white text-xxs tracking-widest pt-2 pl-2">
										ACCOUNTS
									</p>
									<div className="flex flex-col justify-center my-2 text-white w-full">
										{accounts.map((account) => (
											<React.Fragment key={account.address}>
												<button
													className="flex items-center rounded px-4 py-2 w-full bg-gray-800 hover:bg-gray-700 hover:text-gray-200"
													onClick={() => {
														setStashAccount(account);
														selectedNetwork == "Kusama"
															? setCookie(
																	null,
																	"kusamaDefault",
																	account.address
															  )
															: setCookie(
																	null,
																	"polkadotDefault",
																	account.address
															  );
														setIsStashPopoverOpen(false);
													}}
												>
													<Identicon address={account.address} size="2rem" />
													<span className="flex flex-col items-start w-1/2 ml-2">
														<span>{account.meta.name}</span>
														{account.balances ? (
															<p className="text-xs text-gray-500">
																{formatCurrency.methods.formatAmount(
																	account.balances.freeBalance.toNumber() +
																		account.balances.reservedBalance.toNumber(),
																	networkInfo
																)}
															</p>
														) : (
															<Spinner />
														)}
													</span>
													<span className="text-xs text-gray-500 w-1/2 text-right">
														{account.address.slice(0, 6) +
															"..." +
															account.address.slice(-6)}
													</span>
												</button>
												{accountsWithoutCurrent[
													accountsWithoutCurrent.length - 1
												] !== account && <hr className="border-gray-700" />}
											</React.Fragment>
										))}
									</div>
								</PopoverContent>
							</Popover>
						) : (
							<Popover
								isOpen={isStashPopoverOpen}
								onClose={() => setIsStashPopoverOpen(false)}
								onOpen={() => setIsStashPopoverOpen(true)}
							>
								<PopoverTrigger>
									<button className="flex items-center mr-8">
										<Identicon address={get(stashAccount, "address")} />
										<div className="cursor-pointer ml-2 text-left">
											<h3 className="flex items-center text-gray-900 -mb-1">
												{get(stashAccount, "meta.name", "")}
											</h3>
											<span className="text-gray-500 text-xs">
												Transferrable:{" "}
												{formatCurrency.methods.formatAmount(
													Math.trunc(
														get(freeAmount, "currency", 0) *
															10 ** networkInfo.decimalPlaces
													),
													networkInfo
												)}
											</span>
										</div>
										<ChevronDown size="20px" className="ml-4" />
									</button>
								</PopoverTrigger>
								<PopoverContent
									zIndex={50}
									maxWidth="20rem"
									backgroundColor="gray.700"
									border="none"
								>
									<p className="text-white text-xxs tracking-widest pt-2 pl-2">
										ACCOUNTS
									</p>
									<div className="flex flex-col justify-center my-2 text-white w-full">
										{accountsWithoutCurrent.map((account) => (
											<React.Fragment key={account.address}>
												<button
													className="flex items-center rounded px-4 py-2 w-full bg-gray-800 hover:bg-gray-700 hover:text-gray-200"
													onClick={() => {
														setStashAccount(account);
														selectedNetwork == "Kusama"
															? setCookie(
																	null,
																	"kusamaDefault",
																	account.address
															  )
															: setCookie(
																	null,
																	"polkadotDefault",
																	account.address
															  );
														setIsStashPopoverOpen(false);
													}}
												>
													<Identicon address={account.address} size="2rem" />
													<span className="flex flex-col items-start w-1/2 ml-2">
														<span>{account.meta.name}</span>
														{account.balances ? (
															<p className="text-xs text-gray-500">
																{formatCurrency.methods.formatAmount(
																	account.balances.freeBalance.toNumber() +
																		account.balances.reservedBalance.toNumber(),
																	networkInfo
																)}
															</p>
														) : (
															<Spinner />
														)}
													</span>
													<span className="text-xs text-gray-500 w-1/2 text-right">
														{account.address.slice(0, 6) +
															"..." +
															account.address.slice(-6)}
													</span>
												</button>
												{accountsWithoutCurrent[
													accountsWithoutCurrent.length - 1
												] !== account && <hr className="border-gray-700" />}
											</React.Fragment>
										))}
									</div>
								</PopoverContent>
							</Popover>
						)}

						<div className="relative">
							<Popover
								isOpen={isNetworkOpen}
								onClose={() => setIsNetworkOpen(false)}
								// onOpen={() => setIsStashPopoverOpen(true)}
							>
								<PopoverTrigger>
									<button
										className="relative flex items-center rounded-full border border-gray-300 p-2 px-4 font-semibold text-gray-800 z-20"
										onClick={() => {
											setIsNetworkOpen(!isNetworkOpen);
										}}
									>
										<img
											src={`/images/${networkInfo.coinGeckoDenom}-logo.png`}
											alt={`${networkInfo.coinGeckoDenom}-logo`}
											className="mr-2 w-6 rounded-full"
										/>
										<ChevronDown size="20px" />
									</button>
								</PopoverTrigger>
								<PopoverContent
									zIndex={50}
									maxWidth="20rem"
									minWidth="8rem"
									backgroundColor="gray.700"
									border="none"
								>
									<p className="text-white text-xxs tracking-widest pt-2 pl-2">
										NETWORKS
									</p>
									<div
										className="py-1"
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="options-menu"
									>
										<button
											className={`flex items-center px-4 py-2 text-white text-sm leading-5 ${
												currentNetwork === "Kusama"
													? "cursor-default bg-gray-600"
													: "hover:bg-gray-700 focus:bg-gray-700"
											}  focus:outline-none w-full`}
											role="menuitem"
											onClick={() => {
												if (selectedNetwork !== "Kusama") {
													setApiInstance(null);
													setValidatorMap(undefined);
													// setNominatorsData(undefined);
													setNomLoading(true);
													setCookie(null, "networkName", "Kusama");
													setCouncilMembers(undefined);
													setCouncilLoading(true);
													setStashAccount(null);
													setAccounts(null);
													setAccountsWithBalances(null);
													setAccountInfoLoading(false);
													setSelectedNetwork("Kusama");
												}
												setIsNetworkOpen(!isNetworkOpen);
											}}
										>
											<Avatar
												name="Kusama"
												src="/images/kusama-logo.png"
												size="sm"
												mr={2}
											/>
											<span>Kusama</span>
										</button>
										<button
											className={`flex items-center px-4 py-2 text-white text-sm leading-5 ${
												currentNetwork === "Polkadot"
													? "cursor-default bg-gray-600"
													: "hover:bg-gray-700 focus:bg-gray-700"
											}  focus:outline-none w-full`}
											role="menuitem"
											onClick={() => {
												if (selectedNetwork !== "Polkadot") {
													setApiInstance(null);
													setValidatorMap(undefined);
													// setNominatorsData(undefined);
													setNomLoading(true);
													setCookie(null, "networkName", "Polkadot");
													setCouncilMembers(undefined);
													setCouncilLoading(true);
													setStashAccount(null);
													setAccounts(null);
													setAccountsWithBalances([]);
													setAccountInfoLoading(false);
													setSelectedNetwork("Polkadot");
												}
												setIsNetworkOpen(!isNetworkOpen);
											}}
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
								</PopoverContent>
							</Popover>
						</div>

						{/* <div className="relative">
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
											className={`flex items-center px-4 py-2 text-white text-sm leading-5 ${
												currentNetwork === "Kusama"
													? "cursor-default bg-gray-600"
													: "hover:bg-gray-700 focus:bg-gray-700"
											}  focus:outline-none w-full`}
											role="menuitem"
											onClick={() => {
												setIsNetworkOpen(!isNetworkOpen);
											}}
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
						</div> */}

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

						{!isNil(stashAccount) && isBonded && (
							<Popover trigger="click">
								<PopoverTrigger>
									<button className="flex items-center ml-5 p-2 font-semibold text-gray-800">
										<Settings size="20px" />
									</button>
								</PopoverTrigger>
								<PopoverContent
									zIndex={50}
									width="12rem"
									backgroundColor="gray.700"
								>
									<div className="flex flex-col items-center justify-center my-2 bg-gray-800 text-white w-full">
										<button
											className="flex items-center px-4 py-2 text-white text-sm leading-5 bg-gray-800 hover:bg-gray-700 focus:outline-none cursor-pointer w-full"
											onClick={toggleEditControllerModal}
										>
											Edit Controller
										</button>
									</div>
								</PopoverContent>
							</Popover>
						)}
					</div>
				)
			)}{" "}
		</div>
	);
};

export default Header;
