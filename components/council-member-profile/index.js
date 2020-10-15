import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { Spinner, useDisclosure } from "@chakra-ui/core";
import CouncilMemberInfoHeader from "./CouncilMemberInfoHeader";
import ProfileTabs from "@components/validator-profile/ProfileTabs";
import { get } from "lodash";
import CouncilMemberKeyStats from "./CouncilMemberKeyStats";
import EditCouncilMemberProfileModal from "./EditCouncilMemberProfileModal";
import { useAccounts, useSelectedNetwork } from "@lib/store";
import { useWalletConnect } from "@components/wallet-connect";
import CouncilViz from "./council-viz/CouncilViz";
import TeamMembers from "@components/validator-profile/TeamMembers";
import { getNetworkInfo } from "yieldscan.config";
import TransparencyScoreModal from "@components/validator-profile/TransparencyScoreModal";

const ProfileTabsConfig = {
	// ACTIVITY: 'Activity',
	VISUALISATION: "Visualisation",
	TEAM: "Team",
};

const CouncilMemberProfile = () => {
	const router = useRouter();
	const { selectedNetwork } = useSelectedNetwork();
	const networkInfo = getNetworkInfo(selectedNetwork);
	const {
		query: { id: councilMemberAccountId },
	} = router;
	const { stashAccount, accountInfoLoading } = useAccounts();
	const { toggle: toggleWalletConnect } = useWalletConnect();

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [memberInfo, setMemberInfo] = useState();
	const [selectedTab, setSelectedTab] = useState(
		ProfileTabsConfig.VISUALISATION
	);

	const [editProfileOpen, setEditProfileOpen] = useState();

	const {
		isOpen: scoreModalOpen,
		onClose: closeScoreModal,
		onToggle: toggleScoreModal,
	} = useDisclosure();

	const initData = () => {
		setError(false);
		axios
			.get(
				`/${networkInfo.coinGeckoDenom}/council/member/${councilMemberAccountId}`
			)
			.then(({ data }) => {
				setMemberInfo(data);
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
					Sorry, this member's info couldn't be fetched! We'll surely look into
					this.
				</h3>
			</div>
		);
	}

	return (
		<div className="px-16 py-16">
			{editProfileOpen ? (
				<>
					<TransparencyScoreModal
						transparencyScore={memberInfo.transparencyScores}
						isOpen={scoreModalOpen}
						onClose={closeScoreModal}
						networkInfo={networkInfo}
					/>
					<EditCouncilMemberProfileModal
						name={memberInfo.socialInfo.name}
						stashId={councilMemberAccountId}
						vision={get(memberInfo, "additionalInfo.vision", "")}
						members={get(memberInfo, "additionalInfo.members")}
						transparencyScore={memberInfo.transparencyScores}
						onSuccess={initData}
						isOpen={editProfileOpen}
						toggleScoreModal={toggleScoreModal}
						goBack={() => setEditProfileOpen(false)}
						networkInfo={networkInfo}
					/>
				</>
			) : (
				<>
					<CouncilMemberInfoHeader
						name={memberInfo.name}
						vision={get(memberInfo, "additionalInfo.vision", "")}
						stashAccount={stashAccount}
						socialInfo={memberInfo.socialInfo}
						transparencyScore={memberInfo.transparencyScores}
						stashId={councilMemberAccountId}
						toggleWalletConnect={toggleWalletConnect}
						openEditProfile={() => setEditProfileOpen(true)}
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
						</div>
					</div>

					<div className="flex w-full">
						<div className="w-2/3 mr-4">
							{selectedTab === ProfileTabsConfig.TEAM && (
								<TeamMembers
									members={get(memberInfo, "additionalInfo.members", [])}
								/>
							)}
							{selectedTab === ProfileTabsConfig.VISUALISATION && (
								<CouncilViz
									memberInfo={memberInfo}
									networkName="KUSAMA COUNCIL"
									networkInfo={networkInfo}
								/>
							)}
						</div>
						<div className="w-1/3 flex flex-col">
							<CouncilMemberKeyStats
								voters={get(memberInfo, "backersInfo.length", 0)}
								backingAmount={memberInfo.backing}
								totalBalance={memberInfo.totalBalance}
								networkInfo={networkInfo}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default CouncilMemberProfile;
