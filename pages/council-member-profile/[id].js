import dynamic from 'next/dynamic';
import withDashboardLayout from '@components/common/layouts/dashboard';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const CouncilMemberProfileComponent = dynamic(
  () => import('@components/council-member-profile').then(mod => mod.default),
  { ssr: false },
);

const CouncilMemberProfile = () => (
  <Page title="Council Member Profile" layoutProvider={withDashboardLayout}>
    {() => <CouncilMemberProfileComponent />}
  </Page>
);

export default CouncilMemberProfile;
