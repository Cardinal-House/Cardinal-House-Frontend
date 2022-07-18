import Image from 'next/image';
import { Grid, Button, Typography } from '@mui/material';
import clsx from 'clsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useEthers } from "@usedapp/core";
import { constants, ethers } from "ethers";

import styles from '../styles/DApp.module.css';
import chainConfig from "../chain-config.json";
import cardinalHouseLogo from '../public/CardinalLogoLight.png';
import CardinalNFT from "../contracts/CardinalNFT.json";

const rpcEndpoint = "https://rpc-mainnet.maticvigil.com";

export default function MembershipNFT(props) {
    const { account, chainId } = useEthers();
    const networkName = "polygon";
    const cardinalNFTABI = CardinalNFT.abi;
    const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
    const isConnected = account !== undefined && chainId == 137;

  const [membershipTokenURI, setMembershipTokenURI] = useState(null);

  async function getMembershipTokenURI() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: 137 });
    const nftContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);

    const currMembershipTokenURI = await nftContractReadOnly.membershipTokenURI();
    if (currMembershipTokenURI != "") {
      const membershipTokenURIData = await axios.get(currMembershipTokenURI);
      setMembershipTokenURI(membershipTokenURIData.data);
    }
  }

    useEffect(() => {
      getMembershipTokenURI();
    }, []);

  return (
    <div className={clsx("mt-5 mb-5", props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
      <main className={clsx(styles.container, styles.minHeightContainer)}>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={5} md={8} sm={10} xs={12} className={styles.headerTextGrid}>
            <Typography variant="h4" className={styles.headerText}>
              Purchase a Cardinal House Membership!
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 text-center">
            <Typography variant="h6">
              Soon you will be able to purchase a Cardinal House Membership NFT on this page using
              the Cardinal Token! The Cardinal House Membership is a monthly subscription that gives 
              you access to many exciting perks, including exclusive educational content,
              Cardinal Token giveaways, whitelist spots for projects that come into the community for AMAs,
              special events hosted for members only such as technical analysis sessions, interviews with project
              owners, and so much more! Since the Cardinal Token hasn't launched yet, memberships will initially be
              purchased on our Discord server. Once we launch the Cardinal Token in August of this year, come back
              to this page to purchase your Cardinal House Membership!
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          <Grid item xs={12} className={styles.discordBtnGrid}>
            <Button href="https://discord.gg/Sw5qsDx2kr" target="_blank" rel="noreferrer" size="large" variant="contained" color="primary" 
              className={props.useDarkTheme ? styles.discordBtnDark : styles.discordBtnLight}>
              Join Our Discord Server
            </Button>
          </Grid>

          {
            membershipTokenURI && (
              <Grid item xs={12} sm={6} md={4} lg={3} className={clsx("mt-3", styles.NFTGrid)}>
                <Typography variant="h4" className={clsx("mb-3", styles.serviceHeaderText)}>
                  Your Original Cardinal NFT
                </Typography>
                <div className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")}>
                  <img src={membershipTokenURI.image.replace("https", "http")} className={clsx(styles.NFTImage)} />
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
            )
          }
        </Grid>
      </main>
    </div>
  )
}
