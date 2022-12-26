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

const rpcEndpoint = "https://rpc-mainnet.maticvigil.com";
// const rpcEndpoint = "https://rpc-mumbai.matic.today";
const polygonChainId = 137;
// const polygonChainId = 80001;

export default function PurchaseNodeRunner(props) {
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
  const [isCardinalMember, setIsCardinalMember] = useState(undefined);
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
      transactionName: "Approve USDC for Purchasing Node Runner NFT(s).",
  })

  const { send: purchaseNodeRunnerNFT, state: purchasingNodeRunnerNFTState } =
  useContractFunction(nodeRunnerContract, "mintNodeRunnerNFT", {
      transactionName: "Mint Node Runner NFT(s).",
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
    const nodeRunnerContractReadOnly = new ethers.Contract(currNodeRunnerContract.Address, nodeRunnerABI, provider);
    const USDCContractReadOnly = new ethers.Contract(USDCAddress, ERC20ABI, provider);
    const cardinalNFTContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);

    const currIsCardinalMember = await cardinalNFTContractReadOnly.addressIsMember(account);
    setIsCardinalMember(currIsCardinalMember);

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
      if (currentNodeRunnerContract.IsPrimary) {
        setCurrNodeRunnerContract(currentNodeRunnerContract);
      }

      if (currentNodeRunnerContract.IsOpen) {
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
      setSubmissionMessage("USDC approved successfully! Click the \"Mint Node Runner NFT(s)\" button to finalize your buy!");
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
      setSubmissionMessage("Node Runner NFT(s) Minted Successfully!");
      setTransactionHash(purchasingNodeRunnerNFTState.transaction.hash);
    }
    else if (purchasingNodeRunnerNFTState.status === "Exception") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setPurchasingNodeRunnerNFT(false);
      setSubmissionMessage(`Failed to Buy Node Runner NFT(s): ${purchasingNodeRunnerNFTState.errorMessage}`);
    }
    else if (purchasingNodeRunnerNFTState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setPurchasingNodeRunnerNFT(true);
      setSubmissionMessage("Minting Node Runner NFT(s)...");
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
      setRevertWarning(`Transaction will revert: there are only ${maxNFTCount - numNFTsPurchased} NFTs left to purchase for this node! Another node will be available soon.`);
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
            <Typography variant="h2" className={styles.headerText}>
              Purchase Node Runner NFTs
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={1} sm={1} xs={0}></Grid>
          <Grid item xs={12} sm={10} md={10} lg={8} className={styles.NFTGrid}>
            <Card className={clsx(styles.customCard, props.useDarkTheme ? styles.customCardTransparentDark : styles.customCardTransparentLight)}>
                <CardContent>
                  <Typography variant="h2">
                    Purchase Node Runner NFTs for {currNodeRunnerContract.Name}
                  </Typography>
                  {
                    loadingNodeRunnerContracts && (
                      <CircularProgress size={80} className="mt-5 text-center" />
                    )
                  }
                  {
                    !loadingNodeRunnerContracts && (
                      <>
                        {isCardinalMember != undefined && (
                          <Typography variant="h3" className="mt-5">
                            Crew Membership Status: {isCardinalMember ? <b className="text-success">Crew Membership Active!</b> : "Not a Crew Member"}
                          </Typography>
                        )}
                        {nodeRunnerNFTPrice > 0 && (
                          <Typography variant="h3" className="mt-4">
                            Node Runner NFT Price: 
                            <b>
                              &nbsp;{nodeRunnerNFTPrice.toFixed(3)}&nbsp;
                            </b>
                            USDC
                          </Typography>
                        )}
                        {/* USDCBalance > -1 && (
                          <Typography variant="h3" className="mt-4">
                            Your USDC Balance: 
                            <b>
                              &nbsp;{(USDCBalance * Math.pow(10, 12)).toFixed(3)}&nbsp;
                            </b>
                            USDC
                          </Typography>
                        ) */}
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
                            (!isConnected || isCardinalMember) && (
                              <>
                                <Grid item xs={12}>
                                  <Button size="large" variant="contained" color="primary"
                                    disabled={approvingUSDC || USDCApproved || !isConnected || numNFTsToPurchase < 1 || approvedAmount >= Number(+ethers.utils.parseEther(BigInt(numNFTsToPurchase * nodeRunnerNFTPrice).toString(10)))} 
                                    onClick={startApproveUSDC}>
                                    {approvingUSDC && <CircularProgress size={18} color="secondary"/>}
                                    {isConnected ? approvingUSDC ? <>&nbsp; Approving USDC...</> : "Approve USDC" : "Connect Wallet in Navigation"}
                                  </Button>
                                </Grid>
                                <Grid item xs={12}>
                                  {isConnected && (
                                    <Button size="large" variant="contained" color="primary"
                                      disabled={purchasingNodeRunnerNFT || numNFTsToPurchase < 1 || (!USDCApproved && approvedAmount < Number(+ethers.utils.parseEther(BigInt(numNFTsToPurchase * nodeRunnerNFTPrice).toString(10))))} 
                                      onClick={startNodeRunnerNFTMint}>
                                      {purchasingNodeRunnerNFT && <CircularProgress size={18} color="secondary"/>}
                                      {purchasingNodeRunnerNFT ? <>&nbsp; Minting Node Runner NFT(s)...</> : "Mint Node Runner NFT(s)"}
                                    </Button>
                                  )}
                                </Grid>
                              </>
                            )
                          }
                          {
                            isConnected && !isCardinalMember && (
                              <Grid item xs={12}>
                                <Button size="large" variant="contained" color="primary" disabled={true}>
                                  You Must be a Cardinal Crew Member!
                                </Button>
                              </Grid>
                            )
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
              Here is where you mint Node Runner NFTs to own a portion of a validator node!
              You must be a Cardinal Crew Member to mint a Node Runner NFT, and there are only
              so many NFTs that can be minted per node depending on how much the node is split up.
              You can also mint more than one NFT per node as long as there are enough NFTs
              left to be minted!
            </Typography>
            <br/>
            <Typography variant="h3" className="mt-3">
              When you mint one or more Node Runner NFTs, the USDC you send into the Node Runner
              contract will be used along with other Node Runner NFT minters to purchase a validator
              node on a network that changes from node to node (DAG, Ethereum, etc.). Then, each month,
              the Cardinal House team will deposit the rewards from the node back into the Node Runner
              contract for the node for you and the other NFT holders to claim. For example, if a node
              is split into 20 NFTs and you mint 2 of them, each month you will be able to claim 10%
              of the node rewards.
            </Typography>
            {
              nodeRunnerContracts.length > 1 && (
                <>
                  <br/>
                  <Typography variant="h3" className="mt-3">
                    First, select the node below that you want to mint NFTs for. When Node Runner first launches
                    there will just be one node to mint NFTs for, but in the future and as demand increases,
                    there will be multiple Node Runner NFT collections at the same time. The dropdown below
                    defaults to the most recent node the Cardinal House team has made available for NFT minting.
                    After selecting the node or keeping the most recent one, scroll down to mint one or more NFTs
                    for the node!
                  </Typography>   
                </>
              )
            }
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          {
            nodeRunnerContracts.length > 1 && (
              <>
                <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
                <Grid item lg={6} md={8} sm={10} xs={12} className={styles.selectContract}>
                  <FormControl fullWidth>
                    <InputLabel id="contractSelection">Select Node Runner Node</InputLabel>
                    <Select
                      labelId="contractSelection"
                      value={currNodeRunnerContract.Name ? currNodeRunnerContract.Name : "Primary Node Runner Contract"}
                      label="Select Node Runner Node"
                      onChange={updateCurrNodeRunnerContract}
                    >
                      {
                        nodeRunnerContracts.map((contract) => {
                          return (
                            <MenuItem value={contract.Name}>{contract.Name}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={2} sm={1} xs={0}></Grid>  
                <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
                  <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 text-center">
                    <Typography variant="h3">
                      {currNodeRunnerContract.Description}
                    </Typography>
                    <br/>
                  </Grid>
                <Grid item lg={2} md={2} sm={1} xs={0}></Grid> 
              </>
            )
          }

          {nodeRunnerTokenURI != "" && (
            <>
              <Grid item xs={12} className="mt-4">
                  <Typography variant="h3" className="text-center">
                    Example Node Runner NFT
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
