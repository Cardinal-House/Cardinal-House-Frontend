import { useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { AiFillHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";

import { Grid, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';

import { getProjects } from '../api/projects';

import ProjectInsightNavigation from '../../components/ProjectInsightNavigation';
import ProjectSearch from '../../components/ProjectSearch';
import HomeFooter from '../../components/HomeFooter';

import styles from '../../styles/EducationCenter.module.css';

function ProjectInsights(props) {
  useEffect(() => {
    props.setUseDarkTheme(false);
  }, [])

  return (
    <>
        <ProjectInsightNavigation />
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

export async function getStaticProps() {
    const projects = await getProjects();

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
