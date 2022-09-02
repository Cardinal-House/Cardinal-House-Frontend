import Image from 'next/image';
import { Grid, Button, Typography } from '@mui/material';
import clsx from 'clsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useEthers } from "@usedapp/core";
import { constants, ethers } from "ethers";

import styles from '../styles/DApp.module.css';
import chainConfig from "../chain-config.json";
import CardinalNFT from "../contracts/CardinalNFT.json";

const rpcEndpoint = "https://rpc-mainnet.maticvigil.com";

const auditNFTOwnerAddress = "0x18Dbdf44c87081c3D6952Dd4B5298C528d3B2e05";

export default function Audits(props) {
    const { account, chainId } = useEthers();
    const networkName = "polygon";
    const cardinalNFTABI = CardinalNFT.abi;
    const CardinalNFTAddress = chainConfig["CardinalNFTAddresses"][networkName];
    const isConnected = account !== undefined && chainId == 137;

  const [serviceNFTs, setServiceNFTs] = useState([]);

  async function getAuditTokenURIs() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { name: networkName, chainId: 137 });
    const nftContractReadOnly = new ethers.Contract(CardinalNFTAddress, cardinalNFTABI, provider);

    const serviceTokenURILinks = await nftContractReadOnly.getUserServiceTokenURIs(auditNFTOwnerAddress);
    let serviceTokenURIs = [];

    for (let i = 0; i < serviceTokenURILinks.length; i++) {
      const serviceTokenURIData = await axios.get(serviceTokenURILinks[i]);
      serviceTokenURIs.push(serviceTokenURIData.data);
    }

    setServiceNFTs(serviceTokenURIs);


  }

    useEffect(() => {
      getAuditTokenURIs();
    }, []);

  return (
    <div className={clsx("mt-5 mb-5", props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
      <main className={clsx(styles.container, styles.minHeightContainer)}>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={5} md={8} sm={10} xs={12} className={styles.headerTextGrid}>
            <Typography variant="h2" className={styles.headerText}>
              Cardinal House Audits
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 text-center">
            <Typography variant="h3">
              Each of the NFTs below represent a completed Cardinal House audit of a project.
              An audit is a best effort security analysis of the smart contract code for a project
              and is typically completed before the project launches. Just because a project has an NFT
              below does NOT mean they are 100% a safe investment, but having a successful Cardinal House audit
              is definitely a good sign that the project developers are keeping security best practices in mind.
              For more details on a specific audit, head on over to our Discord Server where we post the audit
              report for every project we audit.
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          <Grid item xs={12} className={styles.discordBtnGrid}>
            <Button href="https://discord.gg/Sw5qsDx2kr" target="_blank" rel="noreferrer" size="large" variant="contained" color="primary" 
              className={props.useDarkTheme ? styles.discordBtnDark : styles.discordBtnLight}>
              Join Our Discord Server to See Full Audit Reports
            </Button>
          </Grid>

          {
            serviceNFTs && (serviceNFTs.map((nft, i) => (
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
      </main>
    </div>
  )
}
