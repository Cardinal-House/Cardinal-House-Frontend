import { Grid, Typography, Card, CardContent, Avatar } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import styles from '../styles/Home.module.css';

export default function ForCards(props) {
  gsap.registerPlugin(ScrollTrigger);

  const forCard1Ref = useRef();
  const forCard2Ref = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(forCard1Ref.current, {opacity: 0}, {opacity: 1, duration: 1, scrollTrigger: { trigger: "#forCard1", start: "bottom bottom" }});
    gsap.fromTo(forCard2Ref.current, {opacity: 0}, {opacity: 1, duration: 1, scrollTrigger: { trigger: "#forCard2", start: "bottom bottom" }});
  }, [])
  
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={6} className={clsx(styles.forGrid)}>
        <Grid item lg={4} md={5} sm={10} xs={12} className={styles.forCard1}>
          <Card id="forCard1" ref={forCard1Ref} className={clsx(styles.customCard, props.useDarkTheme ? styles.customCardDark : styles.customCardLight)}>
            <div>
              <CardContent>
                <Avatar className={props.useDarkTheme ? styles.avatarDarkTheme : styles.avatarLightTheme} sx={{ width: 70, height: 70 }}>
                  <AccountBalanceWalletIcon sx={{ width: 40, height: 40 }} />
                </Avatar>
                <Typography variant="h5" component="div">
                  For Investors
                </Typography>
                <Typography variant="p" component="div" className="mt-4">
                  Looking to get an edge on investing in up and coming cryptocurrency projects?
                  With all the exposure to projects Cardinal House will give you, you&#8216;ve
                  found the right place!
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item item lg={4} md={5} sm={10} xs={12} className={styles.forCard2}>
          <Card id="forCard2" ref={forCard2Ref} className={clsx(styles.customCard, props.useDarkTheme ? styles.customCardDark : styles.customCardLight)}>
            <div>
              <CardContent>
                <Avatar className={props.useDarkTheme ? styles.avatarDarkTheme : styles.avatarLightTheme} sx={{ width: 70, height: 70 }}>
                  <AccountBalanceWalletIcon sx={{ width: 40, height: 40 }} />
                </Avatar>
                <Typography variant="h5" component="div">
                  For Project Owners
                </Typography>
                <Typography variant="p" component="div" className="mt-4">
                  Need affordable KYC, auditing, AMA, or marketing services? Or maybe you need
                  a customizable and secure launchpad? No matter what your project needs are, Cardinal
                  House has you covered!
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
    </Grid>
  )
}