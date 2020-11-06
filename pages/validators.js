import dynamic from "next/dynamic";
import withDashboardLayout from "@components/common/layouts/dashboard";

const Page = dynamic(
	() => import("@components/common/page").then((mod) => mod.default),
	{ ssr: false }
);

const ValidatorsComponent = dynamic(
	() => import("@components/validators").then((mod) => mod.default),
	{ ssr: false }
);

const Payment = () => (
	<Page title="Validators" layoutProvider={withDashboardLayout}>
		{() => <ValidatorsComponent />}
	</Page>
);

export default Payment;
