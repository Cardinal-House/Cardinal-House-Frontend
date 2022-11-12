import { Grid, Typography, Button, CircularProgress } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import clsx from 'clsx';
import axios from 'axios';
import { useState, useEffect } from "react";
import { useEthers, useContractFunction, useCall } from "@usedapp/core";
import { utils, ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { ImPriceTag } from 'react-icons/im';

import styles from '../styles/DApp.module.css';
import ERC20 from "../contracts/ERC20.json";
import NodeRunner from "../contracts/NodeRunner.json";
import CardinalNFT from "../contracts/CardinalNFT.json";
import CardinalHouseMarketplace from "../contracts/CardinalHouseMarketplace.json";
import chainConfig from "../chain-config.json";

const rpcEndpoint = "https://rpc-mainnet.maticvigil.com";
// const rpcEndpoint = "https://rpc-mumbai.matic.today";
const polygonChainId = 137;
// const polygonChainId = 80001;

const networkName = "polygon";

async function useMarketItems(
    cardinalMarketplaceContract, CardinalMarketplaceAddress, cardinalMarketplaceABI
  ) {
    const { value, error } =
        useCall(
            cardinalMarketplaceContract && {
            contract: cardinalMarketplaceContract, // instance of called contract
            method: "fetchMarketItems", // Method to be called
            args: [], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }

    if (!value) {
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: polygonChainId });
        const cardinalMarketplaceReadOnly = new ethers.Contract(CardinalMarketplaceAddress, cardinalMarketplaceABI, provider);
    
        const returnVal = await cardinalMarketplaceReadOnly.fetchMarketItems();
        return returnVal;
    }

    return value?.[0]
  }

export default function ViewMarketplaceNFTs(props) {
    const { account, chainId } = useEthers();
    // const networkName = chainId ? chainConfig["chainIds"][chainId] : "Not Connected";
    const ERC20ABI = ERC20.abi;
    const nodeRunnerABI = NodeRunner.abi;
    const cardinalNFTABI = CardinalNFT.abi;
    const cardinalMarketplaceABI = CardinalHouseMarketplace.abi;
    const USDCAddress = chainConfig["USDCAddresses"][networkName];
    const NodeRunnerAddress = chainConfig["NodeRunnerAddresses"][networkName];
    const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
    const CardinalMarketplaceAddress = chainConfig["CardinalNFTMarketplaceAddresses"][networkName];
    
    const USDCInterface = new utils.Interface(ERC20ABI);
    const USDCContract = new Contract(USDCAddress, USDCInterface);
    const cardinalMarketplaceInterface = new utils.Interface(cardinalMarketplaceABI);
    const cardinalMarketplaceContract = new Contract(CardinalMarketplaceAddress, cardinalMarketplaceInterface);

    const marketItems = useMarketItems(cardinalMarketplaceContract, CardinalMarketplaceAddress, cardinalMarketplaceABI);
    const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
    const [currBuyNFTId, setCurrBuyNFTId] = useState("");
    const [currApprovedNFTId, setCurrApprovedNFTId] = useState("");
    const [currNFT, setCurrNFT] = useState("");
    const [NFTsLoaded, setNFTsLoaded] = useState(false);
    const [isCardinalMember, setIsCardinalMember] = useState(false);
    const [approvingTokenTransfer, setApprovingTokenTransfer] = useState("");
    const [purchasingNFT, setPurchasingNFT] = useState("");
    const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
    const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
    const [showTransactionCancel, setShowTransactionCancel] = useState(false);
    const [showPendingTransaction, setShowPendingTransaction] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [processingMessage, setProcessingMessage] = useState("");
    const [transactionHash, setTransactionHash] = useState("");

    const isConnected = account !== undefined;

    const { send: approveTokenTransfer, state: approveTokenTransferState } =
        useContractFunction(USDCContract, "approve", {
            transactionName: "Approve the Cardinal House NFT marketplace to spend tokens for NFT purchase",
    })

    const { send: createMarketSale, state: createMarketSaleState } =
        useContractFunction(cardinalMarketplaceContract, "createMarketSale", {
            transactionName: "Purchase a Cardinal House NFT on the Marketplace",
    })

    async function updateMarketplaceNFTs(marketItemsResult) {
        console.log("Updating marketplace NFTs.");
        let marketplaceNFTArray = [];

        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: polygonChainId });
        const marketplaceContractReadOnly = new ethers.Contract(CardinalMarketplaceAddress, cardinalMarketplaceABI, provider);

        for(let i = 0; i < marketItemsResult.length; i++) {
            const currTokenId = marketItemsResult[i].tokenId;
            const currNFTAddress = marketItemsResult[i].nftContract;
      
            const nftContractReadOnly = new ethers.Contract(currNFTAddress, nodeRunnerABI, provider);
      
            const requiresCardinalCrew = await marketplaceContractReadOnly.NFTContractToRequireCardinalCrew(currNFTAddress);
            const tokenToBuy = await marketplaceContractReadOnly.NFTContractToTokenAddress(currNFTAddress);
            const currTokenURI = await nftContractReadOnly.tokenURI(currTokenId);
            const metaData = await axios.get(currTokenURI);

            let price = (+ethers.utils.formatEther(BigInt(marketItemsResult[i].price._hex).toString(10))).toFixed(1).toString();
            let priceUnrounded = (+ethers.utils.formatEther(BigInt(marketItemsResult[i].price._hex).toString(10))).toString();

            if (tokenToBuy == USDCAddress) {
                price = (+ethers.utils.formatEther((BigInt(marketItemsResult[i].price._hex) * BigInt(Math.pow(10, 12))).toString(10))).toFixed(1).toString();
                priceUnrounded = (+ethers.utils.formatEther((BigInt(marketItemsResult[i].price._hex) * BigInt(Math.pow(10, 12))).toString(10))).toString();
            }

            const itemId = BigInt(marketItemsResult[i].itemId._hex).toString(10);
            marketplaceNFTArray.push(Object.assign({}, metaData.data, {price: price, priceUnrounded: priceUnrounded, requiresCardinalCrew: requiresCardinalCrew, tokenToBuy: tokenToBuy, itemId: itemId, contract: currNFTAddress}));
          }

        setMarketplaceNFTs(JSON.parse(JSON.stringify(marketplaceNFTArray)));
        setNFTsLoaded(true);
    }

    useEffect(() => {
        marketItems.then(marketItemsResult => {
            if (marketItemsResult && marketplaceNFTs.length !== marketItemsResult.length) {
                updateMarketplaceNFTs(marketItemsResult);
            }
            else if (isConnected && marketplaceNFTs.length == 0) {
                setNFTsLoaded(true);
            }
        });
    }, [marketItems])

    async function updateIsCardinalMember() {
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: polygonChainId });
        const cardinalNFTContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);
        const currIsCardinalMember = await cardinalNFTContractReadOnly.addressIsMember(account);
        setIsCardinalMember(currIsCardinalMember);
    }

    useEffect(() => {
        if (isConnected) {
            updateIsCardinalMember();
        }
    }, [isConnected, account])

    async function startNFTPurchase(marketItemId, NFTPrice, contract) {
        const price = ethers.utils.parseUnits(NFTPrice, 'ether');
        approveTokenTransfer(CardinalMarketplaceAddress, price);
        setCurrBuyNFTId(`${contract}-${marketItemId}`);
        setApprovingTokenTransfer(`${contract}-${marketItemId}`);
    }

    useEffect(() => {
        console.log(approveTokenTransferState);
        if (approveTokenTransferState.status === "Success") {
            setCurrApprovedNFTId(currBuyNFTId);
            setApprovingTokenTransfer("");
            setShowApprovalSuccess(true);
            setShowTransactionCancel(false);
            setShowPendingTransaction(false);
        }
        else if (approveTokenTransferState.status === "Exception") {
            setCurrApprovedNFTId("");
            setCurrBuyNFTId("");
            setApprovingTokenTransfer("");
            setShowTransactionCancel(true);
            setShowApprovalSuccess(false);
            setShowPurchaseSuccess(false);
            setShowPendingTransaction(false);
            setErrorText(approveTokenTransferState.errorMessage);
        }
        else if (approveTokenTransferState.status === "Mining") {
            setShowPendingTransaction(true);
            setCurrApprovedNFTId("");
            setProcessingMessage("Approving Token Transfer...")
            setTransactionHash(approveTokenTransferState.transaction.hash);
        }
        else if (approveTokenTransferState.status === "PendingSignature") {
            setShowPendingTransaction(true);
            setCurrApprovedNFTId("");
            setProcessingMessage("Waiting for User to Sign Transaction...");
            setTransactionHash("");
          }
        else {
            setCurrApprovedNFTId("");
        }
    }, [approveTokenTransferState])

    async function finishNFTPurchase(marketItemId, itemPrice, contract) {
        let price = BigInt(ethers.utils.parseUnits(itemPrice, 'ether')._hex).toString(10);

        if (contract != CardinalNFTAddress) {
            price = (BigInt(ethers.utils.parseUnits(itemPrice, 'ether')._hex) / BigInt(Math.pow(10, 12))).toString(10);
        }

        createMarketSale(contract, marketItemId, price);
        setCurrBuyNFTId(`${contract}-${marketItemId}`);
        setPurchasingNFT(`${contract}-${marketItemId}`);
    }

    useEffect(() => {
        console.log(createMarketSaleState);
        if (createMarketSaleState.status === "Success") {
            setPurchasingNFT("");
            setCurrBuyNFTId("");
            setShowPurchaseSuccess(true);
            setShowTransactionCancel(false);
            setShowPendingTransaction(false);
            props.updateTempTokenBalance();
        }
        else if (createMarketSaleState.status === "Exception") {
            setCurrBuyNFTId("");
            setPurchasingNFT("");
            setShowTransactionCancel(true);
            setShowPurchaseSuccess(false);
            setShowApprovalSuccess(false);
            setShowPendingTransaction(false);
            setErrorText(createMarketSaleState.errorMessage);
        }
        else if (createMarketSaleState.status === "Mining") {
            setShowPendingTransaction(true);
            setProcessingMessage("Purchasing NFT...");
            setTransactionHash(createMarketSaleState.transaction.hash);
        }
        else if (createMarketSaleState.status === "PendingSignature") {
            setShowPendingTransaction(true);
            setProcessingMessage("Waiting for User to Sign Transaction...");
            setTransactionHash("");
        }
    }, [createMarketSaleState])

    return (
        <main className={styles.container}>
            <Grid container justifyContent="center" className={styles.mainGrid}>
                <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
                <Grid item lg={5} md={8} sm={10} xs={12} className={clsx(styles.marketplaceHeader, styles.headerTextGrid)}>
                    <Typography variant="h2" className={styles.headerText}>
                        Cardinal House NFT Marketplace (BETA)
                    </Typography>
                </Grid>
                <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
                
                <Grid container justifyContent="center" spacing={4} className={styles.marketplaceFunctionGrid}>
                    <Snackbar open={showApprovalSuccess} autoHideDuration={6000} onClose={() => {setShowApprovalSuccess(false)}}>
                        <MuiAlert elevation={6} variant="filled" onClose={() => {setShowApprovalSuccess(false)}} severity="success" sx={{ width: '100%' }} >
                            Approval Succeeded! Click &quot;Purchase&quot; to Finalize Your NFT Purchase.
                        </MuiAlert>
                    </Snackbar>
                    <Snackbar open={showPurchaseSuccess} autoHideDuration={6000} onClose={() => {setShowPurchaseSuccess(false)}}>
                        <MuiAlert elevation={6} variant="filled" onClose={() => {setShowPurchaseSuccess(false)}} severity="success" sx={{ width: '100%' }} >
                            Purchase Succeeded! {transactionHash != "" ? "Transaction hash:" : ""} <a className={styles.transactionHashLink} href={`https://polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noreferrer" >{transactionHash}</a>
                        </MuiAlert>
                    </Snackbar>
                    <Snackbar open={showTransactionCancel} autoHideDuration={6000} onClose={() => {setShowTransactionCancel(false)}}>
                        <MuiAlert elevation={6} variant="filled" onClose={() => {setShowTransactionCancel(false)}} severity="error" sx={{ width: '100%' }} >
                            Transaction Canceled: {errorText}
                        </MuiAlert>
                    </Snackbar>
                    <Snackbar open={showPendingTransaction} autoHideDuration={20000} onClose={() => {setShowPendingTransaction(false)}}>
                        <MuiAlert elevation={6} variant="filled" onClose={() => {setShowPendingTransaction(false)}} severity="info" sx={{ width: '100%' }} >
                            {processingMessage} {transactionHash != "" ? "Transaction hash:" : ""} <a className={styles.transactionHashLink} href={`https://polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noreferrer" >{transactionHash}</a>
                        </MuiAlert>
                    </Snackbar>
                    {
                        marketplaceNFTs.length == 0 && NFTsLoaded && (
                            <Grid item xs={10} className="text-center">
                                <Typography variant="h5" component="div">
                                    NFTs will appear here as they are loaded or added to the marketplace...
                                </Typography>
                            </Grid>
                        )
                    }
                    {
                        marketplaceNFTs.length == 0 && !NFTsLoaded && (
                            <Grid item xs={10} className="text-center mt-5">
                                <CircularProgress size={80} color="secondary" className={styles.loadingAirdropContent} />
                            </Grid>
                        )
                    }
                    {
                        marketplaceNFTs.length > 0 && (
                            <Grid item xs={10}>
                                <Grid container justifyContent="center" alignItems="center" spacing={4}>
                                    {
                                        marketplaceNFTs && (marketplaceNFTs.map((nft, i) => (
                                            <Grid key={i} item xs={12} sm={6} md={4} lg={3} className={styles.NFTGrid}>
                                                <div key={i} className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")} onMouseEnter={() => setCurrNFT(`${nft.contract}-${nft.itemId}`)} onMouseLeave={() => setCurrNFT("")}>
                                                    <img src={nft.image} className={clsx(styles.NFTImage)} />
                                                    <Grid container justifyContent="center" alignItems="center" className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                                                        <Grid item xs={8} className={styles.nftNameAndDesc}>
                                                            <Typography variant="p" component="div" className={clsx(styles.NFTName, "text-2xl font-bold")}>
                                                                {nft.NFTName}
                                                            </Typography>
                                                            {
                                                                currNFT != `${nft.contract}-${nft.itemId}` && currBuyNFTId != `${nft.contract}-${nft.itemId}` && (
                                                                    <Typography variant="p" component="div" className={clsx(styles.NFTDescription, "font-bold mt-3")}>
                                                                        {nft.NFTDescription}
                                                                    </Typography>
                                                                )
                                                            }
                                                            {
                                                                (currNFT == `${nft.contract}-${nft.itemId}` || currBuyNFTId == `${nft.contract}-${nft.itemId}`) && currApprovedNFTId != `${nft.contract}-${nft.itemId}` && !isConnected && (
                                                                    <Typography variant="h5" component="div" className={clsx(styles.NFTDescription, "font-bold mt-3")}>
                                                                        Connect Wallet to Purchase
                                                                    </Typography>
                                                                )
                                                            }
                                                            {
                                                                (currNFT == `${nft.contract}-${nft.itemId}` || currBuyNFTId == `${nft.contract}-${nft.itemId}`) && currApprovedNFTId != `${nft.contract}-${nft.itemId}` && isConnected && nft.requiresCardinalCrew && !isCardinalMember && (
                                                                    <Typography variant="h5" component="div" className={clsx(styles.NFTDescription, "font-bold mt-3")}>
                                                                        This NFT is for Cardinal Crew Members Only!
                                                                    </Typography>
                                                                )
                                                            }
                                                            {
                                                                (currNFT == `${nft.contract}-${nft.itemId}` || currBuyNFTId == `${nft.contract}-${nft.itemId}`) && currApprovedNFTId != `${nft.contract}-${nft.itemId}` && isConnected && (!nft.requiresCardinalCrew || isCardinalMember) && (
                                                                    <Button size="small" variant="contained" color="primary" onClick={() => startNFTPurchase(nft.itemId, nft.priceUnrounded, nft.contract)}
                                                                        className={clsx(styles.buyNFTButton, props.useDarkTheme ? styles.btnDark : styles.btnLight)} disabled={approvingTokenTransfer !== ""}>
                                                                        {approvingTokenTransfer == `${nft.contract}-${nft.itemId}` && <CircularProgress size={18} color="secondary"/>} 
                                                                        {approvingTokenTransfer == `${nft.contract}-${nft.itemId}` ? <>&nbsp; Approving</> : "Buy Now"}
                                                                    </Button>
                                                                )
                                                            }
                                                            {
                                                                (currNFT == `${nft.contract}-${nft.itemId}` || currBuyNFTId == `${nft.contract}-${nft.itemId}`) && currApprovedNFTId == `${nft.contract}-${nft.itemId}` && (
                                                                    <Button size="small" variant="contained" color="primary" onClick={() => finishNFTPurchase(nft.itemId, nft.priceUnrounded, nft.contract)}
                                                                        className={clsx(styles.buyNFTButton, props.useDarkTheme ? styles.btnDark : styles.btnLight)} disabled={purchasingNFT !== ""}>
                                                                        {purchasingNFT == `${nft.contract}-${nft.itemId}` && <CircularProgress size={18} color="secondary"/>} 
                                                                        {purchasingNFT == `${nft.contract}-${nft.itemId}` ? <>&nbsp; Buying</> : "Purchase"}
                                                                    </Button>
                                                                )
                                                            }
                                                        </Grid>
                                                        <Grid item xs={4} className={styles.nftPrice}>
                                                            <Typography variant="p" component="div" className={clsx(styles.NFTPrice, "font-bold")}>
                                                                <ImPriceTag /> Price
                                                            </Typography>
                                                            <Typography variant="p" component="div" className={clsx(styles.NFTPrice, "font-bold mt-3")}>
                                                                {Number(nft.price).toLocaleString()} USDC
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </Grid>
                                        )))
                                    }
                                </Grid>
                            </Grid>
                        )
                    }
                </Grid>
            </Grid>
        </main>
    )
}