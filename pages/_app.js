import { ThemeProvider, theme } from "@chakra-ui/core";
import '../styles/index.css';

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    teal: {
      ...theme.colors.teal,
      '300': '#45E2E2',
      '500': '#2BCACA',
      '700': '#20B1B1',
    },
    pink: {
      ...theme.colors.pink,
      '300': '#FF9DC0',
      '500': '#FF7CAB',
      '700': '#EF6093',
    },
    orange: {
      ...theme.colors.orange,
      '500': '#F5B100',
    },
  },
};

export default function YieldScanApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={customTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};
