import { Grid, Button, Typography, Card, CardContent, CardActions, Avatar } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

import styles from '../styles/Home.module.css';

export default function ForCards(props) {
  gsap.registerPlugin(ScrollTrigger);

  const tokenomicsHeader = useRef();
  const tokenomicsSubHeader = useRef();
  const tokenomicsCard1Ref = useRef();
  const tokenomicsCard2Ref = useRef();

  // Loads animations for elements of the page.
  useEffect(() => {
    gsap.fromTo(tokenomicsHeader.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#tokenomicsHeader", start: "bottom bottom" } });
    gsap.fromTo(tokenomicsSubHeader.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#tokenomicsSubHeader", start: "bottom bottom" } });
    gsap.fromTo(tokenomicsCard1Ref.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#tokenomicsCard1", start: "bottom bottom" } });
    gsap.fromTo(tokenomicsCard2Ref.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#tokenomicsCard2", start: "bottom bottom" } });
  }, [])
  
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={6} className={clsx(styles.tokenomicsGrid)}>
      <Grid item xs={12}>
        <Typography id="tokenomicsHeader" ref={tokenomicsHeader} variant="h3" className={styles.tokenomicsHeader}>
          Tokenomics: How will Service Payments Help Everyone?
        </Typography>
      </Grid>
      <Grid item lg={2} md={2} xs={0} ></Grid>
      <Grid item lg={8} md={8} sm={10} xs={12}>
        <Typography id="tokenomicsSubHeader" ref={tokenomicsSubHeader} variant="h5" className={styles.tokenomicsSubHeader}>
          Each time someone pays for a Cardinal House service, they are using the Cardinal Token
          and thus they are generating volume for the project. Volume helps everyone for two reasons - 
          transaction fees for marketing and member giveaways, and token burning to increase the scarcity, thus the value, of
          the Cardinal Token.
        </Typography>
      </Grid>
      <Grid item lg={2} md={2} xs={0} ></Grid>
      <Grid item lg={4} md={5} sm={10} xs={12} className={styles.forCard}>
        <Card id="tokenomicsCard1" ref={tokenomicsCard1Ref} className={clsx(styles.customCard, props.useDarkTheme ? styles.customCardDark : styles.customCardLight)}>
          <div>
            <CardContent>
              <Avatar className={props.useDarkTheme ? styles.avatarDarkTheme : styles.avatarLightTheme} sx={{ width: 70, height: 70 }}>
                <CurrencyExchangeIcon sx={{ width: 40, height: 40 }} />
              </Avatar>
              <Typography variant="h2">
                5% Transaction Fee
              </Typography>
              <Typography variant="p" component="div" className="mt-3">
                2% - Marketing to Grow the Cardinal House Ecosystem
              </Typography>
              <Typography variant="p" component="div" className="mt-3">
                2% - Weekly Giveaways for Members - 1 Member will Win Cardinal Tokens Each Week
              </Typography>
              <Typography variant="p" component="div" className="mt-3">
                1% - Team Funds
              </Typography>
            </CardContent>
          </div>
        </Card>
      </Grid>
      <Grid item lg={4} md={5} sm={10} xs={12} className={styles.forCard}>
        <Card id="tokenomicsCard2" ref={tokenomicsCard2Ref} className={clsx(styles.customCard, props.useDarkTheme ? styles.customCardDark : styles.customCardLight)}>
          <div>
            <CardContent>
              <Avatar className={props.useDarkTheme ? styles.avatarDarkTheme : styles.avatarLightTheme} sx={{ width: 70, height: 70 }}>
                <LocalFireDepartmentIcon sx={{ width: 40, height: 40 }} />
              </Avatar>
              <Typography variant="h2">
                Token Burning
              </Typography>
              <Typography variant="p" component="div" className="mt-4">
                A portion (10% - 50% depending on the service) of all Cardinal Tokens used to purchase crypto services
                will be burned. This function will constantly add liquidity to
                the token which will benefit everyone involved in Cardinal House.
              </Typography>
            </CardContent>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}