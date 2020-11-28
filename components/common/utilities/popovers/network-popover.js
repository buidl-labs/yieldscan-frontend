import {
	Avatar,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@chakra-ui/core";
import {
	useAccounts,
	useCouncil,
	useNominatorsData,
	usePolkadotApi,
	useSelectedNetwork,
	useValidatorData,
	useOverviewData,
} from "@lib/store";
import { setCookie } from "nookies";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import { getNetworkInfo } from "yieldscan.config";

// TODO: replace this with actual global state
const currentNetwork = "Not Kusama";

const NetworkPopover = ({ isExpanded, hasBorder }) => {
	const { setApiInstance } = usePolkadotApi();
	const { setValidatorMap, setValidators } = useValidatorData();
	const { setUserData, setAllNominations } = useOverviewData();
	const { setNominatorsData, setNomLoading } = useNominatorsData();
	const { setCouncilMembers, setCouncilLoading } = useCouncil();
	const {
		accounts,
		accountsWithBalances,
		stashAccount,
		freeAmount,
		setFreeAmount,
		accountInfoLoading,
		setStashAccount,
		setAccounts,
		setAccountsWithBalances,
		setAccountInfoLoading,
	} = useAccounts();
	const { selectedNetwork, setSelectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const [isNetworkOpen, setIsNetworkOpen] = useState(false);
	return (
		<Popover
			isOpen={isNetworkOpen}
			onClose={() => setIsNetworkOpen(false)}
			// onOpen={() => setIsStashPopoverOpen(true)}
		>
			<PopoverTrigger>
				<button
					className={`relative flex items-center rounded-full  ${
						hasBorder && "border border-gray-300 p-2 px-4"
					} font-semibold text-gray-800 z-20`}
					onClick={(e) => {
						e.preventDefault();
						setIsNetworkOpen(!isNetworkOpen);
					}}
				>
					<img
						src={`/images/${networkInfo.coinGeckoDenom}-logo.png`}
						alt={`${networkInfo.coinGeckoDenom}-logo`}
						className="mr-2 w-6 rounded-full"
					/>
					{isExpanded && <p className="font-normal mr-2">{selectedNetwork}</p>}
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
								setValidators(undefined);
								setUserData(null);
								setAllNominations(null);
								// setNominatorsData(undefined);
								setNomLoading(true);
								setCookie(null, "networkName", "Kusama");
								setCouncilMembers(undefined);
								setCouncilLoading(true);
								setStashAccount(null);
								setFreeAmount(null);
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
								setValidators(undefined);
								setUserData(null);
								setAllNominations(null);
								// setNominatorsData(undefined);
								setNomLoading(true);
								setCookie(null, "networkName", "Polkadot");
								setCouncilMembers(undefined);
								setCouncilLoading(true);
								setStashAccount(null);
								setFreeAmount(null);
								setAccounts(null);
								setAccountsWithBalances(null);
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
	);
};

export default NetworkPopover;
