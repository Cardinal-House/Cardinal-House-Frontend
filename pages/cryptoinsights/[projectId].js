import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import axios from 'axios';
import { AiFillHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { BsArrowUpCircle } from "react-icons/bs";
import { Modal } from "react-bootstrap";

import { Grid, Typography, Button, CircularProgress } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';

import { getProjects } from '../api/projects';
import { getProjectById } from '../api/projectbyid';
import { getProjectFeed } from '../api/projectfeed';

import ProjectInsightNavigation from '../../components/ProjectInsightNavigation';
import ProjectSearch from '../../components/ProjectSearch';
import HomeFooter from '../../components/HomeFooter';
import TwitterFeedItem from '../../components/TwitterFeedItem';
import YouTubeFeedItem from '../../components/YouTubeFeedItem';
import DiscordFeedItem from '../../components/DiscordFeedItem';
import TelegramFeedItem from '../../components/TelegramFeedItem';
import MediumFeedItem from '../../components/MediumFeedItem';
import ProjectAbout from '../../components/ProjectAbout';

import styles from '../../styles/EducationCenter.module.css';

const drawerWidth = 275;
const skipNumIncrement = 5;

function useVisibility(offset = 0,) {
    const [isVisible, setIsVisible] = useState(false);
    const currentElement = useRef(null);
  
    const onScroll = () => {
      if (!currentElement.current) {
        setIsVisible(false);
        return;
      }
      const top = currentElement.current.getBoundingClientRect().top;
      setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
    }
  
    useEffect(() => {
      document.addEventListener('scroll', onScroll, true);
      return () => document.removeEventListener('scroll', onScroll, true);
    }, [])
  
    return [isVisible, currentElement]
  }

function ProjectInsight(props) {
  const { window2 } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [socialSelected, setSocialSelected] = useState("about");
  const [loadingMoreFeedItems, setLoadingMoreFeedItems] = useState(false);
  const [feedSkipNum, setFeedSkipNum] = useState(skipNumIncrement);
  const [additionalFeed, setAdditionalFeed] = useState([]);
  const [allFeedItemsLoaded, setAllFeedItemsLoaded] = useState(false);
  const [showProjectSearchModal, setShowProjectSearchModal] = useState(false);

  const [socialSpecificFeeds, setSocialSpecificFeeds] = useState({
    twitter: {skipNum: props.projectFeed.filter(f => f.social == "twitter").length, feed: [], allFeedLoaded: false},
    youtube: {skipNum: props.projectFeed.filter(f => f.social == "youtube").length, feed: [], allFeedLoaded: false},
    discord: {skipNum: props.projectFeed.filter(f => f.social == "discord").length, feed: [], allFeedLoaded: false},
    telegram: {skipNum: props.projectFeed.filter(f => f.social == "telegram").length, feed: [], allFeedLoaded: false},
    medium: {skipNum: props.projectFeed.filter(f => f.social == "medium").length, feed: [], allFeedLoaded: false}
  });

  const [lastItemFeedShown, lastFeedItemRef] = useVisibility();

  useEffect(() => {
    if (socialSelected == "about") {
        return;
    }
    const allFeedLoadedForCurrSocial = socialSelected == "all" ? allFeedItemsLoaded : socialSpecificFeeds[socialSelected]["allFeedLoaded"];
    if ((lastItemFeedShown || (socialSelected != "all" && socialSelected != "about" && socialSpecificFeeds[socialSelected]["feed"].length == 0)) && !loadingMoreFeedItems && !allFeedLoadedForCurrSocial) {
        setLoadingMoreFeedItems(true);
        axios.get("/api/projectfeed", {
            params: {
                collectionName: props.project.collectionName,
                mainSkipNum: feedSkipNum,
                socialSkipNum: socialSelected != "all" ? socialSpecificFeeds[socialSelected]["skipNum"] : 0,
                socialSelected: socialSelected
            }
        })  
        .then(function (response) {
          const newProjectFeed = response.data;
          let newSocialSpecificFeeds = JSON.parse(JSON.stringify(socialSpecificFeeds));

          if (socialSelected == "all") {
            setFeedSkipNum(feedSkipNum + skipNumIncrement);
  
            if (newProjectFeed.length == 0) {
              setAllFeedItemsLoaded(true);
              setLoadingMoreFeedItems(false);
              return;
            }

            Object.keys(newSocialSpecificFeeds).forEach((social) => {
                newSocialSpecificFeeds[social]["skipNum"] += newProjectFeed.filter(f => f.social == social).length;
            })

            for (let i = 0; i < newProjectFeed.length; i++) {
                const currProjectFeed = newProjectFeed[i];
                let currSocialSpecificFeed = newSocialSpecificFeeds[currProjectFeed.social]["feed"];

                for (let j = 0; j < currSocialSpecificFeed.length; j++) {
                    if (currProjectFeed.feedId == currSocialSpecificFeed[j].feedId) {
                        currSocialSpecificFeed = currSocialSpecificFeed.filter(f => f.feedId != currProjectFeed.feedId);
                        newSocialSpecificFeeds[currProjectFeed.social]["skipNum"] -= 1;
                        continue;
                    }
                }
            }
  
            setAdditionalFeed(JSON.parse(JSON.stringify(additionalFeed.concat(newProjectFeed))));
          }
          else {
            newSocialSpecificFeeds[socialSelected]["skipNum"] += skipNumIncrement;

            if (newProjectFeed.length == 0) {
                newSocialSpecificFeeds[socialSelected]["allFeedLoaded"] = true;
            }
            else {
                newSocialSpecificFeeds[socialSelected]["feed"] = newSocialSpecificFeeds[socialSelected]["feed"].concat(newProjectFeed);
            }
          }

          setSocialSpecificFeeds(JSON.parse(JSON.stringify(newSocialSpecificFeeds)));
          setLoadingMoreFeedItems(false);
        })
        .catch(function (error) {
          console.log(error);
          setLoadingMoreFeedItems(false);
        });
      }    
  }, [lastItemFeedShown, lastFeedItemRef, socialSelected])

  useEffect(() => {
    props.setUseDarkTheme(false);
  }, [])

  const socialFilter = (feed) => {
    if (socialSelected == "all") {
        return true;
    }

    return feed.feedId.includes(socialSelected);
  }

  const projectFeed = props.projectFeed ? (socialSelected == "all" || socialSelected == "about") ? (props.projectFeed.concat(additionalFeed)).filter(socialFilter) : (props.projectFeed.concat(additionalFeed).concat(socialSpecificFeeds[socialSelected]["feed"])).filter(socialFilter) : [];

  return (
    <>
        <ProjectInsightNavigation projectSearchClick={() => setShowProjectSearchModal(true)} />
        <Modal aria-labelledby="ProjectSearchModal" centered size="lg" dialogClassName="projectSearchModal" show={showProjectSearchModal} onHide={() => setShowProjectSearchModal(false)}>
            <Modal.Header closeButton closeVariant={props.useDarkTheme ? "white" : "black"} className={clsx(styles.searchModal, props.useDarkTheme ? styles.modalDark : styles.modalLight)}>
                <Modal.Title>
                    <Typography variant="p" component="div" className={props.useDarkTheme ? styles.darkText : styles.lightText}>
                        Project Search
                    </Typography>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={clsx(props.useDarkTheme ? styles.modalDark : styles.modalLight)}>
                <Grid container justifyContent="center" alignItems="top" spacing={4} className={styles.projectSearchGrid}>
                    <ProjectSearch useDarkTheme={props.useDarkTheme} projects={props.projects} tags={props.tags} chains={props.chains} tagCount={props.tagCount} chainCount={props.chainCount} />
                </Grid>
            </Modal.Body>
        </Modal>    
        <div className={props.useDarkTheme ? styles.darkThemeBackground : styles.lightThemeBackground}>
            <Grid container justifyContent="center" alignItems="center" spacing={4} className={styles.educationCenterIntroGrid}>
                <Grid item xs={12} className={styles.projectImageMobile}>
                    <img src={props.project.logoUrl} width="100" height="100" style={{borderRadius: '50%'}} />
                </Grid>
                <Grid item lg={8} md={8} sm={10} xs={12} className={styles.projectHeaderGrid}>
                    <img src={props.project.logoUrl} className={styles.projectImage} width="100" height="100" style={{borderRadius: '50%', marginTop: '-2.5%', marginRight: '2%'}} />
                    <Typography variant="p" className={clsx(styles.insightsHeaderText, props.useDarkTheme ? styles.headerTextDark : styles.headerTextLight)}>
                        {props.project.name}
                    </Typography>
                </Grid>
                <Grid item xs={12}></Grid>

                {
                    ["about", "all", "twitter", "discord", "youtube", "telegram", "medium"].map((social) => (
                        <Grid item xs={4} sm={3} md={2} lg={1}>
                            <Button variant="text" className={clsx(styles.socialOptionBtn, socialSelected == social ? styles.selectedSocialBtn : "")}
                                onClick={() => setSocialSelected(social)}>
                                {social}
                            </Button>
                        </Grid>
                    ))
                }

                <Grid item xs={12} className="mt-1"></Grid>

                {
                    socialSelected == "about" && (
                        <Grid item xs={12}>
                            <ProjectAbout project={props.project} />
                        </Grid>
                    )
                }

                {
                    socialSelected != "about" && projectFeed.map((feed, index) => (
                        <Grid item xs={12} sm={12} md={10} lg={8} key={feed.feedId}
                            ref={index == projectFeed.length - 1 ? lastFeedItemRef : null}>
                                {
                                    feed.text && (
                                        <div className={styles.feedItem}>
                                            {
                                                feed.social == "twitter" && (
                                                    <TwitterFeedItem feed={feed} project={props.project}  />
                                                )
                                            }
                                            {
                                                feed.social == "medium" && (
                                                    <MediumFeedItem feed={feed} project={props.project} />
                                                )
                                            }
                                            {
                                                feed.social == "telegram" && (
                                                    <TelegramFeedItem feed={feed} project={props.project} />
                                                )
                                            }
                                            {
                                                feed.social == "discord" && feed.text && (
                                                    <DiscordFeedItem feed={feed} project={props.project} />
                                                )
                                            }
                                            {
                                                feed.social == "youtube" && (
                                                    <YouTubeFeedItem feed={feed} project={props.project} />
                                                )
                                            }
                                        </div>
                                    )
                                }
                        </Grid>
                    ))
                }
            </Grid>

            {
                socialSelected != "about" && loadingMoreFeedItems && (
                    <Grid item xs={12} className="mb-5 text-center">
                        <CircularProgress size={80} />
                    </Grid>
                )
            }

            {
                ((socialSelected == "all" && allFeedItemsLoaded) || (socialSelected != "all" && socialSelected != "about" && socialSpecificFeeds[socialSelected]["allFeedLoaded"])) && (
                    <Grid item xs={12} className="mb-5 text-center">
                        <Typography variant="h3">
                            No More Feed to Load
                        </Typography>
                    </Grid>
                )
            }

            <Button variant="text" className={styles.backUpBtn} onClick={() => {window.scrollTo(0, 0)}}>
                <BsArrowUpCircle size={25} />
            </Button>
            <HomeFooter useDarkTheme={props.useDarkTheme} />
        </div>        
    </>
  );
}

export async function getStaticProps(context) {
    const { params } = context;
    const project = await getProjectById(params.projectId);
    const projectFeed = await getProjectFeed(project.collectionName, 0);

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
            project,
            projectFeed,
            projects,
            tags,
            chains,
            tagCount,
            chainCount
        },
        revalidate: 30, // In seconds
    }
}

export async function getStaticPaths() {
    const projects = await getProjects();

    const paths = projects.map((project) => ({
        params: { projectId: project.id },
    }))

    return { paths, fallback: 'blocking' }
}

export default ProjectInsight;
