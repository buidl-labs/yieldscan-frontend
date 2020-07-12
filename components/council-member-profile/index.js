import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { Spinner, useDisclosure } from "@chakra-ui/core";
import CouncilMemberInfoHeader from "./CouncilMemberInfoHeader";
import ProfileTabs from "@components/validator-profile/ProfileTabs";
import { get } from "lodash";
import CouncilMemberKeyStats from "./CouncilMemberKeyStats";
import EditCouncilMemberProfileModal from "./EditCouncilMemberProfileModal";
import { useAccounts } from "@lib/store";
import { useWalletConnect } from "@components/wallet-connect";

const ProfileTabsConfig = {
	// ACTIVITY: 'Activity',
	VISUALISATION: 'Visualisation',
};

const CouncilMemberProfile = () => {
	const router = useRouter();
	const { query: { id: councilMemberAccountId } } = router;
	const { stashAccount } = useAccounts();
	const { toggle: toggleWalletConnect } = useWalletConnect();

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [memberInfo, setMemberInfo] = useState();
	const [selectedTab, setSelectedTab] = useState(ProfileTabsConfig.VISUALISATION);
	const {
		isOpen: editProfileModalOpen,
		onClose: closeEditProfileModal,
		onToggle: toggleEditProfileModal,
	} = useDisclosure();

	const initData = () => {
		setError(false);
		axios.get(`/council/member/${councilMemberAccountId}`).then(({ data }) => {
			setMemberInfo(data);
		}).catch(() => {
			setError(true);
		}).finally(() => {
			setLoading(false);
		});
	};

	useEffect(() => {
		initData();
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
			<EditCouncilMemberProfileModal
				name={memberInfo.socialInfo.name}
				accountId={councilMemberAccountId}
				isOpen={editProfileModalOpen}
				onClose={closeEditProfileModal}
				onSuccess={initData}
			/>
		
			<CouncilMemberInfoHeader
				name={memberInfo.name}
				vision={memberInfo.vision}
				stashAccount={stashAccount}
				socialInfo={memberInfo.socialInfo}
				accountId={councilMemberAccountId}
				toggleWalletConnect={toggleWalletConnect}
				openEditProfile={toggleEditProfileModal}
			/>

			<div className="my-5">
				<div className="flex items-center justify-between">
					<ProfileTabs
						tabs={ProfileTabsConfig}
						selectedTab={selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				</div>
			</div>

			<div className="flex w-full">
				<div className="w-2/3 mr-4">
					{selectedTab === ProfileTabsConfig.VISUALISATION && (
						<div></div>
					)}
				</div>
				<div className="w-1/3 flex flex-col">
					<CouncilMemberKeyStats
						voters={get(memberInfo, 'backersInfo.length', 0)}
						backingAmount={memberInfo.backing}
						totalBalance={memberInfo.totalBalance}
					/>
				</div>
			</div>
		</div>
	);
};

export default CouncilMemberProfile;
