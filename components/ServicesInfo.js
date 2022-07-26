import Image from 'next/image';
import { Grid, Button, Typography } from '@mui/material';
import clsx from 'clsx';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';

import styles from '../styles/DApp.module.css';
import cardinalHouseLogo from '../public/CardinalLogoLight.png';
import marketplaceImage from '../public/MarketplaceArt.png';
import auditingImage from '../public/Auditing.png';
import kycImage from '../public/KYC.png';
import amaImage from '../public/Ama.png';
import liftOffImage from '../public/LiftOff.png';
import cardinalPayImage from '../public/CardinalPay.png';

export default function ServicesInfo(props) {
  gsap.registerPlugin(ScrollTrigger);

  const nftMarketplaceHeaderRef = useRef();
  const nftMarketplaceImageRef = useRef();
  const nftMarketplaceTextRef = useRef();

  const auditHeaderRef = useRef();
  const auditImageRef = useRef();
  const auditTextRef = useRef();

  const kycHeaderRef = useRef();
  const kycImageRef = useRef();
  const kycTextRef = useRef();

  const amaHeaderRef = useRef();
  const amaImageRef = useRef();
  const amaTextRef = useRef();

  const liftOffHeaderRef = useRef();
  const liftOffImageRef = useRef();
  const liftOffTextRef = useRef();

  const cardinalPayHeaderRef = useRef();
  const cardinalPayImageRef = useRef();
  const cardinalPayTextRef = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(nftMarketplaceHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#nftMarketplaceHeader", start: "bottom bottom" } });
    gsap.fromTo(nftMarketplaceImageRef.current, {x: -1000, opacity: 0}, {x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#nftMarketplaceHeader", start: "bottom bottom" } });
    gsap.fromTo(nftMarketplaceTextRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#nftMarketplaceHeader", start: "bottom bottom" } });

    gsap.fromTo(auditHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#auditHeader", start: "bottom bottom" } });
    gsap.fromTo(auditImageRef.current, {x: 1000, opacity: 0}, {x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#auditHeader", start: "bottom bottom" } });
    gsap.fromTo(auditTextRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#auditHeader", start: "bottom bottom" } });

    gsap.fromTo(kycHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#kycHeader", start: "bottom bottom" } });
    gsap.fromTo(kycImageRef.current, {x: -1000, opacity: 0}, {x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#kycHeader", start: "bottom bottom" } });
    gsap.fromTo(kycTextRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#kycHeader", start: "bottom bottom" } });

    gsap.fromTo(amaHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#amaHeader", start: "bottom bottom" } });
    gsap.fromTo(amaImageRef.current, {x: 1000, opacity: 0}, {x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#amaHeader", start: "bottom bottom" } });
    gsap.fromTo(amaTextRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#amaHeader", start: "bottom bottom" } });

    gsap.fromTo(liftOffHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#liftOffHeader", start: "bottom bottom" } });
    gsap.fromTo(liftOffImageRef.current, {x: -1000, opacity: 0}, {x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#liftOffHeader", start: "bottom bottom" } });
    gsap.fromTo(liftOffTextRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#liftOffHeader", start: "bottom bottom" } });

    gsap.fromTo(cardinalPayHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#cardinalPayHeader", start: "bottom bottom" } });
    gsap.fromTo(cardinalPayImageRef.current, {x: 1000, opacity: 0}, {x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#cardinalPayHeader", start: "bottom bottom" } });
    gsap.fromTo(cardinalPayTextRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#cardinalPayHeader", start: "bottom bottom" } });
  }, [])

  return (
    <div className={clsx("mt-5", styles.serviceInfoDiv, props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
      <main className={styles.container}>
        <Grid container justifyContent="center" alignItems="center" spacing={8}>
          <Grid item lg={3} md={2} sm={0} xs={0} className={styles.spacingGrid}></Grid>
          <Grid item lg={6} md={8} sm={12} xs={12} className={styles.headerTextGrid}>
            <Typography variant="h1" className={styles.headerText}>
              Cardinal House DApp Services Preview
            </Typography>
          </Grid>
          <Grid item lg={3} md={2} sm={0} xs={0} className={styles.spacingGrid}></Grid>

          <Grid item lg={2} md={2} sm={0} xs={0} className={styles.spacingGrid}></Grid>
          <Grid item lg={8} md={8} sm={12} xs={12} className="mt-2 text-center">
            <Typography variant="h3">
              The Cardinal House DApp will be live next month starting with the NFT marketplace.
              Below is a list of all services that will be released on the DApp with information
              and pricing for each. All services will be paid for on the DApp using the Cardinal Token.
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={0} xs={0} className={styles.spacingGrid}></Grid>

          <Grid item xs={12}>
            <Typography variant="h2" id="nftMarketplaceHeader" ref={nftMarketplaceHeaderRef} className={styles.serviceHeaderText}>
              NFT Marketplace
            </Typography>
          </Grid>
          <Grid item id="nftMarketplaceImage" ref={nftMarketplaceImageRef} lg={3} md={4} sm={8} xs={10}>
            <Image src={marketplaceImage} layout="responsive" />
          </Grid>
          <Grid id="nftMarketplaceText" ref={nftMarketplaceTextRef} item lg={7} md={6} sm={12} xs={12}>
            <Typography variant="h3">
              Cardinal House will have our very own NFT marketplace for the membership NFTs,
              Original Cardinal NFTs, and the services NFTs. The membership NFTs are how Cardinal House memberships
              will be purchased to unlock exclusive content and perks throughout the entire ecosystem, 
              the Original Cardinal NFTs are given to upstanding members
              of the community and give the holder a free lifetime membership, and the services NFTs
              will be given to projects that purchase services on our DApp as proof that they are audited by us,
              KYC'd by us, used our launch pad for their pre-sale, etc. Before our token launch, memberships will
              be purchased on our Discord server. But once the Cardinal Token is launched, you'll purchase
              your memberships here on the Cardinal House Marketplace!

            </Typography>
          </Grid>
          <Grid item lg={6} md={8} sm={10} xs={10}>
            <Typography variant="h5" className={styles.pricingText}>
              Membership NFT Price: $50/month in Cardinal Tokens
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography id="auditHeader" ref={auditHeaderRef} variant="h2" className={styles.serviceHeaderText}>
              Auditing
            </Typography>
          </Grid>
          <Grid item id="auditImage" ref={auditImageRef} className={styles.mobileImage} lg={3} md={4} sm={8} xs={10}>
            <Image src={auditingImage} layout="responsive" />
          </Grid>
          <Grid item id="auditText" ref={auditTextRef} lg={7} md={6} sm={12} xs={12}>
            <Typography variant="h3">
              Cardinal House will provide affordable and in-depth auditing services for Solidity
              smart contracts. We will analyze and test for security vulnerabilities, determine any potential gas fee
              optimizations, verify the tokenomics of the project, and create a list of any other improvements that could be made
              or red flags that need to be addressed. 
              Audit requests will be submitted right here on the DApp! Results for each project audit will also be displayed
              on the DApp for anyone to see. The price of an audit depends on the number of smart contracts involved
              as well as the complexity of each contract.
            </Typography>
          </Grid>
          <Grid item id="auditImage" ref={auditImageRef} className={styles.desktopImage} lg={3} md={4} sm={8} xs={10}>
            <Image src={auditingImage} layout="responsive" />
          </Grid>
          <Grid item lg={6} md={8} sm={10} xs={10}>
            <Typography variant="h5" className={styles.pricingText}>
              Auditing Price: Starting at $900 Per Contract
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h2" id="kycHeader" ref={kycHeaderRef} className={styles.serviceHeaderText}>
              KYC
            </Typography>
          </Grid>
          <Grid item id="kycImage" ref={kycImageRef} lg={3} md={4} sm={8} xs={10}>
            <Image src={kycImage} layout="responsive" />
          </Grid>
          <Grid item id="kycText" ref={kycTextRef} lg={7} md={6} sm={12} xs={12}>
            <Typography variant="h3">
              Cardinal House&#8216;s KYC service is a simple way to prove your identity as a project
              owner without the need to reveal personal details to the public. All info for the KYC
              will be submitted securely on the DApp and then any follow up communication will be
              through email or Discord DMs. The DApp will also display a list
              of all projects that are KCY&#8216;d through Cardinal House so that anyone can see
              which projects have gone through the KYC process with us.
            </Typography>
          </Grid>
          <Grid item lg={6} md={8} sm={10} xs={10}>
            <Typography variant="h5" className={styles.pricingText}>
              KYC Price: Starting at $1500
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h2" id="amaHeader" ref={amaHeaderRef} className={styles.serviceHeaderText}>
              AMAs
            </Typography>
          </Grid>
          <Grid item id="amaImage" ref={amaImageRef} className={styles.mobileImage} lg={3} md={4} sm={8} xs={10}>
            <Image src={amaImage} layout="responsive" />
          </Grid>
          <Grid item id="amaText" ref={amaTextRef} lg={7} md={6} sm={12} xs={12}>
            <Typography variant="h3">
              Want to share your project with the Cardinal House audience? We have multiple
              AMAs every week so there will definitely be a spot open for you! You will sign up and pay
              right here on the DApp, and then join our Discord community where your AMA will be hosted.
              Most AMAs last roughly an hour but the length is flexible. The structure of the AMAs is
              completely up to you as the project owner! Just to give a couple examples, you could present your project for 
              30 mintues and then have 30 minutes for questions, have the Cardinal House team ask you questions for 45 minutes
              and then have the community ask questions for 15 minutes, or just have the community ask questions the entire time.
            </Typography>
          </Grid>
          <Grid item id="amaImage" ref={amaImageRef} className={styles.desktopImage} lg={3} md={4} sm={8} xs={10}>
            <Image src={amaImage} layout="responsive" />
          </Grid>
          <Grid item lg={6} md={8} sm={10} xs={10}>
            <Typography variant="h5" className={styles.pricingText}>
              AMA Price: Reach Out to Us on Discord
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h2" id="liftOffHeader" ref={liftOffHeaderRef} className={styles.serviceHeaderText}>
              Lift-Off
            </Typography>
          </Grid>
          <Grid item id="liftOffImage" ref={liftOffImageRef} lg={3} md={4} sm={8} xs={10}>
            <Image src={liftOffImage} layout="responsive" />
          </Grid>
          <Grid item id="liftOffText" ref={liftOffTextRef} lg={7} md={6} sm={12} xs={12}>
            <Typography variant="h3">
              Lift-Off is Cardinal House&#8216;s launchpad service. With Lift-Off, you can easily and effeciently
              fund your project through a pre-sale hosted on our platform where you are in charge of the tokenomics, vesting,
              sell fees, the pre-sale period, and much more! You can also use Lift-Off to launch a token
              without having to create your own contract! You control the tokenomics, the total supply of the token,
              minting/burning functionality, and much more.
            </Typography>
          </Grid>
          <Grid item lg={6} md={8} sm={10} xs={10}>
            <Typography variant="h5" className={styles.pricingText}>
              Lift-Off Presale Pricing: $500 Upfront + 1-2% of Funds Raised
            </Typography>
            <Typography variant="h5" className={styles.pricingText}>
              Lift-Off Automated Token Launch Pricing: $500
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h2" id="cardinalPayHeader" ref={cardinalPayHeaderRef} className={styles.serviceHeaderText}>
              Cardinal Pay
            </Typography>
          </Grid>
          <Grid item id="cardinalPayImage" ref={cardinalPayImageRef} className={styles.mobileImage} lg={3} md={4} sm={8} xs={10}>
            <Image src={cardinalPayImage} layout="responsive" />
          </Grid>
          <Grid item id="cardinalPayText" ref={cardinalPayTextRef} lg={7} md={6} sm={12} xs={12}>
            <Typography variant="h3">
              Cardinal Pay is Cardinal House&#8216;s escrow service.
              An escrow service is a way for one party to pay for the services of another party
              without either needing to trust the other to uphold their end of the bargain.
              The party receiving the service pays into a smart contract on the blockchain that holds
              the funds until the party providing the services finishes the job. If both parties
              agree that the job has been finished, then the smart contract releases the payment.
              If there is a disagreement, then the Cardinal House team will intervene to resolve
              the situation.
            </Typography>
          </Grid>
          <Grid item id="cardinalPayImage" ref={cardinalPayImageRef} className={styles.desktopImage} lg={3} md={4} sm={8} xs={10}>
            <Image src={cardinalPayImage} layout="responsive" />
          </Grid>
          <Grid item lg={6} md={8} sm={10} xs={10}>
            <Typography variant="h5" className={styles.pricingText}>
              Cardinal Pay Price: 1% of Service Charge
            </Typography>
          </Grid>

        </Grid>
      </main>
    </div>
  )
}
