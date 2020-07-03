import { useRouter } from "next/router";

const ValidatorProfile = () => {
	const router = useRouter();
	console.log(router.query);

	return (
		<div>
			Validator profile
		</div>
	);
};

export default ValidatorProfile;
