import { Grid, Button, Typography } from '@mui/material';
import clsx from 'clsx';

import styles from '../styles/Home.module.css';

export default function Intro(props) {  
  return (
    <Grid container justify="center" className={clsx(styles.introGrid, styles.introBackground)}>
        <Grid item xs={6} className={styles.introText}>
        <Typography variant="h3" className={clsx(props.useDarkTheme ? styles.introTextTypographyDark : styles.introTextTypographyLight, "mb-4", styles.headerText)}>
        <b className={props.useDarkTheme ? styles.boldTextDark : styles.boldTextLight}>Community</b> for Crypto <b className={props.useDarkTheme ? styles.boldTextDark : styles.boldTextLight}>Investors </b>
        and Project <b className={props.useDarkTheme ? styles.boldTextDark : styles.boldTextLight}>Owners</b>
        </Typography>
        <Typography variant="h6">
            Cardinal House is a blockchain ecosystem with a focus on education, community, and
            crypto services that benefit everyone involved
        </Typography>
        <Grid container justifyContent="left">
          <Grid item lg={3} md={4} sm={12} xs={12} >
            <div className="mt-4">
              <Button href="/team" target="_blank" rel="noreferrer" size="small" variant="contained" color="primary" 
                className={props.useDarkTheme ? styles.teamBtnDark : styles.teamBtnLight}>
                Meet the Team
              </Button>
            </div>
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <div className="mt-4">
              <Button href="https://discord.gg/Sw5qsDx2kr" target="_blank" rel="noreferrer" size="small" variant="contained" color="primary" 
                className={props.useDarkTheme ? styles.teamBtnDark : styles.teamBtnLight}>
                Join Our Community
              </Button>
            </div>
          </Grid>
        </Grid>
        </Grid>
    </Grid>
  )
}