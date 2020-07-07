import dynamic from 'next/dynamic';
import withDashboardLayout from '@components/common/layouts/dashboard';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const ValidatorProfileComponent = dynamic(
  () => import('@components/validator-profile').then(mod => mod.default),
  { ssr: false },
);

const Payment = () => (
  <Page title="Validator Profile" layoutProvider={withDashboardLayout}>
    {() => <ValidatorProfileComponent />}
  </Page>
);

export default Payment;
