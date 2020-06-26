import { useState, useEffect } from "react";
import { Edit2, AlertTriangle } from "react-feather";
import OverviewCards from "./OverviewCards";
import NominationsTable from "./NominationsTable";
import { Spinner } from "@chakra-ui/core";
import axios from "@lib/axios";
import { useAccounts } from "@lib/store";
import { WalletConnectPopover, useWalletConnect } from "@components/wallet-connect";
import { get } from "lodash";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

const Overview = () => {
	const { isOpen, toggle } = useWalletConnect();
	const { stashAccount } = useAccounts();
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState();

	useEffect(() => {
		setLoading(true);
		if (get(stashAccount, 'address')) {
			const kusamaAddress = encodeAddress(decodeAddress(stashAccount.address), 2);
			axios.get(`user/${kusamaAddress}`).then(({ data }) => {
				setUserData(data);
				setLoading(false);
			});
		}
	}, [stashAccount]);

	if (!stashAccount) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<AlertTriangle size="2rem" className="text-orange-500" />
					<span className="text-gray-600 text-lg mb-10">No account connected!</span>
					<button
						className="border border-teal-500 text-teal-500 text-2xl px-3 py-2 rounded-xl"
						onClick={toggle}
					>
						Connect Wallet
					</button>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<Spinner size="xl" />
					<span className="text-sm text-gray-600 mt-5">Fetching your data...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="px-10 py-10">
			<WalletConnectPopover isOpen={isOpen} />
			<OverviewCards />
			<div className="mt-10">
				<div className="flex justify-between items-center">
					<h3 className="text-2xl">My Validators</h3>
					<div className="flex items-center">
						<button className="flex items-center text-gray-500 mr-5 p-1">
							<Edit2 size="20px" className="mr-2" />
							<span>Edit Validators</span>
						</button>
						<button className="text-teal-500 p-1">Claim All Rewards</button>
					</div>
				</div>
				<NominationsTable />
			</div>
		</div>
	);
};

export default Overview;
