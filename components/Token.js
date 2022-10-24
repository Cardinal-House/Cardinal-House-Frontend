import Image from 'next/image';
import { Grid, Button, Typography } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from '../styles/Home.module.css';

import cardinalLogoLight from '../public/CardinalLogoLight.png';

export default function Token(props) {
  gsap.registerPlugin(ScrollTrigger);

  const tokenHeaderRef = useRef();
  const tokenTextRef = useRef();
  const tokenImageRef = useRef();
  const tokenBtnRef = useRef();
  const tokenSplitterRef = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(tokenHeaderRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#tokenHeader", start: "bottom bottom" } });
    gsap.fromTo(tokenTextRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.5, scrollTrigger: { trigger: "#tokenText", start: "bottom bottom" } });
    gsap.fromTo(tokenImageRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#tokenImage", start: "bottom bottom" } });
    gsap.fromTo(tokenBtnRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#tokenBtn", start: "bottom bottom" } });
    gsap.fromTo(tokenSplitterRef.current, {opacity: 0}, { opacity: 1, duration: 1.2, scrollTrigger: { trigger: "#tokenSplitter", start: "bottom bottom" } });
  }, [])
  
  return (
    <Grid container id="token" justifyContent="center" alignItems="center" spacing={6} className={clsx(styles.communityGrid, props.useDarkTheme ? styles.educationGridDark : styles.educationGridLight)}>
      <Grid item lg={8} md={8} sm={12} xs={12} className={styles.communityGridInfo}>
        <Typography id="tokenHeader" ref={tokenHeaderRef} variant="h3" className={styles.communityHeader}>
          Tying it All Together: The Cardinal Token
        </Typography>
        <div id="tokenText" ref={tokenTextRef}>
          <Typography variant="p">
            Each part of the Cardinal House ecosystem is tied together through the Cardinal Token, which will launch in August later this year.
            This token will be used for purchasing memberships, AMAs, and our crypto services on the DApp.
            The growth of Cardinal House will be driven in many ways by the Cardinal Token, as it is
            the currency of our ecosystem. The two main purposes of the Cardinal Token are to have a transaction
            tax to grow the project through marketing and member giveaways, <b> and to turn the crypto services
            into a benefit for everyone</b>, not just those who use it.
          </Typography>
        </div>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item id="tokenImage" ref={tokenImageRef} xs={8}>
            <Image src={cardinalLogoLight} layout="responsive" />
          </Grid>
            <Button id="tokenBtn" ref={tokenBtnRef} href="https://cardinal-house.gitbook.io/cardinal-house-whitepaper-v2/" target="_blank" rel="noreferrer" size="large" variant="contained" color="primary" 
              className={props.useDarkTheme ? styles.teamBtnDark : styles.teamBtnLight}>
              Learn More on Our Whitepaper
            </Button>
        </Grid>
      </Grid>
      <Grid item id="tokenSplitter" ref={tokenSplitterRef} xs={10} className={styles.sectionSplitter}></Grid>
      
    </Grid>
  )
}