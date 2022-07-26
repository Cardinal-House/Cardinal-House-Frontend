import { Grid, Typography, Card, CardContent, CardHeader } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import styles from '../styles/Home.module.css';

export default function Growth(props) {
  gsap.registerPlugin(ScrollTrigger);

  const growthHeaderRef = useRef();
  const growthCard1Ref = useRef();
  const growthCard2Ref = useRef();
  const growthCard3Ref = useRef();
  const growthCard4Ref = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(growthHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#growthHeader", start: "bottom bottom" } });
    gsap.fromTo(growthCard1Ref.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#growthCard1", start: "top bottom" } });
    gsap.fromTo(growthCard2Ref.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#growthCard2", start: "top bottom" } });
    gsap.fromTo(growthCard3Ref.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#growthCard3", start: "top bottom" } });
    gsap.fromTo(growthCard4Ref.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#growthCard4", start: "top bottom" } });
  }, [])
  
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={6} className={clsx(styles.growthGrid)}>
      <Grid item xs={12}>
        <Typography id="growthHeader" ref={growthHeaderRef} variant="h2" className={styles.growthHeader}>
          More Services Over Time = More Volume Over Time
        </Typography>
      </Grid>
        <Grid item lg={5} md={5} sm={10} xs={12} className={styles.forCard}>
          <Card id="growthCard1" ref={growthCard1Ref} className={clsx(styles.growthCard, styles.growthCard1)}>
            <div>
              <CardContent>
                <Typography variant="h4" component="div" className={styles.growthTimeText}>
                  Q2 2022:
                </Typography>
                <Typography variant="h5" component="div" className={styles.growthText}>
                  <IoMdCheckmarkCircleOutline /> Memberships
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> AMAs
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item lg={5} md={5} sm={10} xs={12} className={styles.forCard}>
          <Card id="growthCard2" ref={growthCard2Ref} className={clsx(styles.growthCard, styles.growthCard2)}>
            <div>
              <CardContent>
                <Typography variant="h4" component="div" className={styles.growthTimeText}>
                  Early Q3 2022:
                </Typography>
                <Typography variant="h5" component="div" className={styles.growthText}>
                  <IoMdCheckmarkCircleOutline /> Memberships
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> AMAs
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> NFT marketplace
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> Giveaways
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item lg={5} md={5} sm={10} xs={12} className={styles.forCard}>
          <Card id="growthCard3" ref={growthCard3Ref} className={clsx(styles.growthCard, styles.growthCard3)}>
            <div>
              <CardContent>
                <Typography variant="h4" component="div" className={styles.growthTimeText}>
                  Late Q3 2022:
                </Typography>
                <Typography variant="h5" component="div" className={styles.growthText}>
                  <IoMdCheckmarkCircleOutline /> Memberships
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> AMAs
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> NFT marketplace
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> Giveaways
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> Auditing
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> KYC
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item lg={5} md={5} sm={10} xs={12} className={styles.forCard}>
          <Card id="growthCard4" ref={growthCard4Ref} className={clsx(styles.growthCard, styles.growthCard4)}>
            <div>
              <CardContent>
                <Typography variant="h4" component="div" className={styles.growthTimeText}>
                  Q4 2022:
                </Typography>
                <Typography variant="h5" component="div" className={styles.growthText}>
                  <IoMdCheckmarkCircleOutline /> Memberships
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> AMAs
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> NFT marketplace
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> Giveaways
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> Auditing
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> KYC
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> Lift-Off
                </Typography>
                <Typography variant="h5" component="div" className={clsx("mt-2", styles.growthText)}>
                  <IoMdCheckmarkCircleOutline /> Cardinal Pay
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
    </Grid>
  )
}