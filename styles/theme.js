import { extendTheme } from '@chakra-ui/react';

// Add color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

// Add custom primary color
const colors = {
  primary: {
    50: '#FEEFE6',
    100: '#FDD3B9',
    200: '#FCB78C',
    300: '#FB9B5F',
    400: '#FA7F33',
    500: '#F96306',
    600: '#C74F05',
    700: '#963C03',
    800: '#642802',
    900: '#321401'
  }
};

// Extend the theme
const theme = extendTheme({
  styles: {
    global: () => ({
      '#__next': {
        display: 'flex',
        flexDir: 'column',
        minHeight: '100vh'
      },
      '::-webkit-scrollbar': {
        width: '8px',
        bg: '#fff'
      },
      '::-webkit-scrollbar-thumb': {
        bg: '#FA7F33'
      }
    })
  },
  config,
  colors,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700
  }
});

export default theme;
