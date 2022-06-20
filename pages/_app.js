import Head from 'next/head';
import { ThemeProvider, createTheme, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { DAppProvider, BSC, BSCTestnet, Polygon, Mumbai } from '@usedapp/core';

import Footer from '../components/Footer';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  const lightTheme = createTheme({
    // Primary - #70c1ff
    // Secondary - #48494f
    // Paper/card - #dbf1ff
    mode: 'light',
    palette: {
      background: {
        paper: '#dbf1ff',
      },
      primary: {
        main: '#c50a0a',
      },
      secondary: {
        main: '#c50a0a',
      },
    }
  });

  const darkTheme = createTheme({
    // Primary - #1649ff, previous - #0a0af0
    // Secondary - #cfcfcf
    // Paper/card - #141a2a
    palette: {
      mode: 'dark',
      background: {
        paper: '#141a2a',
      },
      primary: {
        main: '#1649ff',
      },
      secondary: {
        main: '#cfcfcf',
      },
    },
  });

  const [useDarkTheme, setUseDarkTheme] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("cardinalHouseTheme");
    if (theme) {
      if (theme == "light") {
        setUseDarkTheme(false);
      }
      else {
        setUseDarkTheme(true);
      }
    }
    else {
      localStorage.setItem("cardinalHouseTheme", "dark");
    }
  }, [])

  useEffect(() => {
    if (useDarkTheme) {
      localStorage.setItem("cardinalHouseTheme", "dark");
    }
    else {
      localStorage.setItem("cardinalHouseTheme", "light");
    }
  }, [useDarkTheme]);

  const config = {
    readOnlyChainId: BSC.chainID,
    readOnlyUrls: {
      [BSC.chainID]: 'https://bsc-dataseed.binance.org/',
    },
    networks: [BSC, BSCTestnet, Polygon, Mumbai],
  }

  return (
    <ThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
      <DAppProvider config={config}>
        <Head>
          <title>Cardinal House</title>
          <meta name="description" content="Cardinal House" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Paper className="mainPaper">
          <Component {...pageProps} useDarkTheme={useDarkTheme} setUseDarkTheme={setUseDarkTheme} />
          <Footer />
        </Paper>
      </DAppProvider>
    </ThemeProvider>
  )
}

export default MyApp
