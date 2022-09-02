import Image from 'next/image';
import { Typography, Button, Drawer, Toolbar, List, Divider, Tooltip,
    ListItem, ListItemIcon, ListItemText, CssBaseline, IconButton, Switch } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import clsx from 'clsx';
import { useState, useEffect, Fragment } from "react";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useCoingeckoPrice } from '@usedapp/coingecko';
import { constants, ethers } from "ethers";
import WalletConnectProvider from '@walletconnect/web3-provider';
import { FaInfoCircle, FaCrown } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { MdCardMembership, MdAccountBalance } from "react-icons/md";
import { BsShieldFillCheck } from "react-icons/bs";

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

import ServicesInfo from "../components/ServicesInfo";
import OriginalCardinalNFT from "../components/OriginalCardinalNFT";
import MembershipNFT from "../components/MembershipNFT";
import PreSale from "../components/PreSale";
import Audits from "../components/Audits";
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
      chainId: "0x89",  // Polygon is chain ID 137 which is 0x89 in hex
      chainName: "POLYGON",
      rpcUrls: ["https://rpc-mainnet.maticvigil.com"],
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      blockExplorerUrls: ["https://polygonscan.com/"],
    },
];

const rpcEndpoint = "https://rpc-mainnet.maticvigil.com";
const polygonChainId = 137;

export default function DApp(props) {
    const theme = useTheme();

    const { account, activateBrowserWallet, deactivate, chainId } = useEthers();
    const networkName = "polygon";
    const CardinalTokenAddress = chainConfig["CardinalTokenAddresses"][networkName]
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
    const [cookieAgreementOpen, setCookieAgreementOpen] = useState(false);

    if (account && chainId != polygonChainId.toString() && chainId != polygonChainId && !showWrongNetwork) {
        setShowWrongNetwork(true);
        window.ethereum.request({

            method: "wallet_addEthereumChain",
        
            params: networkData,
        
          });
    }

    const action = (
        <Fragment>
            <Button color="secondary" size="small" onClick={() => setCookieAgreementOpen(false)}>
                I Understand
            </Button>
            <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setCookieAgreementOpen(false)}
            >
            <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    async function updateTempTokenBalance() {
        const cardinalTokenABI = CardinalToken.abi;
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: polygonChainId });
        const CardinalTokenContract = new ethers.Contract(CardinalTokenAddress, cardinalTokenABI, provider);
        const userBalance = await CardinalTokenContract.balanceOf(account);
        setTempTokenBalance(userBalance);
    }
    
    useEffect(() => {
        if (account && (chainId == polygonChainId || chainId == polygonChainId.toString())) {
            updateTempTokenBalance();
        }
    }, [chainId, account])

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
        else if (hash == "#bonds") {
            setCurrPage("Bonds");
        }
        else if (hash == "#audits") {
            setCurrPage("Audits");
        }
    }

    useEffect(() => {
        updatePageWithHashChange();

        window.onhashchange = function() {
            updatePageWithHashChange();
        }

        window.onscroll = function() {
            handleDrawerClose();
        }

        if (localStorage.getItem("CardinalHouseCookieAgreement") != "Read") {
            setCookieAgreementOpen(true);
            localStorage.setItem("CardinalHouseCookieAgreement", "Read");
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
            <Snackbar
                open={cookieAgreementOpen}
                autoHideDuration={6000}
                onClose={() => setCookieAgreementOpen(false)}
                message="This website uses cookies to enhance the user experience."
                action={action}
            />

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
                        <Typography variant="h6" component="div" className={styles.CRNLPrice}>
                            CRNL:&nbsp;
                        </Typography>
                    )
                    */
                }
                {
                    /*
                    tokenPriceCG && (
                        <Typography variant="h6" component="div" className={clsx(styles.CRNLPrice, styles.CRNLPriceVal, tokenPricePercentChange > 0 ? props.useDarkTheme ? styles.greenPriceDark : styles.greenPriceLight : styles.redPrice)}>
                            ${tokenPriceCG} ({tokenPricePercentChange}%)
                        </Typography>
                    )
                    */
                }

                {
                    isConnected && (
                        <Typography variant="h6" component="div" className={styles.CRNLBalance}>
                            Balance:&nbsp; 
                            {tokenBalance && Number((+ethers.utils.formatEther(BigInt(tokenBalance._hex).toString(10))).toFixed(2)).toLocaleString()}
                            {tempTokenBalance ? !tokenBalance ? Number((+ethers.utils.formatEther(BigInt(tempTokenBalance._hex).toString(10))).toFixed(2)).toLocaleString() : "" : 0}
                            &nbsp;CRNL
                        </Typography>
                    )
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

                <ListItem button onClick={() => updatePage("Services", "services")}
                    className={clsx(styles.servicesInfoSection, currPage == "Services" ? styles.currSection : "")}>
                    <ListItemIcon>
                        <FaInfoCircle className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Services Info" />
                </ListItem>
                <ListItem button onClick={() => updatePage("Bonds", "bonds")}
                    className={clsx(styles.servicesInfoSection, currPage == "Bonds" ? styles.currSection : "")}>
                    <ListItemIcon>
                        <MdAccountBalance className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Cardinal Bonds" />
                </ListItem>
                <ListItem button onClick={() => updatePage("OriginalCardinalNFT", "originalcardinalnft")}
                    className={currPage == "OriginalCardinalNFT" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <FaCrown className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Original Cardinal NFTs" />
                </ListItem>
                <ListItem button onClick={() => updatePage("MembershipNFT", "membership")}
                    className={currPage == "MembershipNFT" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <MdCardMembership className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Cardinal House Membership" />
                </ListItem>
                <ListItem button onClick={() => updatePage("Audits", "audits")}
                    className={currPage == "Audits" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <BsShieldFillCheck className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Cardinal House Audits" />
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

                <Divider className={styles.CRNLPriceSmall} />

                {/*
                <List>
                {
                    isConnected && (
                        <ListItem>
                            <Typography variant="p" component="div" className={clsx(styles.CRNLBalanceSmall, "mb-2")}>
                                Balance:&nbsp; 
                                {tokenBalance && Number((+ethers.utils.formatEther(BigInt(tokenBalance._hex).toString(10))).toFixed(2)).toLocaleString()}
                                {tempTokenBalance ? !tokenBalance ? Number((+ethers.utils.formatEther(BigInt(tempTokenBalance._hex).toString(10))).toFixed(2)).toLocaleString() : "" : 0}
                                &nbsp;CRNL
                            </Typography>
                        </ListItem>
                    )
                }

                {
                    tokenPriceCG && (
                        <ListItem>
                            <Typography variant="p" component="div" className={styles.CRNLPriceSmall}>
                                CRNL:&nbsp;
                            </Typography>
                        </ListItem>
                    )
                }
                {
                    tokenPriceCG && (
                        <ListItem>
                            <Typography variant="p" component="div" className={clsx(styles.CRNLPriceSmall, tokenPricePercentChange > 0 ? props.useDarkTheme ? styles.greenPriceDark : styles.greenPriceLight : styles.redPrice)}>
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
                currPage == "Bonds" && (
                    <PreSale useDarkTheme={props.useDarkTheme} updateTempTokenBalance={updateTempTokenBalance} />
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
            {
                currPage == "Audits" && (
                    <Audits useDarkTheme={props.useDarkTheme} />
                )
            }
        </div>
    )
}