import { useState, useEffect } from "react";
import { Edit2, AlertTriangle } from "react-feather";
import OverviewCards from "./OverviewCards";
import NominationsTable from "./NominationsTable";
import { Spinner, useDisclosure } from "@chakra-ui/core";
import axios from "@lib/axios";
import { useAccounts } from "@lib/store";
import { useWalletConnect } from "@components/wallet-connect";
import { get } from "lodash";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import RewardDestinationModal from "./RewardDestinationModal";
import EditControllerModal from "./EditControllerModal";
import FundsUpdate from "./FundsUpdate";
import EditValidators from "./EditValidators";

const Overview = () => {
	const { toggle } = useWalletConnect();
	const { stashAccount, bondedAmount } = useAccounts();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [userData, setUserData] = useState();
	const [fundsUpdateModalType, setFundsUpdateModalType] = useState();
	const {
		isOpen: isRewardDestinationModalOpen,
		onToggle: toggleRewardDestinationModal,
		onClose: closeRewardDestinationModal,
	} = useDisclosure();
	const {
		isOpen: editControllerModalOpen,
		onToggle: toggleEditControllerModal,
		onClose: closeEditControllerModal,
	} = useDisclosure();
	const {
		isOpen: fundsUpdateModalOpen,
		onToggle: toggleFundsUpdateModal,
		onClose: closeFundsUpdateModal,
	} = useDisclosure();
	const {
		isOpen: editValidatorModalOpen,
		onToggle: toggleEditValidatorsModal,
		onClose: closeEditValidatorsModal,
	} = useDisclosure();
	

	useEffect(() => {
		setLoading(true);
		if (get(stashAccount, 'address')) {
			const kusamaAddress = encodeAddress(decodeAddress(stashAccount.address), 2);
			axios.get(`user/${kusamaAddress}`).then(({ data }) => {
				if (data.message === 'No data found!') setError(true);
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

	if (error) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<AlertTriangle size="2rem" className="text-orange-500" />
					<span className="font-semibold text-red-600 text-lg mb-10">You Unlucky bro, no data for you! 😭</span>
					<span className="text-sm text-gray-600 mt-5">Try changing the stash account.</span>
				</div>
			</div>
		);
	}

	const onEditController = () => {
		closeRewardDestinationModal();
		toggleEditControllerModal();
	};

	const openFundsUpdateModal = (type) => {
		setFundsUpdateModalType(type);
		toggleFundsUpdateModal();
	};

	return (
		<div className="px-10 py-10">
			<RewardDestinationModal
				isOpen={isRewardDestinationModalOpen}
				close={closeRewardDestinationModal}
				onEditController={onEditController}
			/>
			<EditControllerModal
				isOpen={editControllerModalOpen}
				close={closeEditControllerModal}
			/>
			<FundsUpdate
				isOpen={fundsUpdateModalOpen}
				close={closeFundsUpdateModal}
				type={fundsUpdateModalType}
				validators={userData.validatorsInfo}
				bondedAmount={bondedAmount}
			/>
			<EditValidators
				isOpen={editValidatorModalOpen}
				close={closeEditValidatorsModal}
				currentValidators={userData.validatorsInfo}
			/>
			<OverviewCards
				stats={userData.stats}
				bondFunds={() => openFundsUpdateModal('bond')}
				unbondFunds={() => openFundsUpdateModal('unbond')}
				openRewardDestinationModal={toggleRewardDestinationModal}
			/>
			<div className="mt-10">
				<div className="flex justify-between items-center">
					<h3 className="text-2xl">My Validators</h3>
					<div className="flex items-center">
						<button className="flex items-center text-gray-500 mr-5 p-1" onClick={toggleEditValidatorsModal}>
							<Edit2 size="20px" className="mr-2" />
							<span>Edit Validators</span>
						</button>
						<button className="text-teal-500 p-1">Claim All Rewards</button>
					</div>
				</div>
				<NominationsTable validators={userData.validatorsInfo} />
			</div>
		</div>
	);
};

export default Overview;
