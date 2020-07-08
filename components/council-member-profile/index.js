import { useRouter } from "next/router";

const CouncilMemberProfile = () => {
	const router = useRouter();
	const { query: { id: councilMemberAccountId } } = router;
	alert(councilMemberAccountId)
	return (
		<div>
			<h1>Council Profile</h1>
		</div>
	);
};

export default CouncilMemberProfile;
