import Image from 'next/image';
import { Typography, Button, Drawer, Toolbar, List, Divider, Grid, Tooltip,
    ListItem, ListItemIcon, ListItemText, CssBaseline, IconButton, Switch, dividerClasses } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import clsx from 'clsx';
import { useState, useEffect } from "react";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useCoingeckoPrice } from '@usedapp/coingecko'
import { constants, ethers } from "ethers";
import WalletConnectProvider from '@walletconnect/web3-provider'
import { FaInfoCircle, FaCrown } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { MdCardMembership } from "react-icons/md";

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import ServicesInfo from "../components/ServicesInfo";
import OriginalCardinalNFT from "../components/OriginalCardinalNFT";
import MembershipNFT from "../components/MembershipNFT";
import styles from '../styles/DApp.module.css';
import CardinalToken from "../contracts/CardinalToken.json";
import chainConfig from "../chain-config.json";
import metaMaskLogo from '../public/MetaMask.png';
import walletConnectLogo from '../public/WalletConnect.png';

const drawerWidth = 240;

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

const networkData = [
    {
      chainId: "0x38",
      chainName: "BSCMAINET",
      rpcUrls: ["https://bsc-dataseed1.binance.org"],
      nativeCurrency: {
        name: "BINANCE COIN",
        symbol: "BNB",
        decimals: 18,
      },
      blockExplorerUrls: ["https://bscscan.com/"],
    },
];

const rpcEndpoint = "https://bsc-dataseed.binance.org/";
const binanceChainId = 56;

export default function DApp(props) {
    const theme = useTheme();

    const { account, activateBrowserWallet, deactivate, chainId } = useEthers();
    const networkName = "bsctest";
    const CardinalTokenAddress = chainId ? chainConfig["CardinalTokenAddresses"][networkName] : constants.AddressZero
    const tokenBalance = useTokenBalance(CardinalTokenAddress, account);
    // const tokenPriceCG = useCoingeckoPrice('cardinal-house', 'usd');
    const isConnected = account !== undefined;

    const [currPage, setCurrPage] = useState("Services");
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showWalletConnectionFailed, setShowWalletConnectionFailed] = useState(false);
    const [showWrongNetwork, setShowWrongNetwork] = useState(false);
    const [tempTokenBalance, setTempTokenBalance] = useState(0);
    const [tokenPricePercentChange, setTokenPricePercentChange] = useState(0.0);

    if (account && chainId != "97" && chainId != 97 && !showWrongNetwork) {
        console.log("test")
        setShowWrongNetwork(true);
        window.ethereum.request({

            method: "wallet_addEthereumChain",
        
            params: networkData,
        
          });
    }

    /*
    async function updateTempTokenBalance() {
        const chesABI = CHESToken.abi;
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: binanceChainId });
        const CHESContract = new ethers.Contract(CHESAddress, chesABI, provider);
        const userBalance = await CHESContract.balanceOf(account);
        setTempTokenBalance(userBalance);
    }
    
    useEffect(() => {
        if (account && (chainId == 56 || chainId == "56")) {
            updateTempTokenBalance();
        }
    }, [chainId])
    */

    const handleDrawerOpen = () => {
        setNavDrawerOpen(true);
    };
    
      const handleDrawerClose = () => {
        setNavDrawerOpen(false);
    };

    const connectBrowserWallet = () => {
        try {
            activateBrowserWallet();
        }
        catch {
            setShowWalletConnectionFailed(true);
        }
        if (!window.ethereum) {
            setShowWalletConnectionFailed(true);
        }
        setIsConnecting(false);
    }

    async function activateWalletConnect() {
        try {
          const provider = new WalletConnectProvider({
            infuraId: '7ef885ccab1e40919b0e4e5b37df9fb2',
          })
          await provider.enable()
          await activate(provider)
        } catch (error) {
          console.error(error)
        }
      }

    const updatePage = (pageName, hash) => {
        setCurrPage(pageName);
        window.location.hash = hash;
        window.scroll(0,0);
    }

    const updatePageWithHashChange = () => {
        const hash = window.location.hash;
        
        if (hash == "#services") {
            setCurrPage("Services");
        }
        else if (hash == "#originalcardinalnft") {
            setCurrPage("OriginalCardinalNFT");
        }
        else if (hash == "#membership") {
            setCurrPage("MembershipNFT");
        }
    }

    useEffect(() => {
        updatePageWithHashChange();

        window.onhashchange = function() {
            updatePageWithHashChange();
        }
    }, [])

    /*
    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/chain-estate-dao')
        .then(response => response.json())
        .then(tokenInfo => setTokenPricePercentChange(parseFloat(tokenInfo.market_data.price_change_percentage_24h).toFixed(2)));
    }, [tokenPriceCG])
    */

    return (
        <div>
            <CssBaseline />

            <Snackbar open={showWalletConnectionFailed} autoHideDuration={6000} onClose={() => {setShowWalletConnectionFailed(false)}}>
                <MuiAlert elevation={6} variant="filled" onClose={() => {setShowWalletConnectionFailed(false)}} severity="error" sx={{ width: '100%' }} >
                    Failed to connect web3 wallet. Make sure you have a browser wallet like MetaMask installed.
                </MuiAlert>
            </Snackbar>
            <Snackbar open={false && showWrongNetwork} autoHideDuration={6000} onClose={() => {setShowWrongNetwork(false)}}>
                <MuiAlert elevation={6} variant="filled" onClose={() => {setShowWrongNetwork(false)}} severity="error" sx={{ width: '100%' }} >
                    Failed to connect web3 wallet - wrong network. Please connect to the Polygon Mainnet and refresh the page.
                </MuiAlert>
            </Snackbar>

            <AppBar position="fixed" open={navDrawerOpen} className={props.useDarkTheme ? styles.darkThemeAppBar : styles.lightThemeAppBar}>
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(navDrawerOpen && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Cardinal House DApp
                </Typography>

                {
                    /*
                    tokenPriceCG && (
                        <Typography variant="h6" component="div" className={styles.CHESPrice}>
                            CHES:&nbsp;
                        </Typography>
                    )
                    */
                }
                {
                    /*
                    tokenPriceCG && (
                        <Typography variant="h6" component="div" className={clsx(styles.CHESPrice, styles.CHESPriceVal, tokenPricePercentChange > 0 ? props.useDarkTheme ? styles.greenPriceDark : styles.greenPriceLight : styles.redPrice)}>
                            ${tokenPriceCG} ({tokenPricePercentChange}%)
                        </Typography>
                    )
                    */
                }

                {
                    /*
                    isConnected && (
                        <Typography variant="h6" component="div" className={styles.CHESBalance}>
                            Balance:&nbsp; 
                            {tokenBalance && Number((+ethers.utils.formatEther(BigInt(tokenBalance._hex).toString(10))).toFixed(2)).toLocaleString()}
                            {tempTokenBalance ? !tokenBalance ? Number((+ethers.utils.formatEther(BigInt(tempTokenBalance._hex).toString(10))).toFixed(2)).toLocaleString() : "" : 0}
                            &nbsp;CHES
                        </Typography>
                    )
                    */
                }

                <Tooltip title="Dark Theme Coming Soon!">
                    <div className={styles.changeThemeDiv}>
                        {props.useDarkTheme ? <DarkModeIcon className={clsx(styles.darkModeIcon, styles.iconSizeTheme)} /> : <LightModeIcon className={styles.lightModeIcon} fontSize="large" />}
                        <Switch checked={props.useDarkTheme} disabled={true} color="primary" onChange={e => props.setUseDarkTheme(e.target.checked)} />
                    </div>
                </Tooltip>

                {isConnected && (
                    <Button size="small" variant="contained" color="primary" onClick={deactivate}
                        className={clsx(styles.connectBtn, styles.largeScreenConnectBtn, props.useDarkTheme ? styles.connectBtnDark : styles.connectBtnLight)}>
                        Disconnect
                    </Button>
                )} 

                {!isConnected && !isConnecting && (
                    <Button size="small" variant="contained" color="primary" onClick={() => setIsConnecting(true)}
                        className={clsx(styles.connectBtn, styles.largeScreenConnectBtn, props.useDarkTheme ? styles.connectBtnDark : styles.connectBtnLight)}>
                        Connect
                    </Button> 
                )}

                {!isConnected && isConnecting && (
                    <>
                        <Button size="small" variant="contained" color="primary" onClick={() => connectBrowserWallet()}
                            className={clsx(styles.metaMaskBtn, styles.connectBtn, styles.largeScreenConnectBtn, props.useDarkTheme ? styles.connectBtnDark : styles.connectBtnLight)}>
                            <Image src={metaMaskLogo} width={25} height={25} layout="fixed" /> &nbsp; MetaMask
                        </Button>
                        <Button size="small" variant="contained" color="primary" onClick={() => activateWalletConnect()}
                            className={clsx(styles.connectBtn, styles.largeScreenConnectBtn, props.useDarkTheme ? styles.connectBtnDark : styles.connectBtnLight)}>
                            <Image src={walletConnectLogo} width={25} height={25} layout="fixed" /> &nbsp; WalletConnect
                        </Button>
                    </>
                )}  
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
                variant="persistent"
                anchor="left"
                open={navDrawerOpen}
            >
                <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                </DrawerHeader>
                <Divider />
                <List>

                <ListItem button onClick={() => updatePage("Services", "services")}>
                    <ListItemIcon>
                        <FaInfoCircle className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Services Info" />
                </ListItem>
                <ListItem button onClick={() => updatePage("OriginalCardinalNFT", "originalcardinalnft")}>
                    <ListItemIcon>
                        <FaCrown className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Original Cardinal NFTs" />
                </ListItem>
                <ListItem button onClick={() => updatePage("MembershipNFT", "membership")}>
                    <ListItemIcon>
                        <MdCardMembership className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Cardinal House Membership" />
                </ListItem>
                <ListItem button onClick={() => {window.location.href = `${window.location.origin}`}}>
                    <ListItemIcon>
                        <AiFillHome className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Back to Home Page" />
                </ListItem>

                <ListItem className={styles.navOptionsListItem}>
                    <Tooltip title="Dark Theme Coming Soon!">
                        <div>
                            {props.useDarkTheme ? <DarkModeIcon className={clsx(styles.darkModeIcon, styles.iconSizeTheme)} /> : <LightModeIcon className={styles.lightModeIcon} fontSize="large" />}
                            <Switch checked={props.useDarkTheme} disabled={true} color="primary" onChange={e => props.setUseDarkTheme(e.target.checked)} />
                        </div>
                    </Tooltip>
                </ListItem>
                <ListItem className={styles.navOptionsListItem}>
                    {isConnected && (
                        <Button size="small" variant="contained" color="primary" onClick={deactivate}
                            className={props.useDarkTheme ? styles.connectBtnDark : styles.connectBtnLight}>
                            Disconnect
                        </Button>
                    )} 

                    {!isConnected && !isConnecting && (
                        <Button size="small" variant="contained" color="primary" onClick={() => setIsConnecting(true)}
                            className={props.useDarkTheme ? styles.connectBtnDark : styles.connectBtnLight}>
                            Connect
                        </Button>
                    )}

                    {!isConnected && isConnecting && (
                        <Button size="small" variant="contained" color="primary" onClick={() => connectBrowserWallet()}
                            className={props.useDarkTheme ? styles.connectBtnDark : styles.connectBtnLight}>
                            <Image src={metaMaskLogo} width={25} height={25} layout="fixed" /> &nbsp; MetaMask
                        </Button>
                    )}  
                </ListItem>
                <ListItem className={styles.navOptionsListItem}>
                    {!isConnected && isConnecting && (
                        <Button size="small" variant="contained" color="primary" onClick={() => connectBrowserWallet()}
                            className={props.useDarkTheme ? styles.connectBtnDark : styles.connectBtnLight}>
                            <Image src={walletConnectLogo} width={25} height={25} layout="fixed" /> &nbsp; WalletConnect
                        </Button>
                    )}  
                </ListItem>
                </List>

                <Divider className={styles.CHESPriceSmall} />

                {/*
                <List>
                {
                    isConnected && (
                        <ListItem>
                            <Typography variant="p" component="div" className={clsx(styles.CHESBalanceSmall, "mb-2")}>
                                Balance:&nbsp; 
                                {tokenBalance && Number((+ethers.utils.formatEther(BigInt(tokenBalance._hex).toString(10))).toFixed(2)).toLocaleString()}
                                {tempTokenBalance ? !tokenBalance ? Number((+ethers.utils.formatEther(BigInt(tempTokenBalance._hex).toString(10))).toFixed(2)).toLocaleString() : "" : 0}
                                &nbsp;CHES
                            </Typography>
                        </ListItem>
                    )
                }

                {
                    tokenPriceCG && (
                        <ListItem>
                            <Typography variant="p" component="div" className={styles.CHESPriceSmall}>
                                CHES:&nbsp;
                            </Typography>
                        </ListItem>
                    )
                }
                {
                    tokenPriceCG && (
                        <ListItem>
                            <Typography variant="p" component="div" className={clsx(styles.CHESPriceSmall, tokenPricePercentChange > 0 ? props.useDarkTheme ? styles.greenPriceDark : styles.greenPriceLight : styles.redPrice)}>
                                ${tokenPriceCG} ({tokenPricePercentChange}%)
                            </Typography>
                        </ListItem>
                    )
                }
                </List>
                */}
            </Drawer>

            {
                currPage == "Services" && (
                    <ServicesInfo useDarkTheme={props.useDarkTheme} />
                )
            }
            {
                currPage == "OriginalCardinalNFT" && (
                    <OriginalCardinalNFT useDarkTheme={props.useDarkTheme} />
                )
            }
            {
                currPage == "MembershipNFT" && (
                    <MembershipNFT useDarkTheme={props.useDarkTheme} />
                )
            }
        </div>
    )
}