import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from "react-player";
import clsx from 'clsx';
import { AiFillHome } from "react-icons/ai";

import { Grid, Button, Typography, Collapse } from '@mui/material';
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
import ReactHtmlParser from "react-html-parser";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArticleIcon from '@mui/icons-material/Article';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import EducationCenterIntro from '../components/EducationCenterIntro';
import transform from '../components/HtmlParseTransform';

import styles from '../styles/EducationCenter.module.css';

const drawerWidth = 300;
  
const options = {
    decodeEntities: true,
    transform
};

export default function EducationCenter(props) {
  const { window2 } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videosByCategory, setVideosByCategory] = useState({});
  const [videoLengthByCategory, setVideoLengthByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState({});
  const [viewingIntro, setViewingIntro] = useState(true);
  const [videosWatched, setVideosWatched] = useState({});
 
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sortVideos = (video1, video2) => {
      return video1.videoOrder - video2.videoOrder;
  }

  const sortCategories = (category1, category2, categoryOrders) => {
      return categoryOrders[category1] - categoryOrders[category2];
  }

  async function loadVideos() {
    const videosResponse = await axios.get("/api/videos");
    const videosToLoad = videosResponse.data;
    let currCategories = [];
    let currVideosByCategory = {};
    let categoryOrders = {};
    let currVideoLengthByCategory = {};

    for (let i = 0; i < videosToLoad.length; i++) {
        const currVideoCategory = videosToLoad[i].category;
        if (!currCategories.includes(currVideoCategory)) {
            currCategories.push(currVideoCategory);
            currVideosByCategory[currVideoCategory] = [videosToLoad[i]];
            currVideoLengthByCategory[currVideoCategory] = videosToLoad[i].minutes;
            categoryOrders[currVideoCategory] = videosToLoad[i].categoryOrder;
        }
        else {
            currVideosByCategory[currVideoCategory].push(videosToLoad[i]);
            currVideoLengthByCategory[currVideoCategory] += videosToLoad[i].minutes;
        }
    }

    for (let i = 0; i < currCategories.length; i++) {
        currVideosByCategory[currCategories[i]].sort(sortVideos);
    }

    setCategories(JSON.parse(JSON.stringify(currCategories.sort(function(c1, c2) {return sortCategories(c1, c2, categoryOrders)}))));
    setExpandedCategories([]);
    setVideos(JSON.parse(JSON.stringify(videosToLoad)));
    // setSelectedVideo(videosToLoad[0]);
    setVideosByCategory(JSON.parse(JSON.stringify(currVideosByCategory)));
    setVideoLengthByCategory(JSON.parse(JSON.stringify(currVideoLengthByCategory)));
  }

  useEffect(() => {
    const videosWatchedCached = localStorage.getItem("CardinalHouseEducationCenterVideosWatched");
    if (videosWatchedCached && videosWatchedCached.includes("{") && videosWatchedCached.includes("}")) {
        setVideosWatched(JSON.parse(videosWatchedCached));
    }
    loadVideos();
  }, [])

  const updateCategory = (category) => {
      if (expandedCategories.includes(category)) {
          const filteredExpandedCategories = expandedCategories.filter((currCategory) => currCategory != category);
          setExpandedCategories(filteredExpandedCategories);
      }
      else {
          const newExpandedCategories = JSON.parse(JSON.stringify(expandedCategories));
          newExpandedCategories.push(category);
          setExpandedCategories(newExpandedCategories);
      }
  }

  const updateSelectedVideo = (currVideo) => {
      setSelectedVideo(currVideo);
      setViewingIntro(false);
  }

  const updateViewingIntro = (isViewingIntro) => {
      setViewingIntro(isViewingIntro);
      setSelectedVideo({});
  }

  const videoStarted = () => {
      console.log("Video Started");
  }

  const videoEnded = () => {
      console.log("Video Ended");
      let currVideosWatched = videosWatched;
      currVideosWatched[selectedVideo._id] = true;
      setVideosWatched(JSON.parse(JSON.stringify(currVideosWatched)));
      localStorage.setItem("CardinalHouseEducationCenterVideosWatched", JSON.stringify(currVideosWatched));
  }

  const resetVideosWatched = () => {
      setVideosWatched({});
      localStorage.setItem("CardinalHouseEducationCenterVideosWatched", "{}");
  }

  const calcVideosViewedInCategory = (currCategory) => {
    const videosInCategory = videosByCategory[currCategory];
    let currVideosWatchedCount = 0;

    for (let i = 0; i < videosInCategory.length; i++) {
        if (videosWatched[videosInCategory[i]._id]) {
            currVideosWatchedCount += 1;
        }
    }

    return currVideosWatchedCount.toString();
  }

  const drawer = (
    <div>
      {/*
      <div className={styles.toolbarDiv}>
          <img alt="" src="/CardinalLogoLight.png" width="50" height="50" className={styles.logoImage} />
          <Typography variant="h5" className={styles.toolbarText}>
              Cardinal House
          </Typography>
      </div>
      */}

      <Grid container justifyContent="center" alignItems="center" spacing={2} className={styles.toolbarDiv}>
          <Grid item xs={2}>
            <img alt="" src="/CardinalLogoLight.png" width="50" height="50" className={styles.logoImage} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" className={styles.toolbarText}>
                Cardinal House
            </Typography>
          </Grid>
      </Grid>

      <Divider />
      <List>
        <ListItem key="Introduction" disablePadding>
            <ListItemButton className={clsx("introBtn", viewingIntro ? styles.currSelected : "")} onClick={() => updateViewingIntro(true)}>
                <ListItemText primary="Introduction" className={styles.introBtnText} />
            </ListItemButton>
        </ListItem>
        {
            categories.length == 0 && (
                <ListItem className="loadingText" key="Loading">
                    <ListItemText primary="Loading..." />
                </ListItem>
            )
        }
        {
            categories.length > 0 && (
                <ListItem key="Back to Homepage" button onClick={() => {window.location.href = `${window.location.origin}`}}>
                    <ListItemIcon>
                        <AiFillHome className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Back to Home Page" />
                </ListItem>
            )
        }
        {
            categories.length > 0 && (
                <ListItem key="Reset Progress" button onClick={resetVideosWatched} className={styles.resetProgressBtnSmallTemp}>
                    <ListItemIcon>
                        <RestartAltIcon className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Reset Progress" />
                </ListItem>
            )
        }
        {
            categories.length > 0 && (
                categories.map((category) => (
                    <div key={category}>
                    <ListItem disablePadding>
                        <ListItemButton className="categoryBtn" onClick={() => updateCategory(category)}>
                            <ListItemText primary={category} secondary={`${calcVideosViewedInCategory(category)} / ${videosByCategory[category].length} | ${videoLengthByCategory[category]} min`} />
                            {expandedCategories.includes(category) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={expandedCategories.includes(category)} timeout="auto" unmountOnExit>
                        {
                            videosByCategory[category].map((currVideo) => (
                                <ListItem key={currVideo._id} className={selectedVideo._id == currVideo._id ? styles.currSelected : ""} disablePadding>
                                    <ListItemButton className="videoBtn" onClick={() => updateSelectedVideo(currVideo)}>
                                    {videosWatched && videosWatched[currVideo._id] ? <CheckBoxIcon className={styles.checkBoxIcon} /> : <CheckBoxOutlineBlankIcon className={styles.checkBoxIcon} />}
                                        <ListItemText 
                                            primary={
                                                currVideo.title
                                            }
                                            secondary={
                                                <>
                                                    <PlayCircleIcon className={styles.playCircleIcon} />
                                                    {currVideo.minutes} min
                                                </>
                                            } 
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </Collapse>
                    </div>
                ))
            )
        }
      </List>
    </div>
  );

  const container = window2 !== undefined ? () => window2().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }} className="educationCenterBox">
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className={styles.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
            Education Center {selectedVideo.title ? "-" : ""} {selectedVideo.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        className={styles.drawerContainer}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          className={styles.drawerContainer}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
          className={styles.drawerContainer}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: { xs: `calc(100% - ${drawerWidth}px)` } }}
        className={styles.mainContent}
      >
        <Toolbar />

          {/*
        <Grid container justifyContent="center" spacing={4} className={styles.titleGrid}>
            <Grid item xs={12}>
                <Typography variant="h4" className={styles.title}>
                    {selectedVideo.title}
                </Typography>
            </Grid>
        </Grid>
        */}

        {
            viewingIntro && (
                <EducationCenterIntro />
            )
        }

        {
            !viewingIntro && (
                <>
                    <div className={styles.reactPlayerContainer}>
                        <ReactPlayer url={selectedVideo.link} controls={true} width="100%" height="100%" className={styles.reactPlayer}
                            onEnded={videoEnded} onStart={videoStarted} />
                    </div>
                    <Grid container justifyContent="center" spacing={4} className={styles.descriptionGrid}>
                        <Grid item xs={12}>
                            <Typography variant="h5" className={styles.descriptionHeader}>
                                {selectedVideo.title}
                            </Typography>
                            <br/>

                            <div>
                            { ReactHtmlParser(
                                selectedVideo.description.replaceAll("&lt;", "<").replaceAll("&gt;", ">"), 
                                options
                            ) }
                            </div>

                            {/*
                            <Typography variant="p" className={styles.description}>
                                {selectedVideo.description}
                            </Typography>
                            */}
                        </Grid>
                    </Grid>
                </>
            )
        }
      </Box>
    </Box>
  );
}
