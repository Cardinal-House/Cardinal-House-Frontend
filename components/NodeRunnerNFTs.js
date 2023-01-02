import Image from 'next/image';
import { Grid, Button, Typography, TextField, CircularProgress } from '@mui/material';
import { Modal } from "react-bootstrap";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import clsx from 'clsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useEthers, useContractFunction, useCall } from "@usedapp/core";
import { utils, ethers } from "ethers";
import Web3Modal from 'web3modal';
import { Contract } from "@ethersproject/contracts";
import { ImPriceTag } from 'react-icons/im';

import styles from '../styles/DApp.module.css';
import chainConfig from "../chain-config.json";
import ERC20 from "../contracts/ERC20.json";
import NodeRunner from "../contracts/NodeRunner.json";
import CardinalNFT from "../contracts/CardinalNFT.json";
import CardinalHouseMarketplace from "../contracts/CardinalHouseMarketplace.json";

const rpcEndpoint = "https://rpc-mainnet.maticvigil.com";
// const rpcEndpoint = "https://rpc-mumbai.matic.today";
const polygonChainId = 137;
// const polygonChainId = 80001;

export default function NodeRunnerNFTs(props) {
  const { account, chainId } = useEthers();
  const networkName = "polygon";
  const ERC20ABI = ERC20.abi;
  const nodeRunnerABI = NodeRunner.abi;
  const cardinalNFTABI = CardinalNFT.abi;
  const cardinalMarketplaceABI = CardinalHouseMarketplace.abi;
  const USDCAddress = chainConfig["USDCAddresses"][networkName];
  const NodeRunnerAddress = chainConfig["NodeRunnerAddresses"][networkName];
  const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
  const CardinalMarketplaceAddress = chainConfig["CardinalNFTMarketplaceAddresses"][networkName];
  const isConnected = account !== undefined && chainId == polygonChainId;

  const [nodeRunnerContracts, setNodeRunnerContracts] = useState([]);
  const [currNodeRunnerContract, setCurrNodeRunnerContract] = useState({});
  const [userNodeRunnerNFTs, setUserNodeRunnerNFTs] = useState({});
  const [loadingNodeRunnerContracts, setLoadingNodeRunnerContracts] = useState(true);
  const [currNFTViewed, setCurrNFTViewed] = useState("");
  const [USDCBalance, setUSDCBalance] = useState(-1);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [showSubmissionFailure, setShowSubmissionFailure] = useState(false);
  const [showSubmissionPending, setShowSubmissionPending] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");


  const [inputError, setInputError] = useState("");
  const [NFTPrice, setNFTPrice] = useState(0.0);
  const [showListNFTModal, setShowListNFTModal] = useState(false);
  const [currNFT, setCurrNFT] = useState({});
  const [NFTTransferApproved, setNFTTransferApproved] = useState(false);
  const [NFTsLoaded, setNFTsLoaded] = useState(false);
  const [approvingNFTTransfer, setApprovingNFTTransfer] = useState(false);
  const [listingNFT, setListingNFT] = useState(false);
  const [userMarketNFTs, setUserMarketNFTs] = useState([]);
  const [marketNFTsLoaded, setMarketNFTsLoaded] = useState(false);
  const [currNFTCanceling, setCurrNFTCanceling] = useState("");
  const [currListedNFTViewed, setCurrListedNFTViewed] = useState("");
  const [cancelingNFTListing, setCancelingNFTListing] = useState(false);

  const USDCInterface = new utils.Interface(ERC20ABI);
  const USDCContract = new Contract(USDCAddress, USDCInterface);
  const nodeRunnerInterface = new utils.Interface(nodeRunnerABI);
  const nodeRunnerContract = new Contract(currNodeRunnerContract.Address ? currNodeRunnerContract.Address : NodeRunnerAddress, nodeRunnerInterface);
  const cardinalMarketplaceInterface = new utils.Interface(cardinalMarketplaceABI);
  const cardinalMarketplaceContract = new Contract(CardinalMarketplaceAddress, cardinalMarketplaceInterface);

  const { send: approveNFTTransfer, state: approveNFTTransferState } =
    useContractFunction(nodeRunnerContract, "approve", {
        transactionName: "Approve the Cardinal House NFT marketplace to transfer your Node Runner NFT",
  })

  const { send: createMarketItem, state: createMarketItemState } =
    useContractFunction(cardinalMarketplaceContract, "createMarketItem", {
        transactionName: "List a Node Runner NFT on the Marketplace",
  })

  const { send: cancelMarketSale, state: cancelMarketSaleState } =
    useContractFunction(cardinalMarketplaceContract, "cancelMarketSale", {
        transactionName: "Cancel a Node Runner NFT listing on the Marketplace",
  })

  async function getAccountInfo() {
    const web3Modal = new Web3Modal({
      network: networkName,
      cacheProvider: true,
      })
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const USDCContractReadOnly = new ethers.Contract(USDCAddress, ERC20ABI, provider);

    const currUSDCBalanceObj = await USDCContractReadOnly.balanceOf(account);
    const currUSDCBalance = +ethers.utils.formatEther(BigInt(parseInt(currUSDCBalanceObj._hex, 16)).toString(10));
    setUSDCBalance(currUSDCBalance);

    let currUserNodeRunnerNFTs = {};
    let currNFTDataList = [];
    for (let i = 0; i < nodeRunnerContracts.length; i++) {
      const nodeRunnerContractReadOnly = new ethers.Contract(nodeRunnerContracts[i].Address, nodeRunnerABI, provider);
      currNFTDataList = [];
      let currContractTokenURI = "";
      let metaData = {}

      const currNodeUserNFTs = await nodeRunnerContractReadOnly.getUserTokenURIs(account);   
      
      if (currNodeUserNFTs.length > 0) {
        const tokenIdCounter = await nodeRunnerContractReadOnly._tokenIds();
        for (let id = 1; id <= tokenIdCounter; id++) {
            const NFTOwner = await nodeRunnerContractReadOnly.ownerOf(id);
    
            if (NFTOwner == account) {
                if (currContractTokenURI == "") {
                  currContractTokenURI = await nodeRunnerContractReadOnly.tokenURI(id);
                  metaData = await axios.get(currContractTokenURI, {
                    headers: {
                      'Accept': '*/*'
                    }
                  });
                }
                
                currNFTDataList.push(Object.assign({}, metaData.data, {tokenId: id, contract: nodeRunnerContracts[i].Address}));
            }
        }   
        currUserNodeRunnerNFTs[nodeRunnerContracts[i].Name] = JSON.parse(JSON.stringify(currNFTDataList));
      }
    }

    setUserNodeRunnerNFTs(JSON.parse(JSON.stringify(currUserNodeRunnerNFTs)));
    setLoadingNodeRunnerContracts(false);
  }

  async function updateUserMarketNFTs() {
    let userMarketplaceNFTArray = [];

    const web3Modal = new Web3Modal({
      network: networkName,
      cacheProvider: true,
      })
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const cardinalMarketplaceContractReadOnly = new ethers.Contract(CardinalMarketplaceAddress, cardinalMarketplaceABI, provider);

    const userMarketItemsResult = await cardinalMarketplaceContractReadOnly.fetchUnsoldItemsCreated(account);

    for(let i = 0; i < userMarketItemsResult.length; i++) {
      const currTokenId = userMarketItemsResult[i].tokenId;
      const currNFTAddress = userMarketItemsResult[i].nftContract;

      if (currNFTAddress != CardinalNFTAddress) {
        const nodeRunnerContractReadOnly = new ethers.Contract(currNFTAddress, nodeRunnerABI, provider);

        const currTokenURI = await nodeRunnerContractReadOnly.tokenURI(currTokenId);
        const metaData = await axios.get(currTokenURI, {
          headers: {
            'Accept': '*/*'
          }
        });
        const price = (+ethers.utils.formatEther((BigInt(userMarketItemsResult[i].price._hex) * BigInt(Math.pow(10, 12))).toString(10))).toFixed(1).toString();
        const itemId = BigInt(userMarketItemsResult[i].itemId._hex).toString(10);
        userMarketplaceNFTArray.push(Object.assign({}, metaData.data, {price: price, tokenId: currTokenId, itemId: itemId, contract: currNFTAddress}));
      }
    }

    console.log(userMarketplaceNFTArray);
    setUserMarketNFTs(JSON.parse(JSON.stringify(userMarketplaceNFTArray)));
    setMarketNFTsLoaded(true);
  }

  useEffect(() => {
    if (isConnected) {
      updateUserMarketNFTs();
    }
  }, [userNodeRunnerNFTs])

  async function getNodeRunnerContracts() {
    const nodeRunnerContractsResponse = await axios.get("/api/noderunnercontracts");
    const nodeRunnerContracts = nodeRunnerContractsResponse.data;
    setNodeRunnerContracts(JSON.parse(JSON.stringify(nodeRunnerContracts)));
  }

  useEffect(() => {
    getNodeRunnerContracts();
  }, []);

  useEffect(() => {
    if (nodeRunnerContracts.length > 0 && isConnected) {
      getAccountInfo();
    }
  }, [nodeRunnerContracts])

  useEffect(() => {
    if (isConnected && !loadingNodeRunnerContracts) {
      getAccountInfo();
    }
  }, [isConnected, account]);

  function startNFTListing(nft, contractName) {
    setCurrNFT(nft);

    for (let i = 0; i < nodeRunnerContracts.length; i++) {
      if (nodeRunnerContracts[i].Name == contractName) {
        setCurrNodeRunnerContract(nodeRunnerContracts[i]);
        break;
      }
    }

    setShowListNFTModal(true);
    setNFTTransferApproved(false);
    setInputError("");
  }

  async function approveNFTTransferToMarketplace(tokenId) {
    if (NFTPrice > 0.0) {
      approveNFTTransfer(CardinalMarketplaceAddress, tokenId);
      setApprovingNFTTransfer(true);
    }
    else {
      setInputError("Price Must be Above 0 USDC");
    }
  }
  
  useEffect(() => {
    console.log(approveNFTTransferState);
    if (approveNFTTransferState.status === "Success") {
      setNFTTransferApproved(true);
      setApprovingNFTTransfer(false);
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Node Runner NFT Approved Successfully!");
      setTransactionHash(approveNFTTransferState.transaction.hash);
      getAccountInfo();
    }
    else if (approveNFTTransferState.status === "Exception") {
      setApprovingNFTTransfer(false);
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage(`Failed to Approve Node Runner NFT: ${approveNFTTransferState.errorMessage}`);
    }
    else if (approveNFTTransferState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Approving Node Runner NFT...");
      setTransactionHash(approveNFTTransferState.transaction.hash);
    }
    else if (approveNFTTransferState.status === "PendingSignature") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Waiting for User to Sign Transaction...");
      setTransactionHash("");
    }    
  }, [approveNFTTransferState])

  async function finalizeNFTListing(tokenId) {
    if (NFTPrice > 0.0 && NFTTransferApproved) {
      const web3Modal = new Web3Modal({
        network: networkName,
        cacheProvider: true,
        })
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const marketplaceContractReadOnly = new ethers.Contract(CardinalMarketplaceAddress, cardinalMarketplaceABI, provider);
      const nodeRunnerContractReadOnly = new ethers.Contract(currNodeRunnerContract.Address, nodeRunnerABI, provider);

      const price = Number(+ethers.utils.parseUnits(NFTPrice, 'ether')) / Math.pow(10, 12);
      let listingPrice = await nodeRunnerContractReadOnly.tokenIdToListingFee(tokenId);

      if (listingPrice <= 0) {
        listingPrice = await marketplaceContractReadOnly.getDefaultListingPrice();
      }

      createMarketItem(currNodeRunnerContract.Address, tokenId, price, {value: listingPrice});
      setListingNFT(true);
    }
  }

  useEffect(() => {
    console.log(createMarketItemState);
    if (createMarketItemState.status === "Success") {
      setNFTTransferApproved(false);
      setShowListNFTModal(false);
      setListingNFT(false);
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Node Runner NFT List Successfully!");
      setTransactionHash(createMarketItemState.transaction.hash);
      getAccountInfo();
    }
    else if (createMarketItemState.status === "Exception") {
      setListingNFT(false);
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setSubmissionMessage(`Failed to List Node Runner NFT: ${createMarketItemState.errorMessage}`);
    }
    else if (createMarketItemState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Listing Your Node Runner NFT...");
      setTransactionHash(createMarketItemState.transaction.hash);
    }
    else if (createMarketItemState.status === "PendingSignature") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Waiting for User to Sign Transaction...");
      setTransactionHash("");
    }
  }, [createMarketItemState])

  const cancelNFTListing = (itemId, contractAddress) => {
    setCancelingNFTListing(true);
    setCurrNFTCanceling(`${contractAddress}-${itemId}`);
    cancelMarketSale(contractAddress, itemId);
  }

  useEffect(() => {
    console.log(cancelMarketSaleState);
    if (cancelMarketSaleState.status === "Success") {
      setCurrNFTCanceling("");
      setCancelingNFTListing(false);
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Node Runner NFT Listing Canceled Successfully!");
      setTransactionHash(cancelMarketSaleState.transaction.hash);
      getAccountInfo();
    }
    else if (cancelMarketSaleState.status === "Exception") {
      setCurrNFTCanceling("");
      setCancelingNFTListing(false);
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setSubmissionMessage(`Failed to Cancel Node Runner NFT Listing: ${cancelMarketSaleState.errorMessage}`);
    }
    else if (cancelMarketSaleState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Listing Node Runner NFT...");
      setTransactionHash(cancelMarketSaleState.transaction.hash);
    }
    else if (cancelMarketSaleState.status === "PendingSignature") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Waiting for User to Sign Transaction...");
      setTransactionHash("");
    }
  }, [cancelMarketSaleState])

  const isNumeric = stringToTest => {
      return !isNaN(stringToTest) && !isNaN(parseFloat(stringToTest));
  }

  const updateNFTPrice = event => {
    const newAmount = event.target.value;

    if (isNumeric(+newAmount) || newAmount == ".") {
        setNFTPrice(event.target.value);
    }
    if (newAmount > 0.0) {
        setInputError("");
    }
  }

  return (
    <div className={clsx("mt-5 mb-5", styles.minimumHeightBackground, props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
      <Snackbar open={showSubmissionSuccess} autoHideDuration={6000} onClose={() => {setShowSubmissionSuccess(false)}}>
          <MuiAlert elevation={6} variant="filled" onClose={() => {setShowSubmissionSuccess(false)}} severity="success" sx={{ width: '100%' }} className="mobileSnackbarTextSize" >
              {submissionMessage} Transaction hash: <a className={styles.transactionHashLink} href={`https://polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noreferrer" >{transactionHash}</a>
          </MuiAlert>
      </Snackbar>
      <Snackbar open={showSubmissionFailure} autoHideDuration={6000} onClose={() => {setShowSubmissionFailure(false)}}>
          <MuiAlert elevation={6} variant="filled" onClose={() => {setShowSubmissionFailure(false)}} severity="error" sx={{ width: '100%' }} className="mobileSnackbarTextSize" >
              {submissionMessage}
          </MuiAlert>
      </Snackbar>
      <Snackbar open={showSubmissionPending} autoHideDuration={20000} onClose={() => {setShowSubmissionPending(false)}}>
          <MuiAlert elevation={6} variant="filled" onClose={() => {setShowSubmissionPending(false)}} severity="info" sx={{ width: '100%' }} className="mobileSnackbarTextSize" >
              {submissionMessage} {transactionHash && (<b>Transaction hash: <a className={styles.transactionHashLink} href={`https://polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noreferrer" >{transactionHash}</a></b>)}
          </MuiAlert>
      </Snackbar>

      <Modal aria-labelledby="ListNFTModal" centered show={showListNFTModal} onHide={() => setShowListNFTModal(false)}>
        <Modal.Header closeButton closeVariant={props.useDarkTheme ? "white" : "black"} className={clsx(styles.listModal, props.useDarkTheme ? styles.modalDark : styles.modalLight)}>
            <Modal.Title>
                <Typography variant="p" component="div" className={props.useDarkTheme ? styles.darkText : styles.lightText}>
                    List NFT: {currNFT.NFTName}
                </Typography>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className={clsx(styles.modalBody, props.useDarkTheme ? styles.modalDark : styles.modalLight)}>
            <Typography variant="h4" component="div" className={props.useDarkTheme ? styles.darkText : styles.lightText}>
                Set NFT Price
            </Typography>
            <TextField error={inputError != ""} label="Price in USDC" helperText={inputError}
                value={NFTPrice} onChange={updateNFTPrice} className={styles.priceInput} />
                <br/>
            {
                !NFTTransferApproved && (
                    <Button size="large" variant="contained" color="primary" onClick={() => approveNFTTransferToMarketplace(currNFT.tokenId)}
                        className={clsx(styles.listNFTBtn, props.useDarkTheme ? styles.btnDark : styles.btnLight)} 
                        disabled={approvingNFTTransfer}>
                        {approvingNFTTransfer && <CircularProgress size={18} color="secondary"/>} 
                        {approvingNFTTransfer ? <>&nbsp; Approving</> : "Approve NFT Transfer"}
                    </Button>
                )
            }
            {
                NFTTransferApproved && (
                    <Button size="large" variant="contained" color="primary" disabled
                        className={clsx(styles.listNFTBtn, props.useDarkTheme ? styles.btnDark : styles.btnLight)}>
                        NFT Transfer Approved
                    </Button>
                )
            }
            <br/>
            <Button size="large" variant="contained" color="primary" onClick={() => finalizeNFTListing(currNFT.tokenId)}
                className={clsx(styles.listNFTBtn, props.useDarkTheme ? styles.btnDark : styles.btnLight)}
                disabled={!NFTTransferApproved || listingNFT}>
                {listingNFT && <CircularProgress size={18} color="secondary"/>} 
                {listingNFT ? <>&nbsp; Listing</> : "List NFT for Sale"}
            </Button>
        </Modal.Body>
    </Modal>

      <main className={styles.container}>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={5} md={8} sm={10} xs={12} className={styles.headerTextGrid}>
            <Typography variant="h2" className={styles.headerText}>
              Your Node Runner NFTs
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 mb-5 text-center">
            <Typography variant="h3">
              Here is where you can see all of your Node Runner NFTs for each of the nodes 
              you have minted NFTs for. You can also list your Node Runner NFTs on the secondary marketplace
              here for whatever price you choose! Only other Cardinal Crew members will be able to purchase
              your Node Runner NFTs on the secondary marketplace.
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          {
            !isConnected && (
              <Grid item lg={8} md={8} sm={10} xs={12} className="text-center">
                <Typography variant="h3">
                  Connect Your Wallet to View Your Node Runner NFTs!
                </Typography>
              </Grid>
            )
          }

          {
            isConnected && !loadingNodeRunnerContracts && Object.keys(userNodeRunnerNFTs).length < 1 && (
              <Grid item lg={8} md={8} sm={10} xs={12} className="text-center">
                <Typography variant="h3">
                  You do not have any Node Runner NFTs! Head over to the "Purchase Node Runner NFTs"
                  page to mint your first Node Runner NFTs and become a partial owner of a validator node!
                </Typography>
              </Grid>              
            )
          }

          {
            isConnected && loadingNodeRunnerContracts && (
              <Grid item lg={8} md={8} sm={10} xs={12} className="text-center">
                <Typography variant="h3">
                  Loading your NFTs... This might take a bit if you have quite a few...
                </Typography>
              </Grid>              
            )
          }

          {
            isConnected && Object.keys(userNodeRunnerNFTs).map((nodeRunnerContractName) => {
              return (
                <Grid item xs={12}>
                  <Typography variant="h3" className={clsx("text-center mt-2", styles.yourNFTsHeader)}>
                    Your Node Runner NFTs for - {nodeRunnerContractName}
                  </Typography>
                  <Grid container justifyContent="center" alignItems="center" spacing={4} className="mt-5">
                    {
                      userNodeRunnerNFTs[nodeRunnerContractName].map((nodeRunnerNFT) => {
                        return (
                          <Grid item key={nodeRunnerNFT.tokenId} xs={10} sm={5} md={4} lg={3} className={clsx("mt-3", styles.NFTGrid)}>
                            <div className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")} onMouseEnter={() => setCurrNFTViewed(`${nodeRunnerNFT.contract}-${nodeRunnerNFT.tokenId}`)} onMouseLeave={() => setCurrNFTViewed("")}>
                              <img src={nodeRunnerNFT.image} className={clsx(styles.NFTImage)} />
                              <div className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                                <Typography variant="p" component="div" className="text-2xl font-bold">
                                  {nodeRunnerNFT.NFTName} {nodeRunnerNFT.tokenId}
                                </Typography>
                                {
                                    currNFTViewed != `${nodeRunnerNFT.contract}-${nodeRunnerNFT.tokenId}` && (
                                        <Typography variant="p" component="div" className={clsx(styles.nftDescriptionText,"font-bold mt-3")}>
                                            {nodeRunnerNFT.NFTDescription}
                                        </Typography>
                                    )
                                }
                                {
                                    currNFTViewed == `${nodeRunnerNFT.contract}-${nodeRunnerNFT.tokenId}` && (
                                        <Button size="medium" variant="contained" color="primary" onClick={() => startNFTListing(nodeRunnerNFT, nodeRunnerContractName)}
                                            className={clsx(styles.listNFTBtn, props.useDarkTheme ? styles.btnDark : styles.btnLight)}>
                                            List NFT for Sale
                                        </Button>
                                    )
                                }                                
                              </div>
                            </div>
                          </Grid>
                        )
                      })
                    }
                  </Grid>
                </Grid>
              )
            })
          }

          <Grid item xs={12}></Grid>

          {
            isConnected && userMarketNFTs.length > 0 && (
                <>
                  <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
                  <Grid item lg={5} md={8} sm={10} xs={12} className="mt-5">
                    <Typography variant="h3" className={clsx("text-center mt-5", styles.yourNFTsHeader)}>
                      Your Listed Node Runner NFTs
                    </Typography>
                  </Grid>
                  <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
                </>
            )
          }
          {
            isConnected && userMarketNFTs.length > 0 && (
                <Grid item xs={10}>
                    <Grid container justifyContent="center" alignItems="center" spacing={4}>
                        {
                            userMarketNFTs && (userMarketNFTs.map((nft, i) => (
                                <Grid key={i} item xs={12} sm={6} md={4} lg={3} className={styles.NFTGrid}>
                                    <div key={i} className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")} onMouseEnter={() => setCurrListedNFTViewed(`${nft.contract}-${nft.itemId}`)} onMouseLeave={() => setCurrListedNFTViewed("")}>
                                        <img src={nft.image} className={clsx(styles.NFTImage)} />
                                        <Grid container justifyContent="center" alignItems="center" className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                                            <Grid item xs={8} className={styles.nftNameAndDesc}>
                                                <Typography variant="p" component="div" className={clsx(styles.NFTName, "text-2xl font-bold")}>
                                                    {nft.NFTName} {parseInt(nft.tokenId.hex, 16)}
                                                </Typography>
                                                {
                                                    currListedNFTViewed != `${nft.contract}-${nft.itemId}` && currNFTCanceling != `${nft.contract}-${nft.itemId}` && (
                                                        <Typography variant="p" component="div" className={clsx(styles.NFTDescription, "font-bold mt-3")}>
                                                            {nft.NFTDescription}
                                                        </Typography>
                                                    )
                                                }
                                                {
                                                    (currListedNFTViewed == `${nft.contract}-${nft.itemId}` || currNFTCanceling == `${nft.contract}-${nft.itemId}`) && (
                                                        <Button size="small" variant="contained" color="primary" onClick={() => cancelNFTListing(nft.itemId, nft.contract)}
                                                            className={clsx(styles.listNFTBtn, props.useDarkTheme ? styles.btnDark : styles.btnLight)} disabled={cancelingNFTListing}>
                                                            {currNFTCanceling == `${nft.contract}-${nft.itemId}` && <CircularProgress size={18} color="secondary"/>} 
                                                            {currNFTCanceling == `${nft.contract}-${nft.itemId}` ? <>&nbsp; Canceling</> : "Cancel Listing"}
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

          <Grid item xs={12} className="mb-5"></Grid>
        </Grid>
      </main>
    </div>
  )
}
