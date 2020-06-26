import dynamic from 'next/dynamic';
import withDashboardLayout from '@components/common/layouts/dashboard';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const OverviewComponent = dynamic(
  () => import('@components/overview').then(mod => mod.default),
  { ssr: false },
);

const Payment = () => (
  <Page title="Home" layoutProvider={withDashboardLayout}>
    {() => <OverviewComponent />}
  </Page>
);

export default Payment;
