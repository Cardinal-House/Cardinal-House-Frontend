import Image from 'next/image';
import { Grid, Button, Typography, Card, CardContent, TextField, CircularProgress } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useEthers, useContractFunction } from "@usedapp/core";
import { utils, ethers } from "ethers";
import Web3Modal from 'web3modal';
import { Contract } from "@ethersproject/contracts";

import styles from '../styles/DApp.module.css';
import chainConfig from "../chain-config.json";
import cardinalHouseLogo from '../public/CardinalLogoLight.png';
import CardinalPreSale from "../contracts/CardinalHousePreSale.json";
import CardinalToken from "../contracts/CardinalToken.json";
import CardinalNFT from "../contracts/CardinalNFT.json";
import { LegendToggleOutlined } from '@mui/icons-material';
import { FaHourglassEnd } from 'react-icons/fa';

const rpcEndpoint = "https://rpc-mainnet.maticvigil.com";
const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
const aggregatorAddress = '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0';

export default function PreSale(props) {
  const { account, chainId } = useEthers();
  const networkName = "polygon";
  const cardinalPreSaleABI = CardinalPreSale.abi;
  const cardinalTokenABI = CardinalToken.abi;
  const cardinalNFTABI = CardinalNFT.abi;
  const CardinalPreSaleAddress = chainConfig["CardinalPreSaleAddresses"][networkName];
  const CardinalTokenAddress = chainConfig["CardinalTokenAddresses"][networkName];
  const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
  const isConnected = account !== undefined && chainId == 137;

  const [preSaleSupply, setPreSaleSupply] = useState(0);
  const [MaticToCRNLRate, setMaticToCRNLRate] = useState(0);
  const [maticPriceUSD, setMaticPriceUSD] = useState(0);
  const [isCardinalMember, setIsCardinalMember] = useState(undefined);
  const [memberDiscountAmount, setMemberDiscountAmount] = useState(0);
  const [onlyMembers, setOnlyMembers] = useState(undefined);
  const [maticAmount, setMaticAmount] = useState("");
  const [cardinalTokenAmount, setCardinalTokenAmount] = useState("");
  const [USDAmount, setUSDAmount] = useState(0);
  const [purchaseCap, setPurchaseCap] = useState(0);
  const [cardinalTokenBalance, setCardinalTokenBalance] = useState(0);
  const [revertWarning, setRevertWarning] = useState(false);
  const [purchasingTokens, setPurchasingTokens] = useState(false);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [showSubmissionFailure, setShowSubmissionFailure] = useState(false);
  const [showSubmissionPending, setShowSubmissionPending] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const cardinalPreSaleInterface = new utils.Interface(cardinalPreSaleABI);
  const cardinalPreSaleContract = new Contract(CardinalPreSaleAddress, cardinalPreSaleInterface);

  const { send: purchaseCardinalTokens, state: purchaseCardinalTokensState } =
  useContractFunction(cardinalPreSaleContract, "purchaseCardinalTokens", {
      transactionName: "Purchase Cardinal Tokens from the presale.",
  })

  async function getInitialContractValues() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: 137 });
    const cardinalTokenContractReadOnly = new ethers.Contract(CardinalTokenAddress, cardinalTokenABI, provider);
    const cardinalPreSaleContractReadOnly = new ethers.Contract(CardinalPreSaleAddress, cardinalPreSaleABI, provider);
    const aggregatorContractReadOnly = new ethers.Contract(aggregatorAddress, aggregatorV3InterfaceABI, provider);

    const currPreSaleSupplyObj = await cardinalTokenContractReadOnly.balanceOf(CardinalPreSaleAddress);
    const currPreSaleSupply = (+ethers.utils.formatEther(BigInt(currPreSaleSupplyObj._hex).toString(10))).toFixed(0).toString();
    setPreSaleSupply(currPreSaleSupply);

    const currPreSaleCapObj = await cardinalPreSaleContractReadOnly.purchaseCap();
    const currPreSaleCap = (+ethers.utils.formatEther(BigInt(currPreSaleCapObj._hex).toString(10))).toFixed(0);
    setPurchaseCap(currPreSaleCap);

    const currMaticToCRNLRateObj = await cardinalPreSaleContractReadOnly.MaticToCRNLRate();
    const currMaticToCRNLRate = parseInt(currMaticToCRNLRateObj._hex, 16) / 1000;
    setMaticToCRNLRate(currMaticToCRNLRate);

    const currOnlyMembers = await cardinalPreSaleContractReadOnly.onlyMembers();
    setOnlyMembers(currOnlyMembers);

    const currMemberDiscountAmountObj = await cardinalPreSaleContractReadOnly.memberDiscountAmount();
    const currMemberDiscountAmount = parseInt(currMemberDiscountAmountObj._hex, 16);
    setMemberDiscountAmount(currMemberDiscountAmount);

    const currMaticPriceUSDObj = await aggregatorContractReadOnly.latestRoundData();
    const currMaticPriceUSD = parseInt(currMaticPriceUSDObj[1]._hex, 16) / 100000000;
    setMaticPriceUSD(currMaticPriceUSD);
  }

  async function getAccountInfo() {
    const web3Modal = new Web3Modal({
      network: networkName,
      cacheProvider: true,
      })
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const cardinalNFTContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);
    const cardinalTokenContractReadOnly = new ethers.Contract(CardinalTokenAddress, cardinalTokenABI, provider);

    const currIsCardinalMember = await cardinalNFTContractReadOnly.addressIsMember(account);
    setIsCardinalMember(currIsCardinalMember);

    const currCardinalTokenBalanceObj = await cardinalTokenContractReadOnly.balanceOf(account);
    const currCardinalTokenBalance = parseInt(currCardinalTokenBalanceObj._hex, 16);
    setCardinalTokenBalance(currCardinalTokenBalance);
  }

  useEffect(() => {
    getInitialContractValues();
  }, []);

  useEffect(() => {
    if (isConnected) {
      getAccountInfo();
    }
  }, [isConnected, account]);

  const isNumeric = stringToTest => {
    return !isNaN(stringToTest) && !isNaN(parseInt(stringToTest));
  }

  const updateAmounts = (event, tokenType) => {
    const newAmount = event.target.value;

    if (!isNumeric(+newAmount) && newAmount != ".") {
      return;
    }
    else if (newAmount.length > 10) {
      return;
    }

    const newAmountParsed = newAmount == "." ? 0 : newAmount;

    let newMaticAmount = 0;
    let newCardinalTokenAmount = 0;
    
    if (tokenType == "matic") {
      newMaticAmount = newAmountParsed;

      if (isCardinalMember) {
        newCardinalTokenAmount = newAmountParsed * MaticToCRNLRate * memberDiscountAmount / 100;
      }
      else {
        newCardinalTokenAmount = newAmountParsed * MaticToCRNLRate;
      }

      setMaticAmount(newAmount);
      setCardinalTokenAmount(newCardinalTokenAmount == 0 ? "" : newCardinalTokenAmount);
    }
    else {
      if (isCardinalMember) {
        newMaticAmount = newAmountParsed * 100 / MaticToCRNLRate / memberDiscountAmount;
      }
      else {
        newMaticAmount = newAmountParsed / MaticToCRNLRate;
      }
      newCardinalTokenAmount = newAmountParsed;
      
      setMaticAmount(newMaticAmount == 0 ? "" : newMaticAmount.toFixed(8));
      setCardinalTokenAmount(newAmount);
    }

    if (newMaticAmount > 0) {
      setUSDAmount(newMaticAmount * maticPriceUSD);
    }
    else {
      setUSDAmount(0);
    }

    const currCardinalTokenBalance = +ethers.utils.formatEther(BigInt(cardinalTokenBalance).toString(10));

    if (newMaticAmount < 0 || newCardinalTokenAmount < 0) {
      setRevertWarning("Transaction will revert: token amounts cannot be less than 0.");
    }
    else if (parseFloat(newCardinalTokenAmount) + parseFloat(currCardinalTokenBalance) > purchaseCap) {
      setRevertWarning("Transaction will likely revert: this purchase would put you above the purchase cap unless the purchase cap has changed very recently.");
    }
    else if (parseFloat(newCardinalTokenAmount) > parseFloat(preSaleSupply)) {
      setRevertWarning("Transaction will likely revert: there aren't that many Cardinal Tokens left in the bonds pool!");
    }
    else {
      setRevertWarning("");
    }
  }

  const startPurchaseCardinalTokens = () => {
    purchaseCardinalTokens({value: ethers.utils.parseEther(maticAmount)});
  }

  useEffect(() => {
    console.log(purchaseCardinalTokensState);
    if (purchaseCardinalTokensState.status === "Success") {
      setShowSubmissionSuccess(true);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(false);
      setPurchasingTokens(false);
      getInitialContractValues();
      getAccountInfo();
      setSubmissionMessage("Cardinal Tokens purchased successfully!");
      props.updateTempTokenBalance();
      setMaticAmount("");
      setCardinalTokenAmount("");
      setUSDAmount(0);
      setTransactionHash(purchaseCardinalTokensState.transaction.hash);
    }
    else if (purchaseCardinalTokensState.status === "Exception") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(false);
      setShowSubmissionFailure(true);
      setPurchasingTokens(false);
      setSubmissionMessage(`Failed to purchase Cardinal Tokens: ${purchaseCardinalTokensState.errorMessage}`);
    }
    else if (purchaseCardinalTokensState.status === "Mining") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setPurchasingTokens(true);
      setSubmissionMessage("Purchasing Cardinal Tokens...");
      setTransactionHash(purchaseCardinalTokensState.transaction.hash);
    }
    else if (purchaseCardinalTokensState.status === "PendingSignature") {
      setShowSubmissionSuccess(false);
      setShowSubmissionPending(true);
      setShowSubmissionFailure(false);
      setPurchasingTokens(true);
      setSubmissionMessage("Waiting for User to Sign Transaction...");
      setTransactionHash("");
    }
  }, [purchaseCardinalTokensState])

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
              Cardinal House Bonds
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 text-center">
            <Typography variant="h3">
              Here is where you purchase Cardinal Tokens through the limited time bonds!
              All funds raised from the bonds will go straight into the liquidity pool for the Cardinal Token.
              The price of the Cardinal Token is approximately $0.03 per token.
              You can specify either how much Matic you want to spend or how many Cardinal Tokens you want to purchase!
            </Typography>
            {/*
            <Typography variant="h3" className="mt-4">
              Currently, the Cardinal House bonds are open to {
                onlyMembers 
                ? `Cardinal Crew Members only. ${isCardinalMember ? "Since you're a Crew Member, you have exclusive access to the bonds until 7:00 PM CDT tomorrow evening!" : "Since you aren't a Crew Member, you must wait until 7:00 PM CDT tomorrow evening to participate."}` 
                : "everyone! Keep in mind that Cardinal Crew Members still receive a 10% discount."
              }
            </Typography>
            */}
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          <Grid item xs={12} sm={10} md={10} lg={8} className={styles.NFTGrid}>
            <Card className={clsx(styles.customCard, props.useDarkTheme ? styles.customCardTransparentDark : styles.customCardTransparentLight)}>
                <CardContent>
                  <Typography variant="h2">
                    Purchase Cardinal Tokens
                  </Typography>
                  {/* isCardinalMember != undefined && (
                    <Typography variant="h3" className="mt-4">
                      Crew Membership Status: {isCardinalMember ? <b className="text-success">Crew Membership Active!</b> : "Not a Crew Member"}
                    </Typography>
                  )*/}
                  <Grid container justifyContent="center" alignItems="center" spacing={4} className="text-center">
                    <Grid item xs={12} className="mt-4">
                      Tokens Remaining for Purchase: {Number(parseFloat(preSaleSupply).toFixed(0)).toLocaleString()} CRNL
                    </Grid>
                    <Grid item xs={12}>
                      Purchase Cap: {Number(parseFloat(purchaseCap).toFixed(0)).toLocaleString()} CRNL
                      {cardinalTokenBalance > 0 && ` (You can purchase up to ${(parseFloat(purchaseCap) - parseFloat(+ethers.utils.formatEther(BigInt(cardinalTokenBalance).toString(10)))).toFixed(2)} CRNL still)`}
                    </Grid>
                    <Grid item lg={4} md={5} xs={12} className="mt-2">
                      <TextField label="Matic" variant="outlined" value={maticAmount} onChange={(e) => updateAmounts(e, "matic")} />
                    </Grid>
                    <Grid item lg={1} md={1} xs={12} className="mt-2">
                      <Typography variant="h2">
                        =
                      </Typography>
                    </Grid>
                    <Grid item lg={4} md={5} xs={12} className="mt-2">
                      <TextField label="Cardinal Tokens" variant="outlined" value={cardinalTokenAmount} onChange={(e) => updateAmounts(e, "crnl")} />
                    </Grid>
                    {USDAmount > 0 && (
                      <Grid item xs={12} className="mt-2">
                        <Typography variant="h2">
                          = {USDAmount < 0.01 ? "< $0.01" : `~$${Number(USDAmount.toFixed(2)).toLocaleString()}`}
                        </Typography>
                      </Grid>
                    )}
                    {/* USDAmount > 0 && isCardinalMember && (
                      <Typography variant="h3">
                        <i className="text-success">{USDAmount < 0.1 ? "(< $0.01 saved from Crew Membership discount!)" : ` ($${(USDAmount * (memberDiscountAmount - 100) / 100).toFixed(2)} saved from Crew Membership discount!)`}</i>
                      </Typography>
                    ) */}
                    {revertWarning != "" && (
                      <Grid item xs={12} className="mt-2">
                        <Typography variant="h3" className="text-danger">
                          {revertWarning}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} className="mt-2">
                      <Button size="large" variant="contained" color="primary" onClick={startPurchaseCardinalTokens}
                        disabled={purchasingTokens || cardinalTokenAmount == "" || parseFloat(cardinalTokenAmount) <= 0 || !isConnected}>
                        {purchasingTokens && <CircularProgress size={18} color="secondary"/>} 
                        {isConnected ? purchasingTokens ? <>&nbsp; Purchasing Cardinal Tokens...</> : "Purchase Cardinal Tokens" : "Connect Wallet in Navigation"}
                      </Button> 
                    </Grid>
                  </Grid>
                </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}
