import dynamic from 'next/dynamic';
import withDashboardLayout from '@components/common/layouts/dashboard';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const HomeComponent = dynamic(
  () => import('@components/home').then(mod => mod.default),
  { ssr: false },
);

const HomePage = () => (
  <Page title="Home" layoutProvider={withDashboardLayout}>
    {() => <HomeComponent />}
  </Page>
);

export default HomePage;
