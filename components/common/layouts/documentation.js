import dynamic from "next/dynamic";
import Footer from "../footer";

const Header = dynamic(
	() => import("@components/common/header").then((mod) => mod.default),
	{ ssr: false }
);

const withDocumentationLayout = (children) => {
	return () => (
		<div>
			<Header isBase />
			<div className="flex justify-center w-full">
				<div className="documentation">{children()}</div>
			</div>
			<Footer />
		</div>
	);
};

export default withDocumentationLayout;
