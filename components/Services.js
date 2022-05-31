import { Grid, Button, Typography } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from '../styles/Home.module.css';

export default function Services(props) {
  gsap.registerPlugin(ScrollTrigger);

  const servicesHeaderRef = useRef();
  const servicesTextRef = useRef();
  const servicesImageRef = useRef();
  const servicesBtnRef = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(servicesHeaderRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#servicesHeader", start: "bottom bottom" } });
    gsap.fromTo(servicesTextRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.5, scrollTrigger: { trigger: "#servicesText", start: "bottom bottom" } });
    gsap.fromTo(servicesBtnRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#servicesBtn", start: "bottom bottom" } });
  }, [])
  
  return (
    <Grid container id="services" justifyContent="center" alignItems="center" spacing={6} className={clsx(styles.communityGrid, props.useDarkTheme ? styles.communityGridDark : styles.communityGridLight)}>
      <Grid item lg={8} md={8} sm={12} xs={12}>
        <Typography id="servicesHeader" ref={servicesHeaderRef} variant="h3" className={styles.communityHeader}>
          Services
        </Typography>
        <div id="servicesText" ref={servicesTextRef}>
          <Typography variant="p">
            Cardinal House will offer many crypto services such as auditing, marketing, an NFT marketplace, 
            a KYC service, a launchpad service (Lift-Off), and an esgrow service (Cardinal Pay). 
            These services will be added to our ecosystem over time and will be a way for projects that come
            into our community for AMAs to further use our platform for the benefit of their project 
            <i> and</i> the Cardinal House community.
          </Typography>
        </div>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <Button id="servicesBtn" ref={servicesBtnRef} href="/dapp" target="_blank" rel="noreferrer" size="large" variant="contained" color="primary" 
            className={props.useDarkTheme ? styles.teamBtnDark : styles.teamBtnLight}>
            View Services on Our DApp
          </Button>
      </Grid>
      
    </Grid>
  )
}