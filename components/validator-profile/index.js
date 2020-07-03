import axios from "@lib/axios";
import { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import { useAccounts } from "@lib/store";
import TeamMembers from "./TeamMembers";
import ProfileTabs from "./ProfileTabs";
import ValidatorKeyStats from "./ValidatorKeyStats";
import ValidatorInfoHeader from "./ValidatorInfoHeader";
import LinkedValidatorsGroup from "./LInkedValidatorsGroup";
import { useWalletConnect } from "@components/wallet-connect";

const ProfileTabsConfig = {
	ACTIVITY: 'Activity',
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
	const [selectedTab, setSelectedTab] = useState(ProfileTabsConfig.ACTIVITY);

	useEffect(() => {
		axios.get(`validator/${validatorStashId}`).then(({ data }) => {
			setValidatorData(data);
		}).catch(() => {
			setError(true);
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	if (loading) {
		return (
			<div className="flex-center flex-col mt-40">
				<Spinner className="text-gray-700 mb-2" />
				<span className="text-gray-600 text-sm">Fetching Validator Profile...</span>
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
			<ValidatorInfoHeader
				stashId={validatorStashId}
				stashAccount={stashAccount}
				socialInfo={validatorData.socialInfo}
				toggleWalletConnect={toggleWalletConnect}
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
						<TeamMembers />
					)}
				</div>
				<div className="w-1/3 flex flex-col">
					<ValidatorKeyStats
						stats={validatorData.keyStats}
					/>
				</div>
			</div>
		</div>
	);
};

export default ValidatorProfile;
