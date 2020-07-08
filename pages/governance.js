import dynamic from 'next/dynamic';
import withDashboardLayout from '@components/common/layouts/dashboard';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const GovernancePage = dynamic(
  () => import('@components/governance').then(mod => mod.default),
  { ssr: false },
);

const Governance = () => (
  <Page title="Governance" layoutProvider={withDashboardLayout}>
    {() => <GovernancePage />}
  </Page>
);

export default Governance;
