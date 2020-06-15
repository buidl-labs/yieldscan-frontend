import dynamic from 'next/dynamic';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const HomeComponent = dynamic(
  () => import('@components/home').then(mod => mod.default),
  { ssr: false },
);

const HomePage = () => (
  <Page title="Home">
    {() => <HomeComponent />}
  </Page>
);

export default HomePage;
