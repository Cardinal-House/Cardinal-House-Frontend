import { useEffect, useState, Fragment } from 'react';
import clsx from 'clsx';
import { Grid, Typography, Button, IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

import { getProjects } from './api/projects';

import ProjectInsightNavigation from '../components/ProjectInsightNavigation';
import ProjectSearch from '../components/ProjectSearch';
import HomeFooter from '../components/HomeFooter';

import styles from '../styles/EducationCenter.module.css';

function ProjectInsights(props) {
  const [feedbackSnackbarOpen, setFeedbackSnackbarOpen] = useState(true);

  useEffect(() => {
    props.setUseDarkTheme(false);
  }, [])

  const action = (
    <Fragment>
        <Button variant="contained" size="small" className={styles.feedbackBtn} href="https://forms.clickup.com/20120187/f/k60kv-1607/AW3HWIMB0GS8YZ5HQ8" target="_blank" rel="noreferrer">
            Give Feedback
        </Button>
        <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setFeedbackSnackbarOpen(false)}
        >
        <CloseIcon fontSize="small" />
        </IconButton>
    </Fragment>
  );  

  return (
    <>
        <ProjectInsightNavigation />
        <Snackbar
            open={feedbackSnackbarOpen}
            autoHideDuration={60000}
            onClose={() => setFeedbackSnackbarOpen(false)}
            message="This platform is in beta. Feedback is very much appreciated!"
            action={action}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
        <div className={props.useDarkTheme ? styles.darkThemeBackground : styles.lightThemeBackground}>
            <Grid container justifyContent="center" alignItems="center" spacing={4} className={styles.projectListingIntroGrid}>
                <Grid item lg={8} md={10} sm={10} xs={12} className={styles.headerTextGrid}>
                    <Typography variant="h1" className={clsx(styles.insightsHeaderText, props.useDarkTheme ? styles.headerTextDark : styles.headerTextLight)}>
                        Cardinal House Crypto Insights
                    </Typography>
                </Grid>
                <Grid item xs={12}></Grid>

                <Grid item lg={10} md={10} sm={12} xs={12} className="mb-3">
                    <Typography variant="h3">
                        Welcome to the Cardinal House crypto insights! Here you can get the latest updates on how your favorite projects
                        and doing through market data and social feeds all in one place! This platform is in beta, so any feedback is much appreciated
                        and many more features will be added in the upcoming months.
                    </Typography>
                </Grid>

                <ProjectSearch useDarkTheme={props.useDarkTheme} projects={props.projects} tags={props.tags} chains={props.chains} tagCount={props.tagCount} chainCount={props.chainCount} />
            </Grid>

            <HomeFooter useDarkTheme={props.useDarkTheme} />
        </div>
    </>
  );
}

const projectSort = (project1, project2) => {
    const marketCap1 = project1.marketCap ? parseInt(project1.marketCap) : 0;
    const marketCap2 = project2.marketCap ? parseInt(project2.marketCap) : 0;
    return marketCap2 - marketCap1;
}

export async function getStaticProps() {
    const projects = (await getProjects()).sort(projectSort);

    for (let i = 0; i < projects.length; i++) {
        projects[i].marketCapNumber = i + 1;
    }

    const tagSet = new Set();
    const chainSet = new Set();
    const tagCount = {};
    const chainCount = {};

    for (let i = 0; i < projects.length; i++) {
        const currTagsStr = projects[i].tags;
        const currChainsStr = projects[i].chains;

        if (currTagsStr) {
            const currTags = currTagsStr.split(",");
            for (let j = 0; j < currTags.length; j++) {
                const currTag = currTags[j];
                tagSet.add(currTag);

                if (!Object.keys(tagCount).includes(currTag)) {
                    tagCount[currTag] = 1;
                }
                else {
                    tagCount[currTag] += 1;
                }
            }
        }

        if (currChainsStr) {
            const currChains = currChainsStr.split(",");
            for (let j = 0; j < currChains.length; j++) {
                const currChain = currChains[j];
                chainSet.add(currChain);

                if (!Object.keys(chainCount).includes(currChain)) {
                    chainCount[currChain] = 1;
                }
                else {
                    chainCount[currChain] += 1;
                }
            }
        }
    }

    const tags = Array.from(tagSet);
    const chains = Array.from(chainSet);

    return {
        props: {
            projects,
            tags,
            chains,
            tagCount,
            chainCount
        },
        revalidate: 30, // In seconds
    }
}

export default ProjectInsights;
