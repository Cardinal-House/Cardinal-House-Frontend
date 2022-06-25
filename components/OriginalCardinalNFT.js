import Image from 'next/image';
import { Grid, Button, Typography } from '@mui/material';
import clsx from 'clsx';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import { useEthers } from "@usedapp/core";
import { constants, ethers } from "ethers";
import Web3Modal from 'web3modal';

import styles from '../styles/DApp.module.css';
import chainConfig from "../chain-config.json";
import cardinalHouseLogo from '../public/CardinalHouseLogo.png';
import CardinalNFT from "../contracts/CardinalNFT.json";

export default function OriginalCardinalNFT(props) {
    const { account, chainId } = useEthers();
    const networkName = "bsctest";
    const cardinalNFTABI = CardinalNFT.abi;
    const CardinalNFTAddress = chainId ? chainConfig["CardinalNFTAddresses"][networkName] : constants.AddressZero
    const isConnected = account !== undefined && chainId == 97;

  const [originalCardinalNFT, setOriginalCardinalNFT] = useState(null);

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
      const originalCardinalNFTData = await axios.get(originalCardinalNFTs[0]);
      setOriginalCardinalNFT(originalCardinalNFTData.data);
    }
  }

    useEffect(() => {
      if (isConnected) {
        getTokenURI();
      }
    }, [isConnected]);

  return (
    <div className={clsx("mt-5 mb-5", props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
      <main className={styles.container}>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={5} md={8} sm={10} xs={12} className={styles.headerTextGrid}>
            <Typography variant="h4" className={styles.headerText}>
              Original Cardinal NFTs
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={1} xs={0}></Grid>

          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>
          <Grid item lg={8} md={8} sm={10} xs={12} className="mt-2 text-center">
            <Typography variant="h6">
              Cardinal House rewards outstanding members of the early community by giving them
              Original Cardinal NFTs. Each Original Cardinal NFT entitles the owner to a free lifetime
              Cardinal House membership! If you received an Original Cardinal NFT, connect your wallet
              here to see it!
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={1} xs={0}></Grid>

          {
            originalCardinalNFT && (
              <Grid item xs={12} sm={6} md={4} lg={3} className={clsx("mt-3", styles.NFTGrid)}>
                <Typography variant="h4" className={clsx("mb-3", styles.serviceHeaderText)}>
                  Your Original Cardinal NFT
                </Typography>
                <div className={clsx(styles.cardDiv, "rounded-xl overflow-hidden")}>
                  <img src={originalCardinalNFT.image.replace("https", "http")} className={clsx(styles.NFTImage)} />
                  <div className={clsx(props.useDarkTheme ? styles.NFTTextDark : styles.NFTTextLight, "p-4")}>
                    <Typography variant="p" component="div" className="text-2xl font-bold">
                      {originalCardinalNFT.NFTName}
                    </Typography>
                    <Typography variant="p" component="div" className={clsx(styles.nftDescriptionText,"font-bold mt-3")}>
                      {originalCardinalNFT.NFTDescription}
                    </Typography>
                  </div>
                </div>
              </Grid>
            )
          }

          <Grid item xs={12}>
            <Typography variant="h4" className={styles.serviceHeaderText}>
              Membership Benefits
            </Typography>
          </Grid>
          <Grid item lg={3} md={4} sm={8} xs={10}>
            <Image src={cardinalHouseLogo} layout="responsive" />
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            <Typography variant="h6">
              There are many benefits to being a Cardinal House member, including exclusive educational content,
              Cardinal Token giveaways, whitelist spots for projects that come into the community for AMAs,
              and special events hosted for members only such as technical analysis sessions, interviews with project
              owners, and so much more!
            </Typography>
          </Grid>

        </Grid>
      </main>
    </div>
  )
}
