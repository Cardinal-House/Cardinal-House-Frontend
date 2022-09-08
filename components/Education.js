import Image from 'next/image';
import { Grid, Button, Typography } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from '../styles/Home.module.css';

import educationArt from '../public/educationArt.png';

export default function Education(props) {
  gsap.registerPlugin(ScrollTrigger);

  const educationHeaderRef = useRef();
  const edcuationTextRef = useRef();
  const educationImageRef = useRef();
  const educationBtnRef = useRef();
  const educationBtn2Ref = useRef();
  const educationSplitterRef = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(educationHeaderRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#educationHeader", start: "bottom bottom" } });
    gsap.fromTo(edcuationTextRef.current, {x: -1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.5, scrollTrigger: { trigger: "#educationText", start: "bottom bottom" } });
    gsap.fromTo(educationImageRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#educationImage", start: "bottom bottom" } });
    gsap.fromTo(educationBtnRef.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#educationBtn", start: "bottom bottom" } });
    gsap.fromTo(educationBtn2Ref.current, {x: 1000, opacity: 0}, { x: 0, opacity: 1, duration: 0.7, scrollTrigger: { trigger: "#educationBtn2", start: "bottom bottom" } });
    gsap.fromTo(educationSplitterRef.current, {opacity: 0}, { opacity: 1, duration: 1.2, scrollTrigger: { trigger: "#educationSplitter", start: "bottom bottom" } });
  }, [])
  
  return (
    <Grid container id="education" justifyContent="center" alignItems="center" spacing={6} className={clsx(styles.communityGrid, props.useDarkTheme ? styles.educationGridDark : styles.educationGridLight)}>
      <Grid item lg={8} md={8} sm={12} xs={12} className={styles.communityGridInfo}>
        <Typography id="educationHeader" ref={educationHeaderRef} variant="h3" className={styles.communityHeader}>
          Education
        </Typography>
        <div id="educationText" ref={edcuationTextRef}>
          <Typography variant="p">
            One of the main pillars of Cardinal House is providing educational content to the community on all things crypto.
            There will be something for everyone to learn here! Our main avenues of educational content
            will be our education center, bringing projects into our Discord server for AMAs, posting videos to YouTube, and
            hosting discussions in our community.
          </Typography>
        </div>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item id="educationImage" ref={educationImageRef} className="mb-4" xs={8}>
            <Image src={educationArt} layout="responsive" />
          </Grid>
          <Grid item className={styles.btnGrid} xs={12}>
            <Button id="educationBtn" ref={educationBtnRef} href="https://www.youtube.com/channel/UC1dUX-MzSWJ046vYP2215-g" target="_blank" rel="noreferrer" size="large" variant="contained" color="primary" 
              className={props.useDarkTheme ? styles.teamBtnDark : styles.teamBtnLight}>
              Explore our YouTube Channel
            </Button>
          </Grid>
          <Grid item className={clsx(styles.btnGrid, styles.bottomBtn)} xs={12}>
            <Button id="educationBtn2" ref={educationBtn2Ref} href="/educationcenter" size="large" variant="contained" color="primary" 
              className={clsx("mt-3", props.useDarkTheme ? styles.teamBtnDark : styles.teamBtnLight)}>
              Check out our Education Center
            </Button>
          </Grid>
          </Grid>
      </Grid>
      <Grid item id="educationSplitter" ref={educationSplitterRef} xs={10} className={styles.sectionSplitter}></Grid>
      
    </Grid>
  )
}