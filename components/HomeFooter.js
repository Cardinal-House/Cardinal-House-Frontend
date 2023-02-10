import { Grid, Typography, Card, CardContent, Avatar } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { IconContext } from "react-icons";
import { FaDiscord, FaTwitter, FaTelegram, FaYoutube } from 'react-icons/fa';

import styles from '../styles/Home.module.css';

export default function HomeFooter(props) {
  gsap.registerPlugin(ScrollTrigger);

  const iconsRef = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(iconsRef.current, {opacity: 0}, {opacity: 1, duration: 1, scrollTrigger: { trigger: "#icons", start: "bottom bottom" }});
  }, [])
  
  return (
    <div className={styles.footerDiv}>
      <IconContext.Provider id="icons" ref={iconsRef} value={{ color: props.useDarkTheme ? "#00FFC8" : "#00FFC8" }} className={styles.socialIcons}>
          <Grid container justifyContent="center" alignItems="center" spacing={3} className={styles.socialIcons}>
              <Grid item xs={1} className={clsx(styles.socialIcon, styles.socialIconMargin)}>
                  <a href="https://discord.gg/Sw5qsDx2kr" target="_blank" rel="noreferrer">
                      <FaDiscord className={styles.iconSize} />
                  </a>
              </Grid>
              <Grid item xs={1} className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                  <a href="https://twitter.com/CardinalHouse1" target="_blank" rel="noreferrer">
                      <FaTwitter className={styles.iconSize} />
                  </a>
              </Grid>
              <Grid item xs={1} className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                  <a href="https://www.youtube.com/channel/UC1dUX-MzSWJ046vYP2215-g" target="_blank" rel="noreferrer">
                      <FaYoutube className={styles.iconSize} />
                  </a>
              </Grid>
              <Grid item xs={1} className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                  <a href="https://t.me/CardinalHousechat" target="_blank" rel="noreferrer">
                      <FaTelegram className={styles.iconSize} />
                  </a>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item lg={2} md={2} sm={3} xs={12}>
                <a href="https://cardinal-house.gitbook.io/cardinal-house-whitepaper-v2/" target="_blank" rel="noreferrer" className={styles.footerLink}>
                    <Typography variant="h6">
                        White Paper
                    </Typography>
                </a>
              </Grid>
              <Grid item lg={2} md={2} sm={3} xs={3}>
                <a href="/dapp" className={styles.footerLink}>
                    <Typography variant="h6">
                        DApp
                    </Typography>
                </a>
              </Grid>
              <Grid item lg={2} md={2} sm={3} xs={3}>
                <a href="https://www.youtube.com/channel/UC1dUX-MzSWJ046vYP2215-g" target="_blank" rel="noreferrer" className={styles.footerLink}>
                    <Typography variant="h6">
                        YouTube
                    </Typography>
                </a>
              </Grid>
              <Grid item lg={2} md={2} sm={3} xs={12}>
                <a href="/terms-of-service" target="_blank" rel="noreferrer" className={styles.footerLink}>
                    <Typography variant="h6">
                        Terms of Service
                    </Typography>
                </a>
              </Grid>
              <Grid item lg={2} md={2} sm={3} xs={12}>
                <a href="/privacy-policy" target="_blank" rel="noreferrer" className={styles.footerLink}>
                    <Typography variant="h6">
                        Privacy Policy
                    </Typography>
                </a>
              </Grid>
              <Grid item xs={12} className={styles.footerBottomText}>
                <Typography variant="p">
                  Copyright Cardinal House 2022
                </Typography>
              </Grid>
          </Grid>
      </IconContext.Provider>
    </div>
  )
}