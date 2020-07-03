import { useRouter } from "next/router";
import { useState } from "react";
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
	const [selectedTab, setSelectedTab] = useState(ProfileTabsConfig.ACTIVITY);
	console.log(router.query);

	return (
		<div className="px-16 py-16">
			<ValidatorInfoHeader />

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
				<div className="w-2/3 bg-gray-400 mr-4 h-64"></div>
				<div className="w-1/3 flex flex-col">
					<ValidatorKeyStats />
				</div>
			</div>
		</div>
	);
};

export default ValidatorProfile;
