import { Grid, Button, Typography, Card, CardContent, TextField, CircularProgress } from '@mui/material';
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
import CardinalNFT from "../contracts/CardinalNFT.json";

const rpcEndpoint = "https://polygon-rpc.com";
const polygonChainId = 137;

export default function PurchaseMembership(props) {
  const { account, chainId } = useEthers();
  const networkName = "polygon";
  const ERC20ABI = ERC20.abi;
  const cardinalNFTABI = CardinalNFT.abi;
  const USDCAddress = chainConfig["USDCAddresses"][networkName];
  const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
  const isConnected = account !== undefined && chainId == polygonChainId;

  const [isCardinalMember, setIsCardinalMember] = useState(undefined);
  const [memberDiscountAmount, setMemberDiscountAmount] = useState(0);
  const [membershipTokenURI, setMembershipTokenURI] = useState("");
  const [membershipPrice, setMembershipPrice] = useState(0);
  const [userMembershipNFTs, setUserMembershipNFTs] = useState([]);
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [approvingUSDC, setApprovingUSDC] = useState(false);
  const [USDCApproved, setUSDCApproved] = useState(false);
  const [purchasingMembership, setPurchasingMembership] = useState(false);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [showSubmissionFailure, setShowSubmissionFailure] = useState(false);
  const [showSubmissionPending, setShowSubmissionPending] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const USDCInterface = new utils.Interface(ERC20ABI);
  const USDCContract = new Contract(USDCAddress, USDCInterface);
  const cardinalNFTInterface = new utils.Interface(cardinalNFTABI);
  const cardinalNFTContract = new Contract(CardinalNFTAddress, cardinalNFTInterface);

  const { send: approveUSDC, state: approveUSDCState } =
  useContractFunction(USDCContract, "approve", {
      transactionName: "Approve USDC for Purchasing Membership NFT.",
  })

  const { send: purchaseMembershipNFT, state: purchasingMembershipNFTState } =
  useContractFunction(cardinalNFTContract, "mintMembershipNFT", {
      transactionName: "Purchase Membership NFT.",
  })

  async function getInitialContractValues() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: polygonChainId });
    const cardinalNFTContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);

    const currMembershipPriceObj = await cardinalNFTContractReadOnly.membershipPriceInUSDC();
    const currMembershipPrice = +ethers.utils.formatEther(BigInt(parseInt(currMembershipPriceObj._hex, 16)).toString(10));
    setMembershipPrice(currMembershipPrice * Math.pow(10, 12));

    const currMembershipTokenURILink = await cardinalNFTContractReadOnly.membershipTokenURI();
    const currMembershipTokenURIData = await axios.get(currMembershipTokenURILink, {
      headers: {
        'Accept': '*/*'
      }
    });
    setMembershipTokenURI(currMembershipTokenURIData.data);
  }

  async function getAccountInfo() {
    const web3Modal = new Web3Modal({
      network: networkName,
      cacheProvider: true,
      })
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const cardinalNFTContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);
    const USDCContractReadOnly = new ethers.Contract(USDCAddress, ERC20ABI, provider);

    const currIsCardinalMember = await cardinalNFTContractReadOnly.addressIsMember(account);
    setIsCardinalMember(currIsCardinalMember);

    const currMembershipDiscountObj = await cardinalNFTContractReadOnly.addressToMembershipDiscount(account);
    const currMembershipDiscount = parseInt(currMembershipDiscountObj._hex, 16);
    setMemberDiscountAmount(currMembershipDiscount);

    const currApprovedAmountObj = await USDCContractReadOnly.allowance(account, CardinalNFTAddress);
    const currApprovedAmount = +ethers.utils.formatEther(BigInt(parseInt(currApprovedAmountObj._hex, 16)).toString(10));
    setApprovedAmount(currApprovedAmount);

    const membershipTokenURILinks = await cardinalNFTContractReadOnly.getUserMembershipTokenURIs(account);
    let membershipTokenURIs = [];

    for (let i = 0; i < membershipTokenURILinks.length; i++) {
      const membershipTokenURIData = await axios.get(membershipTokenURILinks[i], {
        headers: {
          'Accept': '*/*'
        }
      });
      membershipTokenURIs.push(membershipTokenURIData.data);
    }

    setUserMembershipNFTs(membershipTokenURIs);
  }

  useEffect(() => {
    getInitialContractValues();
  }, []);

  useEffect(() => {
    if (isConnected) {
      getAccountInfo();
    }
  }, [isConnected, account]);

  const startApproveUSDC = () => {
    approveUSDC(CardinalNFTAddress, BigInt(Math.pow(2, 256)) - BigInt(1));
  }

  const startMembershipNFTMint = () => {
    purchaseMembershipNFT();
  }

  useEffect(() => {
    console.log(approveUSDCState);
    if (approveUSDCState.status === "Success") {
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setApprovingUSDC(false);
      setSubmissionMessage("USDC approved successfully! Click the \"Mint Membership NFT\" button to finalize your membership purchase!");
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
    console.log(purchasingMembershipNFTState);
    if (purchasingMembershipNFTState.status === "Success") {
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setPurchasingMembership(false);
      getInitialContractValues();
      getAccountInfo();
      setSubmissionMessage("Cardinal Crew Membership NFT Purchased Successfully!");
      props.updateTempTokenBalance();
      setTransactionHash(purchasingMembershipNFTState.transaction.hash);
    }
    else if (purchasingMembershipNFTState.status === "Exception") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setPurchasingMembership(false);
      setSubmissionMessage(`Failed to Purchase Membership NFT: ${purchasingMembershipNFTState.errorMessage}`);
    }
    else if (purchasingMembershipNFTState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setPurchasingMembership(true);
      setSubmissionMessage("Purchasing Cardinal Crew Membership NFT...");
      setTransactionHash(purchasingMembershipNFTState.transaction.hash);
    }
    else if (purchasingMembershipNFTState.status === "PendingSignature") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setPurchasingMembership(true);
      setSubmissionMessage("Waiting for User to Sign Transaction...");
      setTransactionHash("");
    }
  }, [purchasingMembershipNFTState])

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
              Purchase a Cardinal Crew Membership NFT
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 text-center">
            <Typography variant="h3">
              Here is where you purchase a Cardinal House Membership NFT which makes you a Cardinal Crew Member! 
              The Cardinal Crew Membership is a monthly subscription that gives you access to many exciting perks within the 
              community, including exclusive educational content around trading and crypto knowledge, giveaways, whitelist 
              spots for projects that come into the community for AMAs, special events hosted for members only such as technical 
              analysis sessions, interviews with project owners, and so much more!
            </Typography>
            <br/>
            <Typography variant="h3" className="mt-3">
              When you purchase a Cardinal Crew Membership NFT, you pay for the first month immediately and then are charged on a monthly basis after. 
              All Cardinal Crew Membership payments through the Membership NFT are with USDC. If you don't have enough USDC to pay for the membership 
              when you are charged for another month, your Membership NFT will be forfeited and you can simply purchase another one if you want to 
              continue your membership.
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          {userMembershipNFTs.length > 0 && (
            <Grid item xs={12} className="mt-4">
              <Grid container justifyContent="center" alignItems="center" spacing={4}>
                <Grid item xs={12} className="text-center">
                  <Typography variant="h2">
                    Here are Your Cardinal Crew Membership NFTs!
                  </Typography>
                </Grid>
                {
                  (userMembershipNFTs.map((nft, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i} className={clsx("mt-3", styles.NFTGrid)}>
                      <div className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")}>
                        <img src={nft.image.replace("https", "http")} className={clsx(styles.NFTImage)} />
                        <div className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                          <Typography variant="p" component="div" className="text-2xl font-bold">
                            {nft.NFTName}
                          </Typography>
                          <Typography variant="p" component="div" className={clsx(styles.nftDescriptionText,"font-bold mt-3")}>
                            {nft.NFTDescription}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  )))
                }
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} sm={10} md={10} lg={8} className={styles.NFTGrid}>
            <Card className={clsx(styles.customCard, props.useDarkTheme ? styles.customCardTransparentDark : styles.customCardTransparentLight)}>
                <CardContent>
                  <Typography variant="h2">
                    Purchase Cardinal Crew Membership NFT
                  </Typography>
                  {isCardinalMember != undefined && (
                    <Typography variant="h3" className="mt-5">
                      Crew Membership Status: {isCardinalMember ? <b className="text-success">Crew Membership Active!</b> : "Not a Crew Member"}
                    </Typography>
                  )}
                  {memberDiscountAmount > 0 && (
                    <Typography variant="h3" className="mt-4">
                      Your Membership Discount: <b className="text-success">{100 - parseInt(memberDiscountAmount)}% off!</b>
                    </Typography>
                  )}
                  {membershipPrice > 0 && (
                    <Typography variant="h3" className="mt-4">
                      Cardinal Crew Membership Price: 
                      <b>
                        &nbsp;{memberDiscountAmount > 0 ? parseFloat(parseInt(membershipPrice) * parseInt(memberDiscountAmount) / 100).toFixed(3) : membershipPrice.toFixed(3)}&nbsp;
                      </b>
                      USDC
                    </Typography>
                  )}
                  <Grid container justifyContent="center" alignItems="center" spacing={4} className="mt-4 text-center">
                    <Grid item xs={12}>
                      <Button size="large" variant="contained" color="primary"
                        disabled={approvingUSDC || USDCApproved || !isConnected || approvedAmount > 100000000} onClick={startApproveUSDC}>
                        {approvingUSDC && <CircularProgress size={18} color="secondary"/>}
                        {isConnected ? approvingUSDC ? <>&nbsp; Approving USDC...</> : "Approve USDC" : "Connect Wallet in Navigation"}
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      {isConnected && (
                        <Button size="large" variant="contained" color="primary"
                          disabled={purchasingMembership || (!USDCApproved && approvedAmount < 100000000)} onClick={startMembershipNFTMint}>
                          {purchasingMembership && <CircularProgress size={18} color="secondary"/>}
                          {purchasingMembership ? <>&nbsp; Purchasing Membership NFT...</> : "Purchase Membership NFT"}
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={12} className="mt-4">
                        <Typography variant="h3">
                          Example Cardinal Crew Membership NFT
                        </Typography>
                    </Grid>
                    {membershipTokenURI != "" && (
                      <Grid item xs={12} sm={6} md={5} lg={4} className={clsx("mt-3", styles.NFTGrid)}>
                        <div className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")}>
                          <img src={membershipTokenURI.image} className={clsx(styles.NFTImage)} />
                          <div className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                            <Typography variant="p" component="div" className="text-2xl font-bold">
                              {membershipTokenURI.NFTName}
                            </Typography>
                            <Typography variant="p" component="div" className={clsx(styles.nftDescriptionText,"font-bold mt-3")}>
                              {membershipTokenURI.NFTDescription}
                            </Typography>
                          </div>
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}
