import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/styles/theme';

import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({ ...awsconfig, ssr: true });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
