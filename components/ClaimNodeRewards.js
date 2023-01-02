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

export default function ClaimNodeRewards(props) {
  const { account, chainId } = useEthers();
  const networkName = "polygon";
  const ERC20ABI = ERC20.abi;
  const nodeRunnerABI = NodeRunner.abi;
  const cardinalNFTABI = CardinalNFT.abi;
  const NodeRunnerAddress = chainConfig["NodeRunnerAddresses"][networkName];
  const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
  const isConnected = account !== undefined && chainId == polygonChainId;

  const [nodeRunnerContracts, setNodeRunnerContracts] = useState([]);
  const [currNodeRunnerContractAddress, setCurrNodeRunnerContractAddress] = useState("");
  const [userNodeRunnerData, setUserNodeRunnerData] = useState({});
  const [maticBalance, setMaticBalance] = useState(-1);
  const [loadingNodeRunnerContracts, setLoadingNodeRunnerContracts] = useState(true);
  const [startingClaim, setStartingClaim] = useState(false);
  const [isCardinalMember, setIsCardinalMember] = useState(undefined);
  const [nodeRunnerTokenURI, setNodeRunnerTokenURI] = useState("");
  const [claimingNodeRewards, setClaimingNodeRewards] = useState(false);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [showSubmissionFailure, setShowSubmissionFailure] = useState(false);
  const [showSubmissionPending, setShowSubmissionPending] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const nodeRunnerInterface = new utils.Interface(nodeRunnerABI);
  const nodeRunnerContract = new Contract(currNodeRunnerContractAddress ? currNodeRunnerContractAddress : NodeRunnerAddress, nodeRunnerInterface);

  const { send: claimNodeRunnerRewards, state: claimNodeRunnerRewardsState } =
  useContractFunction(nodeRunnerContract, "claimNodeRewards", {
      transactionName: "Claim Node Runner Rewards.",
  })

  async function getInitialContractValues() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: polygonChainId });
    const nodeRunnerContractReadOnly = new ethers.Contract(nodeRunnerContracts[0].Address, nodeRunnerABI, provider);

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
    const cardinalNFTContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);

    const currIsCardinalMember = await cardinalNFTContractReadOnly.addressIsMember(account);
    setIsCardinalMember(currIsCardinalMember);

    const currMaticBalanceObj = await provider.getBalance(account);
    const currMaticBalance = +ethers.utils.formatEther(BigInt(parseInt(currMaticBalanceObj._hex, 16)).toString(10));
    setMaticBalance(currMaticBalance);

    let currUserNodeRunnerData = {};
    let currNFTDataList = [];
    for (let i = 0; i < nodeRunnerContracts.length; i++) {
      const nodeRunnerContractReadOnly = new ethers.Contract(nodeRunnerContracts[i].Address, nodeRunnerABI, provider);
      currNFTDataList = [];

      const currNodeUserNFTs = await nodeRunnerContractReadOnly.getUserTokenURIs(account);

      const currNodeRewardsObj = await nodeRunnerContractReadOnly.addressToMaticCanClaim(account);
      const currNodeRewards = +ethers.utils.formatEther(BigInt(parseInt(currNodeRewardsObj._hex, 16)).toString(10));

      const currNodeRewardsClaimedObj = await nodeRunnerContractReadOnly.addressToMaticClaimed(account);
      const currNodeRewardsClaimed = +ethers.utils.formatEther(BigInt(parseInt(currNodeRewardsClaimedObj._hex, 16)).toString(10));

      const currMaxNFTObj = await nodeRunnerContractReadOnly.maxNFTs();
      const currMaxNFT = parseInt(currMaxNFTObj._hex, 16);

      const currNumNFTsPurchasedObj = await nodeRunnerContractReadOnly._tokenIds();
      const currNumNFTsPurchased = parseInt(currNumNFTsPurchasedObj._hex, 16);

      const currNodeIsActive = nodeRunnerContracts[i].StartDate && nodeRunnerContracts[i].StartDate != "";
      const currNodeNextDeposit = nodeRunnerContracts[i].NextDeposit;
      const currNodeAddress = nodeRunnerContracts[i].Address;
      
      if (currNodeUserNFTs.length > 0) {
        for (let j = 0; j < currNodeUserNFTs.length; j++) {
          const currNodeRunnerTokenURIData = await axios.get(currNodeUserNFTs[j], {
            headers: {
              'Accept': '*/*'
            }
          });
          currNFTDataList.push(currNodeRunnerTokenURIData.data);
        }

        currUserNodeRunnerData[nodeRunnerContracts[i].Name] = {
          "tokenURIs": JSON.parse(JSON.stringify(currNFTDataList)),
          "NFTsLeft": currMaxNFT - currNumNFTsPurchased,
          "IsActive": currNodeIsActive,
          "NextDeposit": currNodeNextDeposit,
          "Address": currNodeAddress,
          "NodeRewardsCanClaim": currNodeRewards,
          "NodeRewardsClaimed": currNodeRewardsClaimed
        };
      }
    }

    console.log(currUserNodeRunnerData);
    setUserNodeRunnerData(JSON.parse(JSON.stringify(currUserNodeRunnerData)));
  }

  async function getNodeRunnerContracts() {
    const nodeRunnerContractsResponse = await axios.get("/api/noderunnercontracts");
    const nodeRunnerContracts = nodeRunnerContractsResponse.data;
    setNodeRunnerContracts(JSON.parse(JSON.stringify(nodeRunnerContracts)));
  }

  useEffect(() => {
    getNodeRunnerContracts();
  }, []);

  useEffect(() => {
    if (nodeRunnerContracts.length > 0) {
      getInitialContractValues();

      if (isConnected) {
        getAccountInfo();
      }
      
      setLoadingNodeRunnerContracts(false);
    }
  }, [nodeRunnerContracts])

  useEffect(() => {
    if (isConnected && !loadingNodeRunnerContracts) {
      getAccountInfo();
    }
  }, [isConnected, account]);

  useEffect(() => {
    if (startingClaim) {
      setStartingClaim(false);
      claimNodeRunnerRewards();
    }
  }, [startingClaim])

  const startNodeRunnerRewardsClaim = (nodeRunnerAddress) => {
    setCurrNodeRunnerContractAddress(nodeRunnerAddress);
    setStartingClaim(true);
  }

  useEffect(() => {
    console.log(claimNodeRunnerRewardsState);
    if (claimNodeRunnerRewardsState.status === "Success") {
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setClaimingNodeRewards(false);
      getInitialContractValues();
      getAccountInfo();
      setSubmissionMessage("Node Rewards Claimed Successfully!");
      setTransactionHash(claimNodeRunnerRewardsState.transaction.hash);
    }
    else if (claimNodeRunnerRewardsState.status === "Exception") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setClaimingNodeRewards(false);
      setSubmissionMessage(`Failed to Claim Node Rewards: ${claimNodeRunnerRewardsState.errorMessage}`);
    }
    else if (claimNodeRunnerRewardsState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setClaimingNodeRewards(true);
      setSubmissionMessage("Claiming Node Rewards...");
      setTransactionHash(claimNodeRunnerRewardsState.transaction.hash);
    }
    else if (claimNodeRunnerRewardsState.status === "PendingSignature") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setClaimingNodeRewards(true);
      setSubmissionMessage("Waiting for User to Sign Transaction...");
      setTransactionHash("");
    }
  }, [claimNodeRunnerRewardsState])

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
      <main className={styles.container}>
        <Grid container justifyContent="center" alignItems="center" className="text-center" spacing={4}>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={5} md={8} sm={10} xs={12} className={styles.headerTextGrid}>
            <Typography variant="h2" className={styles.headerText}>
              Claim Node Runner Rewards
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 mb-5">
            <Typography variant="h3">
              Here is where you can claim your Node Runner rewards! For each node you own
              at least one NFT for, all you have to do is click the claim rewards button to receive
              your rewards from the node. Rewards from the node are deposited each month start exactly
              a month after the node is aquired and the rewards are paid out in Matic.
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          {
            maticBalance != -1 && (
              <>
              <Grid item lg={4} md={3} sm={2} xs={0}></Grid>
                <Grid item lg={4} md={6} sm={8} xs={12}>
                  <Typography variant="h2" className={clsx("text-center mb-3", styles.maticBalance)}>
                    Your Matic Balance: {maticBalance.toFixed(3)} Matic
                  </Typography>
                </Grid>
              <Grid item lg={4} md={3} sm={2} xs={0}></Grid>   
              </>
            )
          }

          {
            loadingNodeRunnerContracts && (
              <Grid item xs={12} className="mt-5 text-center">
                <CircularProgress size={80} color="primary"/>
              </Grid>
            )
          }

          {
            Object.keys(userNodeRunnerData).map((nodeRunnerContractName) => {
              return (
                <Grid item lg={10} md={10} sm={12} xs={12} className="mt-5">
                  <Typography variant="h3" className={clsx("text-center mt-2", styles.yourNFTsHeader)}>
                    Claim Node Rewards for - {nodeRunnerContractName}
                  </Typography>
                  <Grid container justifyContent="center" alignItems="center" spacing={4} className="mt-2">
                    {
                      !userNodeRunnerData[nodeRunnerContractName].IsActive && (
                        <>
                          <Grid item xs={12}>
                            {
                              userNodeRunnerData[nodeRunnerContractName].NFTsLeft > 0 && (
                                <Typography variant="p">
                                  This node has not been purchased yet! There are still {userNodeRunnerData[nodeRunnerContractName].NFTsLeft}
                                  &nbsp;NFTs to be minted before there are the required funds for the node. Check back later once all the
                                  NFTs have been minted to see when the first node rewards deposit will be made.
                                </Typography>
                              )
                            }
                            {
                              userNodeRunnerData[nodeRunnerContractName].NFTsLeft == 0 && (
                                <Typography variant="p">
                                  This node has not been purchased yet! However, all of the NFTs have been minted for this node so the
                                  Cardinal House team will aquire it soon. Check back shortly to see when the first node rewards deposit will be made!
                                </Typography>
                              )
                            }
                          </Grid>
                          <Grid item lg={6} md={8} sm={10} xs={12}>
                            <Button variant="contained" color="primary" disabled={true} className={styles.largeBtn}>
                              Node Rewards Not Available Yet
                            </Button>
                          </Grid>
                        </>
                      )
                    }
                    {
                      userNodeRunnerData[nodeRunnerContractName].IsActive && (
                        <>
                          <Grid item xs={12} sm={6} md={4} lg={4} className={styles.bigBtnGrid}>
                            <Card className={clsx(styles.customCard2, props.useDarkTheme ? styles.customCardDark : styles.customCardLight)}>
                                <div>
                                  <CardContent>
                                    <Typography variant="h4" component="div" className={clsx("text-2xl font-bold", styles.colorfulText)}>
                                      Claimable Rewards
                                    </Typography>
                                    <br/>
                                    <Typography variant="h4" component="div" className="text-2xl font-bold">
                                      {userNodeRunnerData[nodeRunnerContractName].NodeRewardsCanClaim.toFixed(3)} Matic
                                    </Typography>
                                  </CardContent>
                                </div>
                              </Card>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} lg={4} className={styles.bigBtnGrid}>
                            <Card className={clsx(styles.customCard2, props.useDarkTheme ? styles.customCardDark : styles.customCardLight)}>
                                <div>
                                  <CardContent>
                                    <Typography variant="h4" component="div" className={clsx("text-2xl font-bold", styles.colorfulText)}>
                                      Rewards already claimed
                                    </Typography>
                                    <br/>
                                    <Typography variant="h4" component="div" className="text-2xl font-bold">
                                      {userNodeRunnerData[nodeRunnerContractName].NodeRewardsClaimed.toFixed(3)} Matic
                                    </Typography>
                                  </CardContent>
                                </div>
                              </Card>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} lg={4} className={styles.bigBtnGrid}>
                            <Card className={clsx(styles.customCard2, props.useDarkTheme ? styles.customCardDark : styles.customCardLight)}>
                                <div>
                                  <CardContent>
                                    <Typography variant="h4" component="div" className={clsx("text-2xl font-bold", styles.colorfulText)}>
                                      Next Deposit
                                    </Typography>
                                    <br/>
                                    <Typography variant="h4" component="div" className="text-2xl font-bold">
                                      {userNodeRunnerData[nodeRunnerContractName].NextDeposit}
                                    </Typography>
                                  </CardContent>
                                </div>
                              </Card>
                          </Grid>
                          <Grid item lg={6} md={8} sm={10} xs={12}>
                            <Button variant="contained" color="primary" onClick={() => startNodeRunnerRewardsClaim(userNodeRunnerData[nodeRunnerContractName].Address)} className={styles.largeBtn}
                              disabled={userNodeRunnerData[nodeRunnerContractName].NodeRewardsCanClaim <= 0}>
                              {!claimingNodeRewards && (userNodeRunnerData[nodeRunnerContractName].NodeRewardsCanClaim > 0 ? `Claim Node Rewards (${userNodeRunnerData[nodeRunnerContractName].NodeRewardsCanClaim.toFixed(3)} Matic)` : "No Rewards to Claim Currently")}
                              {claimingNodeRewards && <CircularProgress size={30} color="secondary"/>}
                              {claimingNodeRewards && <>&nbsp; Claiming Node Rewards...</>}
                            </Button>
                          </Grid>
                        </>
                      )
                    }
                  </Grid>
                </Grid>
              )
            })
          }
        </Grid>
      </main>
    </div>
  )
}
