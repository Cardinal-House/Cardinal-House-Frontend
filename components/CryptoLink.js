import Image from 'next/image';
import { Grid, Button, Typography, Card, CardContent, TextField, CircularProgress, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import clsx from 'clsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useEthers, useContractFunction } from "@usedapp/core";
import { utils, ethers } from "ethers";
import Web3Modal from 'web3modal';
import { Contract } from "@ethersproject/contracts";

import styles from '../styles/DApp.module.css';
import chainConfig from "../chain-config.json";
import ERC20 from "../contracts/ERC20.json";
import NodeRunner from "../contracts/NodeRunner.json";
import CardinalNFT from "../contracts/CardinalNFT.json";

const rpcEndpoint = "https://polygon-rpc.com";
// const rpcEndpoint = "https://rpc-mumbai.matic.today";
const polygonChainId = 137;
// const polygonChainId = 80001;

export default function CrytoLink(props) {
  const { account, chainId } = useEthers();
  const networkName = "polygon";
  const ERC20ABI = ERC20.abi;
  const nodeRunnerABI = NodeRunner.abi;
  const cardinalNFTABI = CardinalNFT.abi;
  const USDCAddress = chainConfig["USDCAddresses"][networkName];
  const NodeRunnerAddress = chainConfig["NodeRunnerAddresses"][networkName];
  const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
  const isConnected = account !== undefined && chainId == polygonChainId;

  const [nodeRunnerContracts, setNodeRunnerContracts] = useState([]);
  const [currNodeRunnerContract, setCurrNodeRunnerContract] = useState({});
  const [loadingNodeRunnerContracts, setLoadingNodeRunnerContracts] = useState(true);
  const [USDCBalance, setUSDCBalance] = useState(-1);
  const [nodeRunnerTokenURI, setNodeRunnerTokenURI] = useState("");
  const [nodeRunnerNFTPrice, setNodeRunnerNFTPrice] = useState(0);
  const [numNFTsToPurchase, setNumNFTsToPurchase] = useState(1);
  const [maxNFTCount, setMaxNFTCount] = useState(0);
  const [numNFTsPurchased, setNumNFTsPurchased] = useState(-1);
  const [revertWarning, setRevertWarning] = useState("");
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [approvingUSDC, setApprovingUSDC] = useState(false);
  const [USDCApproved, setUSDCApproved] = useState(false);
  const [purchasingNodeRunnerNFT, setPurchasingNodeRunnerNFT] = useState(false);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [showSubmissionFailure, setShowSubmissionFailure] = useState(false);
  const [showSubmissionPending, setShowSubmissionPending] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const USDCInterface = new utils.Interface(ERC20ABI);
  const USDCContract = new Contract(USDCAddress, USDCInterface);
  const nodeRunnerInterface = new utils.Interface(nodeRunnerABI);
  const nodeRunnerContract = new Contract(currNodeRunnerContract.Address ? currNodeRunnerContract.Address : NodeRunnerAddress, nodeRunnerInterface);

  const { send: approveUSDC, state: approveUSDCState } =
  useContractFunction(USDCContract, "approve", {
      transactionName: "Approve USDC for Purchasing Bridge Miner NFT(s).",
  })

  const { send: purchaseNodeRunnerNFT, state: purchasingNodeRunnerNFTState } =
  useContractFunction(nodeRunnerContract, "mintNodeRunnerNFT", {
      transactionName: "Mint Bridge Miner NFT(s).",
  })

  async function getInitialContractValues() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: polygonChainId });
    const nodeRunnerContractReadOnly = new ethers.Contract(currNodeRunnerContract.Address, nodeRunnerABI, provider);

    const currNodeRunnerNFTPriceObj = await nodeRunnerContractReadOnly.NFTPriceInUSDC();
    const currNodeRunnerNFTPrice = +ethers.utils.formatEther(BigInt(parseInt(currNodeRunnerNFTPriceObj._hex, 16)).toString(10));
    setNodeRunnerNFTPrice(currNodeRunnerNFTPrice * Math.pow(10, 12));

    const currMaxNFTObj = await nodeRunnerContractReadOnly.maxNFTs();
    const currMaxNFT = parseInt(currMaxNFTObj._hex, 16);
    setMaxNFTCount(currMaxNFT);

    const currNumNFTsPurchasedObj = await nodeRunnerContractReadOnly._tokenIds();
    const currNumNFTsPurchased = parseInt(currNumNFTsPurchasedObj._hex, 16);
    setNumNFTsPurchased(currNumNFTsPurchased);

    const currNodeRunnerTokenURILink = await nodeRunnerContractReadOnly.nodeRunnerTokenURI();
    const currNodeRunnerTokenURIData = await axios.get(currNodeRunnerTokenURILink, {
      headers: {
        'Accept': '*/*'
      }
    });
    setNodeRunnerTokenURI(currNodeRunnerTokenURIData.data);
  }

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

    const currApprovedAmountObj = await USDCContractReadOnly.allowance(account, currNodeRunnerContract.Address);
    const currApprovedAmount = +ethers.utils.formatEther(BigInt(parseInt(currApprovedAmountObj._hex, 16)).toString(10));
    setApprovedAmount(currApprovedAmount * Math.pow(10, 12));
  }

  async function getNodeRunnerContracts() {
    const nodeRunnerContractsResponse = await axios.get("/api/noderunnercontracts");
    const nodeRunnerContracts = nodeRunnerContractsResponse.data;
    let currNodeRunnerContracts = [];
    
    for (let i = 0; i < nodeRunnerContracts.length; i++) {
      const currentNodeRunnerContract = nodeRunnerContracts[i];
      if (currentNodeRunnerContract.IsCryptoLinkPrimary) {
      // if (currentNodeRunnerContract.IsCryptoLinkPrimary) {
        setCurrNodeRunnerContract(currentNodeRunnerContract);
      }

      if (currentNodeRunnerContract.IsCryptoLinkOpen) {
      // if (currentNodeRunnerContract.IsCryptoLinkOpen) {
        currNodeRunnerContracts.push(currentNodeRunnerContract);
      }
    }

    setNodeRunnerContracts(JSON.parse(JSON.stringify(currNodeRunnerContracts)));
  }

  useEffect(() => {
    getNodeRunnerContracts();
  }, []);

  useEffect(() => {
    if (currNodeRunnerContract.Address) {
      setNumNFTsToPurchase(1);
      setRevertWarning("");
      setNodeRunnerTokenURI("");
      getInitialContractValues();

      if (isConnected) {
        getAccountInfo();
      }
      
      setLoadingNodeRunnerContracts(false);
    }
  }, [currNodeRunnerContract])

  useEffect(() => {
    if (isConnected && !loadingNodeRunnerContracts) {
      getAccountInfo();
    }
  }, [isConnected, account]);

  const startApproveUSDC = () => {
    const totalPrice = numNFTsToPurchase * nodeRunnerNFTPrice;
    approveUSDC(currNodeRunnerContract.Address, ethers.utils.parseEther(totalPrice.toString()));
  }

  const startNodeRunnerNFTMint = () => {
    purchaseNodeRunnerNFT(numNFTsToPurchase);
  }

  useEffect(() => {
    console.log(approveUSDCState);
    if (approveUSDCState.status === "Success") {
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setApprovingUSDC(false);
      setSubmissionMessage("USDC approved successfully! Click the \"Mint Bridge Miner NFT(s)\" button to finalize your buy!");
      setUSDCApproved(true);
      setTransactionHash(approveUSDCState.transaction.hash);
    }
    else if (approveUSDCState.status === "Exception") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setApprovingUSDC(false);
      setSubmissionMessage(`Failed to approve USDC: ${approveUSDCState.errorMessage}`);
    }
    else if (approveUSDCState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setApprovingUSDC(true);
      setSubmissionMessage("Approving USDC...");
      setTransactionHash(approveUSDCState.transaction.hash);
    }
    else if (approveUSDCState.status === "PendingSignature") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setApprovingUSDC(true);
      setSubmissionMessage("Waiting for User to Sign Transaction...");
      setTransactionHash("");
    }
  }, [approveUSDCState])

  useEffect(() => {
    console.log(purchasingNodeRunnerNFTState);
    if (purchasingNodeRunnerNFTState.status === "Success") {
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setPurchasingNodeRunnerNFT(false);
      getInitialContractValues();
      getAccountInfo();
      props.updateTempTokenBalance();
      setSubmissionMessage("Bridge Miner NFT(s) Minted Successfully!");
      setTransactionHash(purchasingNodeRunnerNFTState.transaction.hash);
    }
    else if (purchasingNodeRunnerNFTState.status === "Exception") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setPurchasingNodeRunnerNFT(false);
      setSubmissionMessage(`Failed to Buy Bridge Miner NFT(s): ${purchasingNodeRunnerNFTState.errorMessage}`);
    }
    else if (purchasingNodeRunnerNFTState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setPurchasingNodeRunnerNFT(true);
      setSubmissionMessage("Minting Bridge Miner NFT(s)...");
      setTransactionHash(purchasingNodeRunnerNFTState.transaction.hash);
    }
    else if (purchasingNodeRunnerNFTState.status === "PendingSignature") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setPurchasingNodeRunnerNFT(true);
      setSubmissionMessage("Waiting for User to Sign Transaction...");
      setTransactionHash("");
    }
  }, [purchasingNodeRunnerNFTState])

  const isNumeric = stringToTest => {
    return !isNaN(stringToTest) && !isNaN(parseInt(stringToTest));
  }

  const updateNumNFTsToPurchase = (event) => {
    const newAmount = event.target.value;

    if (!isNumeric(+newAmount) || newAmount.includes(".") || newAmount.includes("-")) {
      return;
    }
    else if (newAmount.length > 3) {
      return;
    }

    setNumNFTsToPurchase(newAmount);

    if (newAmount > maxNFTCount - numNFTsPurchased) {
      setRevertWarning(`Transaction will revert: there are only ${maxNFTCount - numNFTsPurchased} NFTs left to purchase for this Bridge Miner!`);
    }
    else {
      setRevertWarning("");
    }
  }

  const updateCurrNodeRunnerContract = (event) => {
    const newContractName = event.target.value;

    for (let i = 0; i < nodeRunnerContracts.length; i++) {
      if (nodeRunnerContracts[i].Name == newContractName) {
        setCurrNodeRunnerContract(nodeRunnerContracts[i]);
        setLoadingNodeRunnerContracts(true);
        return;
      }
    }
  }

  const approvalDisabled = approvingUSDC || USDCApproved || !isConnected || numNFTsToPurchase < 1 || approvedAmount >= Number(+ethers.utils.parseEther(BigInt(numNFTsToPurchase * nodeRunnerNFTPrice).toString(10)));
  const mintDisabled = purchasingNodeRunnerNFT || numNFTsToPurchase < 1 || (!USDCApproved && approvedAmount < Number(+ethers.utils.parseEther(BigInt(numNFTsToPurchase * nodeRunnerNFTPrice).toString(10))));

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
      <main className={styles.container}>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={5} md={8} sm={10} xs={12} className={styles.headerTextGrid}>
            <Typography variant="h2" className={clsx(styles.headerText, styles.CryptoLinkHeaderText)}>
              Purchase Bridge Miner NFTs
            </Typography>
            <div className={styles.CryptoLinkHeaderBottom}></div>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={1} sm={1} xs={0}></Grid>
          <Grid item xs={12} sm={10} md={10} lg={8} className={styles.NFTGrid}>
            <Card className={clsx(styles.customCard, props.useDarkTheme ? styles.customCardTransparentDark : styles.customCardTransparentLight)}>
                <CardContent>
                  <Image src="/CryptoLink.webp" width="115" height="100" />
                  <Typography variant="h2" className="mt-4">
                    Purchase Bridge Miner NFTs - A CryptoLink Raise
                  </Typography>
                  {
                    loadingNodeRunnerContracts && (
                      <CircularProgress size={80} className="mt-5 text-center" />
                    )
                  }
                  {
                    !loadingNodeRunnerContracts && (
                      <>
                        {nodeRunnerNFTPrice > 0 && (
                          <Typography variant="h3" className="mt-4">
                            Bridge Miner NFT Price: 
                            <b>
                              &nbsp;{nodeRunnerNFTPrice.toFixed(3)}&nbsp;
                            </b>
                            USDC
                          </Typography>
                        )}
                        <Grid container justifyContent="center" alignItems="center" spacing={4} className="mt-4 text-center">
                          <Grid item lg={4} md={5} xs={12} className="mt-2">
                            <TextField label="NFT Count" variant="outlined" value={numNFTsToPurchase} onChange={(e) => updateNumNFTsToPurchase(e)} />
                          </Grid>
                          {numNFTsToPurchase > 0 && (
                            <Grid item xs={12}>
                              <Typography variant="h3" className="mt-4">
                                Price for {numNFTsToPurchase.toString()} {numNFTsToPurchase == 1 ? "NFT" : "NFTs"}:
                                <b>
                                  &nbsp;{(nodeRunnerNFTPrice * numNFTsToPurchase).toFixed(3)}&nbsp;
                                </b>
                                USDC
                              </Typography>
                            </Grid>
                          )}
                          {revertWarning != "" && (
                            <Grid item xs={12} className="mt-2">
                              <Typography variant="h3" className="text-danger">
                                {revertWarning}
                              </Typography>
                            </Grid>
                          )}
                          {
                            <>
                              <Grid item xs={12}>
                                <Button size="large" variant="outlined" color="primary"
                                  disabled={approvalDisabled} 
                                  onClick={startApproveUSDC} className={clsx(styles.CryptoLinkButtonPurple, !approvalDisabled ? styles.CryptoLinkButtonPurpleActive : "")}>
                                  {approvingUSDC && <CircularProgress size={18} color="secondary"/>}
                                  {isConnected ? approvingUSDC ? <>&nbsp; Approving USDC...</> : "Approve USDC" : "Connect Wallet in Navigation"}
                                </Button>
                              </Grid>
                              <Grid item xs={12}>
                                {isConnected && (
                                  <Button size="large" variant="outlined" color="primary"
                                    disabled={mintDisabled} 
                                    onClick={startNodeRunnerNFTMint} className={clsx(styles.CryptoLinkButtonGreen, !mintDisabled ? styles.CryptoLinkButtonGreenActive : "")}>
                                    {purchasingNodeRunnerNFT && <CircularProgress size={18} color="secondary"/>}
                                    {purchasingNodeRunnerNFT ? <>&nbsp; Minting Bridge Miner NFT(s)...</> : "Mint Bridge Miner NFT(s)"}
                                  </Button>
                                )}
                              </Grid>
                            </>
                          }
                        </Grid>                      
                      </>
                    )
                  }
                </CardContent>
            </Card>
          </Grid>
          <Grid item lg={2} md={1} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="text-center">
            <Typography variant="h3">
              Here is where you mint Bridge Miner NFTs for CryptoLink's Bridge Miner raise!
              There are only so many NFTs that can be minted for this Bridge Miner.
              You can also mint more than one NFT as long as there are enough NFTs
              left to be minted! This Bridge Miner raise is powered by the Node Runner technology
              developed by Cardinal House, but the raise itself is put on by the CryptoLink team.
            </Typography>
            <br/>
            <Typography variant="h3" className="mt-3">
              When you mint one or more Bridge Miner NFTs, the USDC you send into the
              contract will be used along with other Bridge Miner NFT minters to purchase a CryptoLink
              Bridge Miner on the Binance Smart Chain. Then, each month,
              the rewards from the Bridge Miner will be put back into the
              contract for you and the other NFT holders to claim on Polygon.
              The NFT purchasing and reward claiming is on Polygon while the Bridge Miner itself is
              on Binance simply because the underlying Node Runner technology is on Polygon.
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          {nodeRunnerTokenURI != "" && (
            <>
              <Grid item xs={12} className="mt-4">
                  <Typography variant="h3" className="text-center">
                    Example Bridge Miner NFT
                  </Typography>
              </Grid>

              <Grid item xs={10} sm={6} md={5} lg={3} className={clsx("mt-3", styles.NFTGrid)}>
                <div className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")}>
                  <img src={nodeRunnerTokenURI.image} className={clsx(styles.NFTImage)} />
                  <div className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                    <Typography variant="p" component="div" className="text-2xl font-bold">
                      {nodeRunnerTokenURI.NFTName}
                    </Typography>
                    <Typography variant="p" component="div" className={clsx(styles.nftDescriptionText,"font-bold mt-3")}>
                      {nodeRunnerTokenURI.NFTDescription}
                    </Typography>
                  </div>
                </div>
              </Grid>            
            </>
          )}

          <Grid item xs={12} className="mb-5"></Grid>
        </Grid>
      </main>
    </div>
  )
}
