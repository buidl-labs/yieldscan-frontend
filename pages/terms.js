import dynamic from 'next/dynamic';
import withDocumentationLayout from '@components/common/layouts/documentation';

const Page = dynamic(
  () => import('@components/common/page').then(mod => mod.default),
  { ssr: false },
);

const TermsComponent = dynamic(
  () => import('@components/policies/terms-component').then(mod => mod.default),
  { ssr: false },
);

const Terms = () => (
    <Page title="Terms of service" layoutProvider={withDocumentationLayout}>
    {() => <TermsComponent />}
  </Page>
);

export default Terms;