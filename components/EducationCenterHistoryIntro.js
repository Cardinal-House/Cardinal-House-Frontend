import Image from 'next/image';
import { Grid, Typography } from '@mui/material';

import cardinalHouseLogo from '../public/CardinalLogoLight.png';
import educationArt from '../public/educationArt2.png';
import styles from '../styles/EducationCenter.module.css';

export default function EducationCenterHistoryIntro(props) {
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={4} className={styles.educationCenterIntroGrid}>
      <Grid item lg={6} md={8} sm={10} xs={12} className={styles.headerTextGrid}>
        <Typography variant="h1" className={styles.headerText}>
          History and Use Case of Crypto
        </Typography>
      </Grid>
      <Grid item xs={12}></Grid>

      <Grid item lg={10} md={10} sm={12} xs={12} className="mb-5">
        <Typography variant="h3">
          Welcome to the Cardinal House education center! Here we have a carefully curated cryptocurrency
          curriculum designed for crypto enthusiasts with any level of experience. The education center leverages
          content from many different YouTube content creators to provide a single place for you to learn
          everything about cryptocurrency and blockchain technology.
          
        </Typography>
      </Grid>

      <Grid className={styles.mobileImage} item lg={4} md={5} sm={8} xs={10}>
        <Image src={educationArt} layout="responsive" />
      </Grid>
      <Grid item lg={7} md={6} sm={12} xs={12}>
        <Typography variant="h3">
          There are five main sections of content in the education center: an introduction to crypto,
          the foundations of crypto, a walkthrough on getting started in the DeFi space, how to pick investments,
          and crypto culture. Each of these sections have many subsections filled with videos and articles that
          the Cardinal House team has spent countless hours putting together for you and will continue to update over time.
        </Typography>
      </Grid>
      <Grid className={styles.desktopImage} item lg={4} md={5} sm={8} xs={10}>
        <Image src={educationArt} layout="responsive" />
      </Grid>

      <Grid item lg={4} md={5} sm={8} xs={10}>
        <Image src={cardinalHouseLogo} layout="responsive" />
      </Grid>
      <Grid item lg={7} md={6} sm={12} xs={12}>
        <Typography variant="h3">
          For the best experience, use the education center on a larger screen. You can start from the beginning
          of the content or pick and choose from the sections that interest you the most!
          Your progress through the educational content will also be tracked on your current device so you can come 
          back to where you left off. Once all of the content has been marked as complete, you will also get a one time
          discount on a Cardinal House membership!
        </Typography>
      </Grid>
    </Grid>
  )
}