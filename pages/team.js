import Image from 'next/image';
import { Grid, Typography } from '@mui/material';
import clsx from 'clsx';

import Navigation from '../components/Navigation';
import colePic from '../public/Cole.png';
import sydneyPic from '../public/Sydney.png';
import zachPic from '../public/Zach.png';
import jojoPic from '../public/Jojo.png';
import chrisPic from '../public/Chris.png';
import styles from '../styles/team.module.css';
import { FaLinkedin } from 'react-icons/fa';

export default function team(props) {
    return (
        <>
        <Navigation useDarkTheme={props.useDarkTheme} setUseDarkTheme={props.setUseDarkTheme} />
        <Grid container justifyContent="center" className={clsx(styles.mainGrid, props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
            <Grid item xs={3} className={styles.spacingGrid}></Grid>
            <Grid item xs={4} className={styles.headerGrid}>
                <Typography variant="h4" className={clsx(styles.header)}>
                    Cardinal House Core Team
                </Typography>
            </Grid>
            <Grid item xs={3} className={styles.spacingGrid}></Grid>
            <Grid item xs={10}>
                <Grid container justifyContent="center" alignItems="center" spacing={8}>
                    <Grid className={styles.spacingGrid} item lg={1} md={1} sm={0} xs={0}></Grid>
                    <Grid item xs={3} className={clsx(styles.teamGrid, styles.firstTeammate)}>
                        <Image src={zachPic} layout="responsive" className={styles.teamImage} />
                        <Typography variant="h5" className={styles.headerText}>
                            Zach Medin
                        </Typography>
                        <p className={styles.bioText}>
                            Chief Executive Officer
                        </p>
                        <div className={styles.iconDiv}>
                            <a href="https://www.linkedin.com/in/zach-medin-183455230/" target="_blank" rel="noreferrer">
                                <FaLinkedin className={styles.linkedInIcon} />
                            </a>
                        </div>
                    </Grid>
                    <Grid item xs={3} className={styles.teamGrid}>
                        <Image src={colePic} layout="responsive" className={styles.teamImage} />
                        <Typography variant="h5" className={styles.headerText}>
                            Cole Medin
                        </Typography>
                        <p className={styles.bioText}>
                            Chief Technology Officer
                        </p>
                        <div className={styles.iconDiv}>
                            <a href="https://www.linkedin.com/in/cole-medin-727752184/" target="_blank" rel="noreferrer">
                                <FaLinkedin className={styles.linkedInIcon} />
                            </a>
                        </div>                        
                    </Grid>
                    <Grid item xs={3} className={clsx(styles.teamGrid, styles.lastTeammate)}>
                        <Image src={jojoPic} layout="responsive" className={styles.teamImage} />
                        <Typography variant="h5" className={styles.headerText}>
                            Jojo Beale
                        </Typography>
                        <p className={styles.bioText}>
                            Chief Marketing Officer
                        </p>
                        <div className={styles.iconDiv}>
                            <a href="https://www.linkedin.com/in/jojo-beale-0b473223b/" target="_blank" rel="noreferrer">
                                <FaLinkedin className={styles.linkedInIcon} />
                            </a>
                        </div>                        
                    </Grid>
                    <Grid className={styles.spacingGrid} item lg={1} md={1} sm={0} xs={0}></Grid>
                    <Grid item xs={3} className={clsx(styles.teamGrid, styles.lastTeammate)}>
                        <Image src={chrisPic} layout="responsive" className={styles.teamImage} />
                        <Typography variant="h5" className={styles.headerText}>
                            Chris Beale
                        </Typography>
                        <p className={styles.bioText}>
                            Chief Operating Officer
                        </p>
                        <div className={styles.iconDiv}>
                            <a href="https://www.linkedin.com/in/chris-beale-7ab40b227/" target="_blank" rel="noreferrer">
                                <FaLinkedin className={styles.linkedInIcon} />
                            </a>
                        </div>                        
                    </Grid>
                    <Grid item xs={3} className={clsx(styles.teamGrid, styles.lastTeammate)}>
                        <Image src={sydneyPic} layout="responsive" className={styles.teamImage} />
                        <Typography variant="h5" className={styles.headerText}>
                            Sydney Medin
                        </Typography>
                        <p className={styles.bioText}>
                            Graphic Designer
                        </p>
                        <div className={styles.iconDiv}>
                            <a href="https://www.linkedin.com/in/sydney-medin-ab607b203/" target="_blank" rel="noreferrer">
                                <FaLinkedin className={styles.linkedInIcon} />
                            </a>
                        </div>                        
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        </>
    )
}