import Image from 'next/image';
import { Grid, Button, Typography } from '@mui/material';
import clsx from 'clsx';

import cardinalHouseLogo from '../public/CardinalLogoLight.png';
import styles from '../styles/EducationCenter.module.css';

export default function EducationCenterIntro(props) {
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={4} className={styles.educationCenterIntroGrid}>
      <Grid item lg={6} md={8} sm={10} xs={12} className={styles.headerTextGrid}>
        <Typography variant="h1" className={styles.headerText}>
          Cardinal House Education Center
        </Typography>
      </Grid>
      <Grid item lg={10} md={10} sm={10} xs={12} className="mt-2 text-center">
        <Typography variant="h3">
          Welcome to the education center for Cardinal House! Here we have a carefully curated cryptocurrency
          curriculum designed for cyrpto enthusiasts with any level of experience! The education center leverages
          content from many different YouTube content creators to provide a single place for you to learn
          everything about cryptocurrency and blockchain technology. There are sections on cryptocurrency history,
          mining, investing strategies, technical analysis, the different types of common protocols, and much more!
        </Typography>
      </Grid>
      <Grid item lg={10} md={10} sm={10} xs={12} className="mt-2 text-center">
        <Typography variant="h3">
          For the best experience, use the education center on a larger screen. You can start from the beginning
          of the content or scroll through the navigation to find the section that interests you the most!
          Your progress through the educational content will also be tracked on your current device so you can come 
          back to where you left off!
        </Typography>
      </Grid>
      <Grid item lg={4} md={5} sm={8} xs={10}>
        <Image src={cardinalHouseLogo} layout="responsive" />
      </Grid>
    </Grid>
  )
}