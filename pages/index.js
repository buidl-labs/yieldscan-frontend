import dynamic from "next/dynamic";
import withBaseLayout from "@components/common/layouts/base";

const Page = dynamic(
	() => import("@components/common/page").then((mod) => mod.default),
	{ ssr: false }
);

const HomeComponent = dynamic(
	() => import("@components/home").then((mod) => mod.default),
	{ ssr: false }
);

const HomePage = () => (
	<Page title="Home" layoutProvider={withBaseLayout}>
		{() => <HomeComponent />}
	</Page>
);

export default HomePage;
