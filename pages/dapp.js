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
import { ethers } from "ethers";
import WalletConnectProvider from '@walletconnect/web3-provider';
import { FaInfoCircle, FaCrown } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { MdCardMembership } from "react-icons/md";
import { BsShieldFillCheck } from "react-icons/bs";
import { GiCoins, GiReceiveMoney } from "react-icons/gi";
import { SiMarketo, SiNodered } from "react-icons/si";

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

import ServicesInfo from "../components/ServicesInfo";
import OriginalCardinalNFT from "../components/OriginalCardinalNFT";
import MembershipNFT from "../components/MembershipNFT";
import Audits from "../components/Audits";
import styles from '../styles/DApp.module.css';
import ERC20 from "../contracts/ERC20.json";
import chainConfig from "../chain-config.json";
import metaMaskLogo from '../public/MetaMask.png';
import walletConnectLogo from '../public/WalletConnect.png';
import PurchaseMembership from '../components/PurchaseMembership';
import PurchaseNodeRunner from '../components/PurchaseNodeRunner';
import NodeRunnerNFTs from '../components/NodeRunnerNFTs';
import ClaimNodeRewards from '../components/ClaimNodeRewards';
import ViewMarketplaceNFTs from '../components/ViewMarketplaceNFTs';

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
// const rpcEndpoint = "https://rpc-mumbai.matic.today";
const polygonChainId = 137;
// const polygonChainId = 80001;

export default function DApp(props) {
    const theme = useTheme();

    const { account, activateBrowserWallet, deactivate, chainId } = useEthers();
    const networkName = "polygon";
    const USDCAddress = chainConfig["USDCAddresses"][networkName];
    const USDCBalance = useTokenBalance(USDCAddress, account);
    const isConnected = account !== undefined;

    const [currPage, setCurrPage] = useState("Services");
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showWalletConnectionFailed, setShowWalletConnectionFailed] = useState(false);
    const [showWrongNetwork, setShowWrongNetwork] = useState(false);
    const [tempUSDCBalance, setTempUSDCBalance] = useState(0);
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
        const erc20ABI = ERC20.abi;
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: polygonChainId });
        const USDCContract = new ethers.Contract(USDCAddress, erc20ABI, provider);
        const userUSDCBalance = await USDCContract.balanceOf(account);
        setTempUSDCBalance(userUSDCBalance);
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
        else if (hash == "#audits") {
            setCurrPage("Audits");
        }
        else if (hash == "#purchasemembership") {
            setCurrPage("PurchaseMembership");
        }
        else if (hash == "#purchasenoderunner") {
            setCurrPage("PurchaseNodeRunner");
        }
        else if (hash == "#noderunnernfts") {
            setCurrPage("NodeRunnerNFTs");
        }
        else if (hash == "#claimnoderewards") {
            setCurrPage("ClaimNodeRewards");
        }
        else if (hash == "#viewmarketplacenfts") {
            setCurrPage("ViewMarketplaceNFTs");
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
                    isConnected && (
                        <Typography variant="h6" component="div" className={styles.CRNLBalance}>
                            USDC Balance:&nbsp; 
                            {USDCBalance && (Number((+ethers.utils.formatEther(BigInt(USDCBalance._hex).toString(10))) * Math.pow(10, 12)).toFixed(2)).toLocaleString()}
                            {tempUSDCBalance ? !USDCBalance ? (Number((+ethers.utils.formatEther(BigInt(tempUSDCBalance._hex).toString(10))) * Math.pow(10, 12)).toFixed(2)).toLocaleString() : "" : 0}
                            &nbsp;USDC
                        </Typography>
                    )
                }

                <div className={styles.changeThemeDiv}>
                    {props.useDarkTheme ? <DarkModeIcon className={clsx(styles.darkModeIcon, styles.iconSizeTheme)} /> : <LightModeIcon className={styles.lightModeIcon} fontSize="large" />}
                    <Switch checked={props.useDarkTheme} color="primary" onChange={e => props.setUseDarkTheme(e.target.checked)} />
                </div>

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
                <ListItem button onClick={() => updatePage("PurchaseMembership", "purchasemembership")}
                    className={currPage == "PurchaseMembership" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <MdCardMembership className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Purchase Cardinal Crew Membership" />
                </ListItem>
                <ListItem button onClick={() => updatePage("PurchaseNodeRunner", "purchasenoderunner")}
                    className={currPage == "PurchaseNodeRunner" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <GiCoins className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Purchase Node Runner NFTs" />
                </ListItem>
                <ListItem button onClick={() => updatePage("ViewMarketplaceNFTs", "viewmarketplacenfts")}
                    className={currPage == "ViewMarketplaceNFTs" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <SiMarketo className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="View Cardinal Marketplace NFTs" />
                </ListItem>
                <ListItem button onClick={() => updatePage("NodeRunnerNFTs", "noderunnernfts")}
                    className={currPage == "NodeRunnerNFTs" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <SiNodered className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="View Your Node Runner NFTs" />
                </ListItem>
                <ListItem button onClick={() => updatePage("ClaimNodeRewards", "claimnoderewards")}
                    className={currPage == "ClaimNodeRewards" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <GiReceiveMoney className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Claim Node Runner Rewards" />
                </ListItem>                
                <ListItem button onClick={() => updatePage("OriginalCardinalNFT", "originalcardinalnft")}
                    className={currPage == "OriginalCardinalNFT" ? styles.currSection : ""}>
                    <ListItemIcon>
                        <FaCrown className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Original Cardinal NFTs" />
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
                    <div>
                        {props.useDarkTheme ? <DarkModeIcon className={clsx(styles.darkModeIcon, styles.iconSizeTheme)} /> : <LightModeIcon className={styles.lightModeIcon} fontSize="large" />}
                        <Switch checked={props.useDarkTheme} color="primary" onChange={e => props.setUseDarkTheme(e.target.checked)} />
                    </div>
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
                currPage == "PurchaseMembership" && (
                    <PurchaseMembership useDarkTheme={props.useDarkTheme} updateTempTokenBalance={updateTempTokenBalance} />
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
            {
                currPage == "PurchaseNodeRunner" && (
                    <PurchaseNodeRunner useDarkTheme={props.useDarkTheme} updateTempTokenBalance={updateTempTokenBalance} />
                )
            }
            {
                currPage == "NodeRunnerNFTs" && (
                    <NodeRunnerNFTs useDarkTheme={props.useDarkTheme} />
                )
            }
            {
                currPage == "ClaimNodeRewards" && (
                    <ClaimNodeRewards useDarkTheme={props.useDarkTheme} />
                )
            }
            {
                currPage == "ViewMarketplaceNFTs" && (
                    <ViewMarketplaceNFTs useDarkTheme={props.useDarkTheme} updateTempTokenBalance={updateTempTokenBalance} />
                )
            }
        </div>
    )
}