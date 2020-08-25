import axios from "@lib/axios";
import { useRouter } from "next/router";
import { Spinner, useDisclosure } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import { useAccounts } from "@lib/store";
import TeamMembers from "./TeamMembers";
import ValidatorViz from "./validator-viz/ValidatorViz"
import ProfileTabs from "./ProfileTabs";
import ValidatorKeyStats from "./ValidatorKeyStats";
import ValidatorInfoHeader from "./ValidatorInfoHeader";
import LinkedValidatorsGroup from "./LinkedValidatorsGroup";
import { useWalletConnect } from "@components/wallet-connect";
import EditValidatorProfileModal from "./EditValidatorProfileModal";
import ValidatorReturnsCalculator from "./ValidatorReturnsCalculator";
import { get } from "lodash";
import TransparencyScoreModal from "./TransparencyScoreModal";

const ProfileTabsConfig = {
	// ACTIVITY: 'Activity',
	VISUALISATION: 'Visualisation',
	TEAM: 'Team',
};

const ValidatorProfile = () => {
	const router = useRouter();
	const { query: { id: validatorStashId } } = router;

	const { toggle: toggleWalletConnect } = useWalletConnect();
	const { stashAccount } = useAccounts();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [validatorData, setValidatorData] = useState();
	const [selectedTab, setSelectedTab] = useState(ProfileTabsConfig.VISUALISATION);

	const {
		accountInfoLoading,
	} = useAccounts();

	const {
		isOpen: editProfileModalOpen,
		onClose: closeEditProfileModal,
		onToggle: toggleEditProfileModal,
	} = useDisclosure();
	const {
		isOpen: scoreModalOpen,
		onClose: closeScoreModal,
		onToggle: toggleScoreModal,
	} = useDisclosure();

	const initData = () => {
		axios.get(`validator/${validatorStashId}`).then(({ data }) => {
			setValidatorData(data);
			// console.log(data);
		}).catch(() => {
			setError(true);
		}).finally(() => {
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
				<h3>Sorry, this validator's info couldn't be fetched! We'll surely look into this.</h3>
			</div>
		);
	}

	return (
		<div className="px-16 py-16">
			<TransparencyScoreModal
				isOpen={scoreModalOpen}
				onClose={closeScoreModal}
			/>
			
			<EditValidatorProfileModal
				stashId={validatorStashId}
				socialInfo={validatorData.socialInfo}
				vision={get(validatorData, 'additionalInfo.vision', '')}
				members={get(validatorData, 'additionalInfo.members')}
				onSuccess={initData}
				isOpen={editProfileModalOpen}
				onClose={closeEditProfileModal}
			/>
		
			<ValidatorInfoHeader
				stashId={validatorStashId}
				stashAccount={stashAccount}
				socialInfo={validatorData.socialInfo}
				transparencyScore={validatorData.transparencyScores}
				openEditProfile={toggleEditProfileModal}
				toggleWalletConnect={toggleWalletConnect}
				vision={get(validatorData, 'additionalInfo.vision', '')}
			/>

			<div className="my-5">
				<div className="flex items-center justify-between">
					<ProfileTabs
						tabs={ProfileTabsConfig}
						selectedTab={selectedTab}
						setSelectedTab={setSelectedTab}
					/>
					<LinkedValidatorsGroup validators={validatorData.linkedValidators} />
				</div>
			</div>

			<div className="flex w-full">
				<div className="w-2/3 mr-4">
					{selectedTab === ProfileTabsConfig.TEAM && (
						<TeamMembers members={get(validatorData, 'additionalInfo.members', [])} />
					)}
					{selectedTab === ProfileTabsConfig.VISUALISATION && (
						<ValidatorViz validatorData={validatorData} networkName="KUSAMA NETWORK" />
					)}
				</div>
				<div className="w-1/3 flex flex-col">
					<div className="mb-2">
						<ValidatorReturnsCalculator
							validatorInfo={validatorData.keyStats}
						/>
					</div>
					<ValidatorKeyStats
						stats={validatorData.keyStats}
					/>
				</div>
			</div>
		</div>
	);
};

export default ValidatorProfile;
