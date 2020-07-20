import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Routes from '@lib/routes';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const HomeComponent = dynamic(
  () => import('@components/home').then(mod => mod.default),
  { ssr: false },
);

const HomePage = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace(Routes.CALCULATOR);
  }, []);

  return (
    <Page title="Home">
      {() => <div hidden className="p-5">Welcome to YieldScan, redirecting to calculator...</div>}
    </Page>
  );
};

export default HomePage;
