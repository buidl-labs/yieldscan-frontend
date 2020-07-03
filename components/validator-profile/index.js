import axios from "@lib/axios";
import { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import TeamMembers from "./TeamMembers";
import ProfileTabs from "./ProfileTabs";
import ValidatorKeyStats from "./ValidatorKeyStats";
import ValidatorInfoHeader from "./ValidatorInfoHeader";
import LinkedValidatorsGroup from "./LInkedValidatorsGroup";

const ProfileTabsConfig = {
	ACTIVITY: 'Activity',
	VISUALISATION: 'Visualisation',
	TEAM: 'Team',
};

const ValidatorProfile = () => {
	const router = useRouter();
	const { query: { id: validatorStashId } } = router;

	const [loading, setLoading] = useState(true);
	const [validatorData, setValidatorData] = useState();
	const [selectedTab, setSelectedTab] = useState(ProfileTabsConfig.ACTIVITY);

	useEffect(() => {
		axios.get(`validator/${validatorStashId}`).then(({ data }) => {
			setValidatorData(data);
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

	return (
		<div className="px-16 py-16">
			<ValidatorInfoHeader
				stashId={validatorStashId}
				socialInfo={validatorData.socialInfo}
			/>

			<div className="my-5">
				<div className="flex items-center justify-between">
					<ProfileTabs
						tabs={ProfileTabsConfig}
						selectedTab={selectedTab}
						setSelectedTab={setSelectedTab}
					/>
					<LinkedValidatorsGroup />
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
