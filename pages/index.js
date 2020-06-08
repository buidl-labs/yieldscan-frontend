import dynamic from 'next/dynamic';
import Page from '@components/common/page';
import withDashboardLayout from '@components/common/layouts/dashboard';

const HomeComponent = dynamic(
  () => import('@components/home').then(mod => mod.default)
);

const HomePage = () => (
  <Page title="Home" layoutProvider={withDashboardLayout}>
    {() => <HomeComponent />}
  </Page>
);

export default HomePage;
