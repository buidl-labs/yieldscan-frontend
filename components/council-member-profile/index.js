import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { Spinner } from "@chakra-ui/core";
import CouncilMemberInfoHeader from "./CouncilMemberInfoHeader";
import ProfileTabs from "@components/validator-profile/ProfileTabs";

const ProfileTabsConfig = {
	// ACTIVITY: 'Activity',
	VISUALISATION: 'Visualisation',
};

const CouncilMemberProfile = () => {
	const router = useRouter();
	const { query: { id: councilMemberAccountId } } = router;

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [memberInfo, setMemberInfo] = useState();
	const [selectedTab, setSelectedTab] = useState(ProfileTabsConfig.VISUALISATION);

	useEffect(() => {
		setError(false);
		axios.get(`/council/member/${councilMemberAccountId}`).then(({ data }) => {
			setMemberInfo(data);
		}).catch(() => {
			setError(true);
		}).finally(() => {
			setLoading(false);
		})
	}, []);

	if (loading) {
		return (
			<div className="flex-center flex-col mt-40">
				<Spinner className="text-gray-700 mb-2" />
				<span className="text-gray-600 text-sm">Fetching Council Member Profile...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-center flex-col mt-40">
				<div className="text-4xl">🧐</div>
				<h3>Sorry, this member's info couldn't be fetched! We'll surely look into this.</h3>
			</div>
		);
	}

	return (
		<div className="px-16 py-16">
			{false && <CouncilMemberInfoHeader
				name={memberInfo.name}
			/>}

			<div className="my-5">
				<div className="flex items-center justify-between">
					<ProfileTabs
						tabs={ProfileTabsConfig}
						selectedTab={selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				</div>
			</div>
		</div>
	);
};

export default CouncilMemberProfile;
