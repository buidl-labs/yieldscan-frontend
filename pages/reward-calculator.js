import dynamic from 'next/dynamic';
import withDashboardLayout from '@components/common/layouts/dashboard';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const RewardCalculatorComponent = dynamic(
  () => import('@components/reward-calculator').then(mod => mod.default),
  { ssr: false },
);

const RewardCalculator = () => (
  <Page title="Home" layoutProvider={withDashboardLayout}>
    {() => <RewardCalculatorComponent />}
  </Page>
);

export default RewardCalculator;
