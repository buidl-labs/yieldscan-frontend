import dynamic from "next/dynamic";
import withDashboardLayout from "@components/common/layouts/dashboard";

const Page = dynamic(
	() => import("@components/common/page").then((mod) => mod.default),
	{ ssr: false }
);

const NominatorsComponent = dynamic(
	() => import("@components/nominators").then((mod) => mod.default),
	{ ssr: false }
);

const Nominators = () => (
	<Page title="Nominators" layoutProvider={withDashboardLayout}>
		{() => <NominatorsComponent />}
	</Page>
);

export default Nominators;
