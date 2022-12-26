import Image from 'next/image';
import { Grid, Button, Typography, TextField, CircularProgress } from '@mui/material';
import clsx from 'clsx';
import axios from 'axios';
import { Modal } from "react-bootstrap";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import { useEthers, useContractFunction } from "@usedapp/core";
import { utils, ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import Web3Modal from 'web3modal';
import { ImPriceTag } from 'react-icons/im';

import styles from '../styles/DApp.module.css';
import chainConfig from "../chain-config.json";
import cardinalHouseLogo from '../public/CardinalLogoLight.png';
import CardinalNFT from "../contracts/CardinalNFT.json";
import CardinalHouseMarketplace from "../contracts/CardinalHouseMarketplace.json";

const rpcEndpoint = "https://rpc-mainnet.maticvigil.com";
// const rpcEndpoint = "https://rpc-mumbai.matic.today";
const polygonChainId = 137;
// const polygonChainId = 80001;

export default function OriginalCardinalNFT(props) {
    const { account, chainId } = useEthers();
    const networkName = "polygon";
    const cardinalNFTABI = CardinalNFT.abi;
    const cardinalMarketplaceABI = CardinalHouseMarketplace.abi;
    const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
    const CardinalMarketplaceAddress = chainConfig["CardinalNFTMarketplaceAddresses"][networkName];
    const isConnected = account !== undefined && chainId == polygonChainId;

  const [originalCardinalNFT, setOriginalCardinalNFT] = useState({});
  const [viewingNFT, setViewingNFT] = useState(false);
  const [inputError, setInputError] = useState("");
  const [NFTPrice, setNFTPrice] = useState(0.0);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [showSubmissionFailure, setShowSubmissionFailure] = useState(false);
  const [showSubmissionPending, setShowSubmissionPending] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [showListNFTModal, setShowListNFTModal] = useState(false);
  const [NFTTransferApproved, setNFTTransferApproved] = useState(false);
  const [approvingNFTTransfer, setApprovingNFTTransfer] = useState(false);
  const [listingNFT, setListingNFT] = useState(false);
  const [listedOriginalCardinalNFT, setListedOriginalCardinalNFT] = useState({});
  const [listedNFTViewed, setListedNFTViewed] = useState("");
  const [cancelingNFTListing, setCancelingNFTListing] = useState(false);

  const cardinalNFTInterface = new utils.Interface(cardinalNFTABI);
  const cardinalNFTContract = new Contract(CardinalNFTAddress, cardinalNFTInterface);
  const cardinalMarketplaceInterface = new utils.Interface(cardinalMarketplaceABI);
  const cardinalMarketplaceContract = new Contract(CardinalMarketplaceAddress, cardinalMarketplaceInterface);

  const { send: approveNFTTransfer, state: approveNFTTransferState } =
    useContractFunction(cardinalNFTContract, "approve", {
        transactionName: "Approve the Cardinal House NFT marketplace to transfer your Original Cardinal NFT",
  })

  const { send: createMarketItem, state: createMarketItemState } =
    useContractFunction(cardinalMarketplaceContract, "createMarketItem", {
        transactionName: "List an Original Cardinal NFT on the Marketplace",
  })

  const { send: cancelMarketSale, state: cancelMarketSaleState } =
    useContractFunction(cardinalMarketplaceContract, "cancelMarketSale", {
        transactionName: "Cancel a Original Cardinal NFT listing on the Marketplace",
  })

  async function getTokenURI() {
    const web3Modal = new Web3Modal({
      network: networkName,
      cacheProvider: true,
      })
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const nftContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);

    const originalCardinalNFTs = await nftContractReadOnly.getUserOriginalCardinalTokenURIs(account);

    if (originalCardinalNFTs.length > 0) {
      const originalCardinalNFTData = await axios.get(originalCardinalNFTs[0], {
        headers: {
          'Accept': '*/*'
        }
      });

      const tokenIdCounter = await nftContractReadOnly._tokenIds();
      for (let id = 1; id <= tokenIdCounter; id++) {
          const currTokenURI = await nftContractReadOnly.tokenURI(id);
  
          if (originalCardinalNFTs[0] == currTokenURI) {
              setOriginalCardinalNFT(Object.assign({}, originalCardinalNFTData.data, {tokenId: id}));
              break;
          }
      }   
    }
    else {
      setOriginalCardinalNFT({});
    }
  }

  async function getUserListedOCNFT() {
    const web3Modal = new Web3Modal({
      network: networkName,
      cacheProvider: true,
      })
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const cardinalMarketplaceContractReadOnly = new ethers.Contract(CardinalMarketplaceAddress, cardinalMarketplaceABI, provider);
    const nftContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);

    const userMarketItemsResult = await cardinalMarketplaceContractReadOnly.fetchUnsoldItemsCreated(account);
    const originalCardinalTypeId = (await nftContractReadOnly.originalCardinalTypeId())._hex;

    for(let i = 0; i < userMarketItemsResult.length; i++) {
      const currTokenId = userMarketItemsResult[i].tokenId;
      const currNFTAddress = userMarketItemsResult[i].nftContract;

      if (currNFTAddress == CardinalNFTAddress) {
        const currTokenTypeId = (await nftContractReadOnly.tokenIdToTypeId(currTokenId))._hex;

        if (currTokenTypeId == originalCardinalTypeId) {
          const currTokenURI = await nftContractReadOnly.tokenURI(currTokenId);
          const metaData = await axios.get(currTokenURI, {
            headers: {
              'Accept': '*/*'
            }
          });
          const price = (+ethers.utils.formatEther(BigInt(userMarketItemsResult[i].price._hex).toString(10)) * Math.pow(10, 12)).toFixed(1).toString();
          const itemId = BigInt(userMarketItemsResult[i].itemId._hex).toString(10);
          setListedOriginalCardinalNFT(Object.assign({}, metaData.data, {price: price, itemId: itemId}));
          return;
        }
      }
    }

    setListedOriginalCardinalNFT({});
  }

  useEffect(() => {
    if (isConnected) {
      getTokenURI();
      getUserListedOCNFT();
    }
  }, [isConnected]);

  function startNFTListing() {
    setShowListNFTModal(true);
    setNFTTransferApproved(false);
    setInputError("");
  }    

  async function approveNFTTransferToMarketplace() {
    if (NFTPrice > 0.0) {
      approveNFTTransfer(CardinalMarketplaceAddress, originalCardinalNFT.tokenId);
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
      setSubmissionMessage("Original Cardinal NFT Approved Successfully!");
      setTransactionHash(approveNFTTransferState.transaction.hash);
    }
    else if (approveNFTTransferState.status === "Exception") {
      setApprovingNFTTransfer(false);
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage(`Failed to Approve Original Cardinal NFT: ${approveNFTTransferState.errorMessage}`);
    }
    else if (approveNFTTransferState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Approving Original Cardinal NFT...");
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

  async function finalizeNFTListing() {
    if (NFTPrice > 0.0 && NFTTransferApproved) {
      const web3Modal = new Web3Modal({
        network: networkName,
        cacheProvider: true,
        })
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const marketplaceContractReadOnly = new ethers.Contract(CardinalMarketplaceAddress, cardinalMarketplaceABI, provider);
      const nftContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);

      const price = NFTPrice * Math.pow(10, 6);
      let listingPrice = await nftContractReadOnly.tokenIdToListingFee(originalCardinalNFT.tokenId);

      if (listingPrice <= 0) {
        listingPrice = await marketplaceContractReadOnly.getDefaultListingPrice();
      }

      createMarketItem(CardinalNFTAddress, originalCardinalNFT.tokenId, price, {value: listingPrice});
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
      getTokenURI();
      getUserListedOCNFT();
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

  const cancelNFTListing = () => {
    setCancelingNFTListing(true);
    cancelMarketSale(CardinalNFTAddress, listedOriginalCardinalNFT.itemId);
  }

  useEffect(() => {
    console.log(cancelMarketSaleState);
    if (cancelMarketSaleState.status === "Success") {
      setCancelingNFTListing(false);
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Original Cardinal NFT Listing Canceled Successfully!");
      setTransactionHash(cancelMarketSaleState.transaction.hash);
      getTokenURI();
      getUserListedOCNFT();
    }
    else if (cancelMarketSaleState.status === "Exception") {
      setCancelingNFTListing(false);
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setSubmissionMessage(`Failed to Cancel Original Cardinal NFT Listing: ${cancelMarketSaleState.errorMessage}`);
    }
    else if (cancelMarketSaleState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setSubmissionMessage("Listing Original Cardinal NFT...");
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
    <div className={clsx("mt-5 mb-5", props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
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
                    List Your Original Cardinal NFT
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
                    <Button size="large" variant="contained" color="primary" onClick={() => approveNFTTransferToMarketplace()}
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
            <Button size="large" variant="contained" color="primary" onClick={() => finalizeNFTListing()}
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
              Original Cardinal NFTs
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 text-center">
            <Typography variant="h3">
              Cardinal House rewards outstanding members of the early community by giving them
              Original Cardinal NFTs. Each Original Cardinal NFT entitles the owner to a free lifetime
              Cardinal House membership! If you received an Original Cardinal NFT, connect your wallet
              here to see it!
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          {
            Object.keys(originalCardinalNFT).length > 0 && (
              <Grid item xs={12} sm={6} md={4} lg={3} className={clsx("mt-3", styles.NFTGrid)}>
                <Typography variant="h2" className={clsx("mb-3", styles.serviceHeaderText)}>
                  Your Original Cardinal NFT
                </Typography>
                <div className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")} onMouseEnter={() => setViewingNFT(true)} onMouseLeave={() => setViewingNFT(false)}>
                  <img src={originalCardinalNFT.image.replace("https", "http")} className={clsx(styles.NFTImage)} />
                  <div className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                    <Typography variant="p" component="div" className="text-2xl font-bold">
                      {originalCardinalNFT.NFTName}
                    </Typography>
                    {
                        !viewingNFT && (
                          <Typography variant="p" component="div" className={clsx(styles.nftDescriptionText,"font-bold mt-3")}>
                            {originalCardinalNFT.NFTDescription}
                          </Typography>
                        )
                    }
                    {
                        viewingNFT && (
                            <Button size="medium" variant="contained" color="primary" onClick={startNFTListing}
                                className={clsx(styles.listNFTBtn, props.useDarkTheme ? styles.btnDark : styles.btnLight)}>
                                List NFT for Sale
                            </Button>
                        )
                    }                       
                  </div>
                </div>
              </Grid>
            )
          }

          {
            Object.keys(listedOriginalCardinalNFT).length > 0 && (
              <Grid item xs={12} sm={6} md={4} lg={3} className={clsx("mt-3", styles.NFTGrid)}>
                <Typography variant="h2" className={clsx("mb-3", styles.serviceHeaderText)}>
                  Your Listed Original Cardinal NFT
                </Typography>
                <div className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")} onMouseEnter={() => setListedNFTViewed(true)} onMouseLeave={() => setListedNFTViewed(false)}>
                    <img src={listedOriginalCardinalNFT.image} className={clsx(styles.NFTImage)} />
                    <Grid container justifyContent="center" alignItems="center" className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                        <Grid item xs={8} className={styles.nftNameAndDesc}>
                            <Typography variant="p" component="div" className={clsx(styles.NFTName, "text-2xl font-bold")}>
                                {listedOriginalCardinalNFT.NFTName}
                            </Typography>
                            {
                                !listedNFTViewed && !cancelingNFTListing && (
                                    <Typography variant="p" component="div" className={clsx(styles.NFTDescription, "font-bold mt-3")}>
                                        {listedOriginalCardinalNFT.NFTDescription}
                                    </Typography>
                                )
                            }
                            {
                                (listedNFTViewed || cancelingNFTListing) && (
                                    <Button size="small" variant="contained" color="primary" onClick={() => cancelNFTListing()}
                                        className={clsx(styles.listNFTBtn, props.useDarkTheme ? styles.btnDark : styles.btnLight)} disabled={cancelingNFTListing}>
                                        {cancelingNFTListing && <CircularProgress size={18} color="secondary"/>} 
                                        {cancelingNFTListing ? <>&nbsp; Canceling</> : "Cancel Listing"}
                                    </Button>
                                )
                            }
                        </Grid>
                        <Grid item xs={4} className={styles.nftPrice}>
                            <Typography variant="p" component="div" className={clsx(styles.NFTPrice, "font-bold")}>
                                <ImPriceTag /> Price
                            </Typography>
                            <Typography variant="p" component="div" className={clsx(styles.NFTPrice, "font-bold mt-3")}>
                                {Number(listedOriginalCardinalNFT.price).toLocaleString()} USDC
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
              </Grid>
            )
          }       

          <Grid item xs={12}>
            <Typography variant="h2" className={styles.serviceHeaderText}>
              Membership Benefits
            </Typography>
          </Grid>
          <Grid item lg={3} md={4} sm={8} xs={10}>
            <Image src={cardinalHouseLogo} layout="responsive" />
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            <Typography variant="h3">
              There are many benefits to being a Cardinal House member, including exclusive educational content around trading and crypto knowledge, 
              giveaways, whitelist spots for projects that come into the community for AMAs, special events hosted for members only such as 
              technical analysis sessions, interviews with project owners, and so much more!
            </Typography>
          </Grid>

        </Grid>
      </main>
    </div>
  )
}
