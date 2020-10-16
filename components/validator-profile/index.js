import axios from "@lib/axios";
import { useRouter } from "next/router";
import { Spinner, useDisclosure } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import { useAccounts, useSelectedNetwork } from "@lib/store";
import TeamMembers from "./TeamMembers";
import ValidatorViz from "./validator-viz/ValidatorViz";
import ProfileTabs from "./ProfileTabs";
import ValidatorKeyStats from "./ValidatorKeyStats";
import ValidatorInfoHeader from "./ValidatorInfoHeader";
import LinkedValidatorsGroup from "./LinkedValidatorsGroup";
import { useWalletConnect } from "@components/wallet-connect";
import EditValidatorProfileModal from "./EditValidatorProfileModal";
import ValidatorReturnsCalculator from "./ValidatorReturnsCalculator";
import { get } from "lodash";
import TransparencyScoreModal from "./TransparencyScoreModal";
import { getNetworkInfo } from "yieldscan.config";

const ProfileTabsConfig = {
	// ACTIVITY: 'Activity',
	VISUALISATION: "Visualisation",
	TEAM: "Team",
};

const ValidatorProfile = () => {
	const router = useRouter();
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const {
		query: { id: validatorStashId },
	} = router;

	const { toggle: toggleWalletConnect } = useWalletConnect();
	const { stashAccount } = useAccounts();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [validatorData, setValidatorData] = useState();
	const [selectedTab, setSelectedTab] = useState(
		ProfileTabsConfig.VISUALISATION
	);

	const { accountInfoLoading } = useAccounts();

	const [editProfileOpen, setEditProfileOpen] = useState();
	const {
		isOpen: scoreModalOpen,
		onClose: closeScoreModal,
		onToggle: toggleScoreModal,
	} = useDisclosure();

	const initData = () => {
		axios
			.get(`/${networkInfo.coinGeckoDenom}/validator/${validatorStashId}`)
			.then(({ data }) => {
				setValidatorData(data);
				// console.log(data);
			})
			.catch(() => {
				setError(true);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		initData();
	}, []);

	if (loading || accountInfoLoading) {
		return (
			<div className="flex-center w-full h-full">
				<div className="flex-center flex-col">
					<Spinner size="xl" color="teal.500" thickness="4px" />
					<span className="text-sm text-gray-600 mt-5">
						Fetching profile...
					</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-center flex-col mt-40">
				<div className="text-4xl">🧐</div>
				<h3>
					Sorry, this validator's info couldn't be fetched! We'll surely look
					into this.
				</h3>
			</div>
		);
	}

	return (
		<div className="px-16 py-16">
			{editProfileOpen ? (
				<>
					<TransparencyScoreModal
						transparencyScore={validatorData.transparencyScores}
						isOpen={scoreModalOpen}
						onClose={closeScoreModal}
						networkInfo={networkInfo}
					/>
					<EditValidatorProfileModal
						stashId={validatorStashId}
						socialInfo={validatorData.socialInfo}
						vision={get(validatorData, "additionalInfo.vision", "")}
						members={get(validatorData, "additionalInfo.members")}
						transparencyScore={validatorData.transparencyScores}
						onSuccess={initData}
						isOpen={editProfileOpen}
						toggleScoreModal={toggleScoreModal}
						goBack={() => setEditProfileOpen(false)}
						networkInfo={networkInfo}
					/>
				</>
			) : (
				<>
					<ValidatorInfoHeader
						stashId={validatorStashId}
						stashAccount={stashAccount}
						socialInfo={validatorData.socialInfo}
						transparencyScore={validatorData.transparencyScores}
						openEditProfile={() => setEditProfileOpen(true)}
						toggleWalletConnect={toggleWalletConnect}
						vision={get(validatorData, "additionalInfo.vision", "")}
						networkInfo={networkInfo}
					/>

					<div className="my-5">
						<div className="flex items-center justify-between">
							<ProfileTabs
								tabs={ProfileTabsConfig}
								selectedTab={selectedTab}
								setSelectedTab={setSelectedTab}
								networkInfo={networkInfo}
							/>
							<LinkedValidatorsGroup
								validators={validatorData.linkedValidators}
								networkInfo={networkInfo}
							/>
						</div>
					</div>

					<div className="flex w-full">
						<div className="w-2/3 mr-4">
							{selectedTab === ProfileTabsConfig.TEAM && (
								<TeamMembers
									members={get(validatorData, "additionalInfo.members", [])}
									networkInfo={networkInfo}
								/>
							)}
							{selectedTab === ProfileTabsConfig.VISUALISATION && (
								<ValidatorViz
									validatorData={validatorData}
									networkName="KUSAMA NETWORK"
									networkInfo={networkInfo}
								/>
							)}
						</div>
						<div className="w-1/3 flex flex-col">
							<div className="mb-2">
								<ValidatorReturnsCalculator
									validatorInfo={validatorData.keyStats}
									networkInfo={networkInfo}
								/>
							</div>
							<ValidatorKeyStats
								stats={validatorData.keyStats}
								networkInfo={networkInfo}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default ValidatorProfile;
