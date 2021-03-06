import Head from 'next/head';
import { ThemeProvider, createTheme, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { DAppProvider, BSC, BSCTestnet, Polygon, Mumbai } from '@usedapp/core';

import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  const lightTheme = createTheme({
    // Primary - #70c1ff, previous c50a0a
    // Secondary - #48494f
    // Paper/card - #dbf1ff
    mode: 'light',
    palette: {
      background: {
        paper: '#5decff',
      },
      primary: {
        main: '#ff0000',
      },
      secondary: {
        main: '#ff0000',
      },
    },
    typography: {
      fontFamily: [
        'Nunito Sans',
        'Kanit',
        'Merriweather Sans',
        'sans-serif',
        'Segoe UI', 
        'Roboto', 
        'Oxygen',
        'Ubuntu', 
        'Cantarell', 
        'Fira Sans', 
        'Droid Sans', 
        'Helvetica Neue'
      ].join(','),
    },
  });

  const darkTheme = createTheme({
    // Primary - #c50a0a, previous - #1649ff
    // Secondary - #cfcfcf
    // Paper/card - #141a2a
    palette: {
      mode: 'dark',
      background: {
        paper: '#141a2a',
      },
      primary: {
        main: '#c50a0a',
      },
      secondary: {
        main: '#cfcfcf',
      },
    },
    typography: {
      fontFamily: [
        'Nunito Sans',
        'sans-serif',
        'Segoe UI', 
        'Roboto', 
        'Oxygen',
        'Ubuntu', 
        'Cantarell', 
        'Fira Sans', 
        'Droid Sans', 
        'Helvetica Neue'
      ].join(','),
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

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'G-TJSPRD6Y1T');

    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "cxz5yo9w1v");
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
    readOnlyChainId: Polygon.chainId,
    readOnlyUrls: {
      [Polygon.chainID]: 'https://rpc-mainnet.maticvigil.com',
    },
    networks: [BSC, BSCTestnet, Polygon, Mumbai],
  }

  return (
    <ThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
      <DAppProvider config={config}>
        <Head>
          <title>Cardinal House</title>
          <meta name="description" content="Cardinal House - The Best Crypto Community in DeFi" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          {/*<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600&display=swap" rel="stylesheet" />*/}
          <link href="https://fonts.googleapis.com/css2?family=Kanit&family=Merriweather+Sans:wght@500&family=Nunito+Sans:wght@600;800&family=Prompt&display=swap" rel="stylesheet" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-TJSPRD6Y1T"></script>
        </Head>
        <Paper className="mainPaper">
          <Component {...pageProps} useDarkTheme={useDarkTheme} setUseDarkTheme={setUseDarkTheme} />
        </Paper>
      </DAppProvider>
    </ThemeProvider>
  )
}

export default MyApp
