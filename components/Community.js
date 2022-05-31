import { Grid, Button, Typography } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from '../styles/Home.module.css';

export default function Community(props) {
  gsap.registerPlugin(ScrollTrigger);

  const communityHeaderRef = useRef();
  const communityTextRef = useRef();
  const communityImageRef = useRef();
  const communityBtnRef = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(communityHeaderRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#communityHeader", start: "bottom bottom" } });
    gsap.fromTo(communityTextRef.current, {x: -1000, opacity: 0}, {x: 0, opacity: 1, duration: 0.5, scrollTrigger: { trigger: "#communityText", start: "bottom bottom" } });
    gsap.fromTo(communityBtnRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#communityBtn", start: "bottom bottom" } });
  }, [])
  
  return (
    <Grid container id="community" justifyContent="center" alignItems="center" spacing={6} className={clsx(styles.communityGrid, props.useDarkTheme ? styles.communityGridDark : styles.communityGridLight)}>
      <Grid item lg={8} md={8} sm={12} xs={12}>
        <Typography id="communityHeader" ref={communityHeaderRef} variant="h3" className={styles.communityHeader}>
          Community
        </Typography>
        <div id="communityText" ref={communityTextRef}>
          <Typography variant="p">
            Cardinal House is a Discord based community that we are dedicated to growing constantly through
            bringing in projects for AMAs, hosting discussions, providing educational content for all members,
            and expanding our ecosystem over time to provide more and more benefits to everyone. There will
            also be paid memberships that will unlock exclusive content, giveaways, and whitelist spots
            for projects that come into the community for AMAs!
          </Typography>
        </div>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <Button id="communityBtn" ref={communityBtnRef} href="https://discord.gg/Sw5qsDx2kr" target="_blank" rel="noreferrer" size="large" variant="contained" color="primary" 
            className={props.useDarkTheme ? styles.teamBtnDark : styles.teamBtnLight}>
            Join Our Discord!
          </Button>
      </Grid>
      
    </Grid>
  )
}