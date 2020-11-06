import dynamic from "next/dynamic";
import withBaseLayout from "@components/common/layouts/base";

const Page = dynamic(
	() => import("@components/common/page").then((mod) => mod.default),
	{ ssr: false }
);

const PaymentComponent = dynamic(
	() => import("@components/payment").then((mod) => mod.default),
	{ ssr: false }
);

const Payment = () => (
	<Page title="Payment" layoutProvider={withBaseLayout}>
		{() => <PaymentComponent />}
	</Page>
);

export default Payment;
