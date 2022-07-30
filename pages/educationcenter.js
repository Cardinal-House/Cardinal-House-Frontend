import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from "react-player";
import clsx from 'clsx';
import { AiFillHome } from "react-icons/ai";

import { Grid, Button, Typography, Collapse, TextField, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Modal } from "react-bootstrap";
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
import Footer from '../components/Footer';

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
  const [videoLengthBySubCategory, setVideoLengthBySubCategory] = useState({});
  const [numVideosByCategory, SetNumVideosByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const [selectedVideo, setSelectedVideo] = useState({});
  const [viewingIntro, setViewingIntro] = useState(true);
  const [videosWatched, setVideosWatched] = useState({});
  const [showContentCompleteModal, setShowContentCompleteModal] = useState(false);
  const [discordUserName, setDiscordUserName] = useState("");
  const [submittingDiscordUserName, setSubmittingDiscordUserName] = useState(false);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [showSubmissionFailure, setShowSubmissionFailure] = useState(false);
  const [submissionFailureMessage, setSubmissionFailureMessage] = useState("");
 
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
    let currSubCategories = {};
    let currVideosByCategory = {};
    let categoryOrders = {};
    let subCategoryOrders = {};
    let currVideoLengthByCategory = {};
    let currVideoLengthBySubCategory = {};
    let currNumVideosByCategory = {};

    for (let i = 0; i < videosToLoad.length; i++) {
        const currVideoCategory = videosToLoad[i].category;
        const currVideoSubCategory = videosToLoad[i].subCategory;

        if (!currNumVideosByCategory[currVideoCategory]) {
            currNumVideosByCategory[currVideoCategory] = 1;
        }
        else {
            currNumVideosByCategory[currVideoCategory] += 1;
        }

        if (!currCategories.includes(currVideoCategory)) {
            currCategories.push(currVideoCategory);
            categoryOrders[currVideoCategory] = videosToLoad[i].categoryOrder;
            currVideoLengthByCategory[currVideoCategory] = videosToLoad[i].minutes;
            currVideoLengthBySubCategory[currVideoCategory] = {};
            subCategoryOrders[currVideoCategory] = {};
            currVideosByCategory[currVideoCategory] = {};
            if (currVideoSubCategory == "" || !currVideoSubCategory) {
                currVideosByCategory[currVideoCategory]["No Category"] = [videosToLoad[i]];
                currSubCategories[currVideoCategory] = [];
            }
            else {
                currSubCategories[currVideoCategory] = [currVideoSubCategory];
                currVideosByCategory[currVideoCategory][currVideoSubCategory] = [videosToLoad[i]];
                currVideoLengthBySubCategory[currVideoCategory][currVideoSubCategory] = videosToLoad[i].minutes;
                subCategoryOrders[currVideoCategory][currVideoSubCategory] = videosToLoad[i].subCategoryOrder;
            }
        }
        else {
            currVideoLengthByCategory[currVideoCategory] += videosToLoad[i].minutes;
            if (currVideoSubCategory == "" || !currVideoSubCategory) {
                currVideosByCategory[currVideoCategory]["No Category"].push(videosToLoad[i]);
            }
            else {
                if (currSubCategories[currVideoCategory].includes(currVideoSubCategory)) {
                    currVideosByCategory[currVideoCategory][currVideoSubCategory].push(videosToLoad[i]);
                    currVideoLengthBySubCategory[currVideoCategory][currVideoSubCategory] += videosToLoad[i].minutes;
                }
                else {
                    currSubCategories[currVideoCategory].push(currVideoSubCategory);
                    currVideosByCategory[currVideoCategory][currVideoSubCategory] = [videosToLoad[i]];
                    subCategoryOrders[currVideoCategory][currVideoSubCategory] = videosToLoad[i].subCategoryOrder;
                    currVideoLengthBySubCategory[currVideoCategory][currVideoSubCategory] = videosToLoad[i].minutes;
                }
            }
        }
    }

    for (let i = 0; i < currCategories.length; i++) {
        for (let j = 0; j < currVideosByCategory[currCategories[i]]; j++) {
            currVideosByCategory[currCategories[i]][currSubCategories[j]].sort(sortVideos);
        }
    }

    for (let i = 0; i < currCategories.length; i++) {
        currSubCategories[currCategories[i]].sort(function(sc1, sc2) {return sortCategories(sc1, sc2, subCategoryOrders[currCategories[i]])});
    }

    setCategories(JSON.parse(JSON.stringify(currCategories.sort(function(c1, c2) {return sortCategories(c1, c2, categoryOrders)}))));
    setSubCategories(JSON.parse(JSON.stringify(currSubCategories)));
    setVideos(JSON.parse(JSON.stringify(videosToLoad)));
    setVideosByCategory(JSON.parse(JSON.stringify(currVideosByCategory)));
    setVideoLengthByCategory(JSON.parse(JSON.stringify(currVideoLengthByCategory)));
    setVideoLengthBySubCategory(JSON.parse(JSON.stringify(currVideoLengthBySubCategory)));
    SetNumVideosByCategory(JSON.parse(JSON.stringify(currNumVideosByCategory)));
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

  const updateSubCategory = (category, subCategory) => {
    if (!expandedSubCategories[category]) {
        const newExpandedSubCategories = JSON.parse(JSON.stringify(expandedSubCategories));
        newExpandedSubCategories[category] = [subCategory];
        setExpandedSubCategories(newExpandedSubCategories);
    }
    else if (expandedSubCategories[category].includes(subCategory)) {
        const filteredExpandedSubCategories = expandedSubCategories[category].filter((currSubCategory) => currSubCategory != subCategory);
        setExpandedSubCategories(filteredExpandedSubCategories);
    }
    else {
        const newExpandedSubCategories = JSON.parse(JSON.stringify(expandedSubCategories));
        if (newExpandedSubCategories[category]) {
            newExpandedSubCategories[category].push(subCategory);
        }
        else {
            newExpandedSubCategories[category] = [subCategory];
        }
        setExpandedSubCategories(newExpandedSubCategories);
    }
  }

  const updateSelectedVideo = (currVideo) => {
      setSelectedVideo(currVideo);
      window.scrollTo(0, 0);
      setViewingIntro(false);
  }

  const updateViewingIntro = (isViewingIntro) => {
      setViewingIntro(isViewingIntro);
      setSelectedVideo({});
  }

  const videoStarted = () => {
      console.log("Video Started");
  }

  const checkAllContentComplete = (currVideosWatched) => {
    let videosWatchedCount = 0;
    const videoKeys = Object.keys(currVideosWatched);

    for (let i = 0; i < videoKeys.length; i++) {
        if (currVideosWatched[videoKeys[i]]) {
            videosWatchedCount += 1;
        }
    }

    console.log(videosWatchedCount);
    console.log(videos.length);

    if (videosWatchedCount >= videos.length) {
        setShowContentCompleteModal(true);
    }
  }

  const videoEnded = () => {
      console.log("Video Ended");
      let currVideosWatched = videosWatched;
      currVideosWatched[selectedVideo._id] = true;
      setVideosWatched(JSON.parse(JSON.stringify(currVideosWatched)));
      localStorage.setItem("CardinalHouseEducationCenterVideosWatched", JSON.stringify(currVideosWatched));

      checkAllContentComplete(currVideosWatched);
  }

  const articleMarkedComplete = () => {
    let currVideosWatched = videosWatched;
    currVideosWatched[selectedVideo._id] = true;
    setVideosWatched(JSON.parse(JSON.stringify(currVideosWatched)));
    localStorage.setItem("CardinalHouseEducationCenterVideosWatched", JSON.stringify(currVideosWatched));

    checkAllContentComplete(currVideosWatched);
  }

  const resetVideosWatched = () => {
      setVideosWatched({});
      localStorage.setItem("CardinalHouseEducationCenterVideosWatched", "{}");
  }

  const calcVideosViewedInCategory = (currCategory) => {
    const subCategories = videosByCategory[currCategory];
    const subCategoryKeys = Object.keys(subCategories);
    let currVideosWatchedCount = 0;

    for (let i = 0; i < subCategoryKeys.length; i++) {
        for (let j = 0; j < subCategories[subCategoryKeys[i]].length; j++) {
            if (videosWatched[subCategories[subCategoryKeys[i]][j]._id]) {
                currVideosWatchedCount += 1;
            }
        }
    }

    return currVideosWatchedCount.toString();
  }

  const calcVideosViewedInSubCategory = (currCategory, currSubCategory) => {
    const videosInSubCategory = videosByCategory[currCategory][currSubCategory];
    let currVideosWatchedCount = 0;

    for (let i = 0; i < videosInSubCategory.length; i++) {
        if (videosWatched[videosInSubCategory[i]._id]) {
            currVideosWatchedCount += 1;
        }
    }

    return currVideosWatchedCount.toString();
  }

  const hideContentCompleteModal = () => {
    setShowContentCompleteModal(false);
  }

  const submitDiscordUserName = () => {
      if (discordUserName && discordUserName != "") {
        setSubmittingDiscordUserName(true);
        axios.post("/api/addeducationcentercompletion", {
            discordUserName: discordUserName
        })  
        .then(function (response) {
          setSubmittingDiscordUserName(false);
          const success = response.data.success;

          if (success === 'true') {
              setShowSubmissionSuccess(true);
              setShowContentCompleteModal(false);
          }
          else {
              setSubmissionFailureMessage(`Failed to submit Discord username: ${response.data.reason}`);
              setShowSubmissionFailure(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          setSubmissionErrorMessage(`Failed to submit Discord username: ${error.toString()}`);
          setShowSubmissionFailure(true);
        });
      }
      else {
        setSubmissionFailureMessage("Please input your Discord username.");
        setShowSubmissionFailure(true);
      }
  }

  const drawer = (
    <div className={styles.navDrawer}>
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
                            <ListItemText primary={category} secondary={
                                <Typography variant="p" className={styles.categoryText}>
                                    {`${calcVideosViewedInCategory(category)} / ${numVideosByCategory[category]} | ${videoLengthByCategory[category] ? `${videoLengthByCategory[category]} min` : ""}`}
                                </Typography>
                            } />
                            {expandedCategories.includes(category) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={expandedCategories.includes(category)} timeout="auto" unmountOnExit>
                        {
                            videosByCategory[category]["No Category"] && (
                                videosByCategory[category]["No Category"].map((currVideo) => (
                                    <ListItem key={currVideo._id} className={selectedVideo._id == currVideo._id ? styles.currSelected : ""} disablePadding>
                                        <ListItemButton className="videoBtn" onClick={() => updateSelectedVideo(currVideo)}>
                                        {videosWatched && videosWatched[currVideo._id] ? <CheckBoxIcon className={styles.checkBoxIcon} /> : <CheckBoxOutlineBlankIcon className={styles.checkBoxIcon} />}
                                            <ListItemText 
                                                className={styles.categoryText}
                                                primary={
                                                    currVideo.title
                                                }
                                                secondary={
                                                    currVideo.type == "video" ? (
                                                        <>
                                                            <PlayCircleIcon className={styles.playCircleIcon} />
                                                            <Typography variant="p" className={styles.categoryText}>
                                                                {currVideo.minutes ? `${currVideo.minutes} min` : ""}
                                                            </Typography>
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            <ArticleIcon className={styles.playCircleIcon} />
                                                            <Typography variant="p" className={styles.categoryText}>
                                                                {currVideo.minutes ? `${currVideo.minutes} min` : ""}
                                                            </Typography>
                                                        </>
                                                    )
                                                } 
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            )
                        }
                        {
                            Object.keys(videosByCategory[category]).filter((sc) => sc != "No Category").map((subCategory) => (
                                <div key={category} className={styles.subCategory}>
                                <ListItem disablePadding>
                                    <ListItemButton className="categoryBtn" onClick={() => updateSubCategory(category, subCategory)}>
                                        <ListItemText primary={subCategory} secondary={
                                            <Typography variant="p" className={styles.categoryText}>
                                                {`${calcVideosViewedInSubCategory(category, subCategory)} / ${videosByCategory[category][subCategory].length} | ${videoLengthBySubCategory[category][subCategory]} min`}
                                            </Typography>
                                        } />
                                        {expandedSubCategories[category] && expandedSubCategories[category].includes(subCategory) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={expandedSubCategories[category] && expandedSubCategories[category].includes(subCategory)} timeout="auto" unmountOnExit>
                                    {
                                        videosByCategory[category][subCategory].map((currVideo) => (
                                            <ListItem key={currVideo._id} className={selectedVideo._id == currVideo._id ? styles.currSelected : ""} disablePadding>
                                                <ListItemButton className="videoBtn" onClick={() => updateSelectedVideo(currVideo)}>
                                                {videosWatched && videosWatched[currVideo._id] ? <CheckBoxIcon className={styles.checkBoxIcon} /> : <CheckBoxOutlineBlankIcon className={styles.checkBoxIcon} />}
                                                    <ListItemText
                                                        primary={
                                                            currVideo.title
                                                        }
                                                        secondary={
                                                            currVideo.type == "video" ? (
                                                                <>
                                                                    <PlayCircleIcon className={styles.playCircleIcon} />
                                                                    <Typography variant="p" className={styles.categoryText}>
                                                                        {currVideo.minutes ? `${currVideo.minutes} min` : ""}
                                                                    </Typography>
                                                                </>
                                                            )
                                                            :
                                                            (
                                                                <>
                                                                    <ArticleIcon className={styles.playCircleIcon} />
                                                                    <Typography variant="p" className={styles.categoryText}>
                                                                        {currVideo.minutes ? `${currVideo.minutes} min` : ""}
                                                                    </Typography>
                                                                </>
                                                            )
                                                        } 
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))
                                    }
                                </Collapse>
                                </div>
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
    <>
    <Box sx={{ display: 'flex' }} className="educationCenterBox">
        <Snackbar open={showSubmissionSuccess} autoHideDuration={6000} onClose={() => {setShowSubmissionSuccess(false)}} className={styles.snackBar}>
            <MuiAlert elevation={6} variant="filled" onClose={() => {setShowSubmissionSuccess(false)}} severity="success" sx={{ width: '100%' }} >
                Discord Username Submitted Successfully! We Will Reach out to You Shortly for Your Discount.
            </MuiAlert>
        </Snackbar>
        <Snackbar open={showSubmissionFailure} autoHideDuration={6000} onClose={() => {setShowSubmissionFailure(false)}} className={styles.snackBar}>
            <MuiAlert elevation={6} variant="filled" onClose={() => {setShowSubmissionFailure(false)}} severity="error" sx={{ width: '100%' }} >
                {submissionFailureMessage}
            </MuiAlert>
        </Snackbar>

        <Modal centered show={showContentCompleteModal} onHide={() => hideContentCompleteModal(false)} className={styles.discordUserNameModal}>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>
                    <Typography variant="h4" component="div" className={styles.modalHeaderText}>
                        Congratulations!
                    </Typography>
                    <Typography variant="h6" component="div" className={styles.modalHeaderText2}>
                        You have finished all of the content in the Cardinal House Education Center
                    </Typography>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <Typography variant="h6" component="div" className={styles.modalSecondaryHeader}>
                    Input your Discord username for a one time Cardinal House membership discount!
                </Typography>
                <TextField label="Discord Username (e.g. carlthecardinal#1234)" className={styles.textField}
                    value={discordUserName} onChange={(e) => setDiscordUserName(e.target.value)} />
                <br/>
                <Button size="medium" variant="contained" color="primary" onClick={() => submitDiscordUserName()}
                    disabled={submittingDiscordUserName}>
                    {submittingDiscordUserName && <CircularProgress size={18} color="secondary" className={styles.circularProgress}/>} 
                    {submittingDiscordUserName ? <>&nbsp; Submitting</> : "Submit"}
                </Button>
            </Modal.Body>
        </Modal>

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

        {
            viewingIntro && (
                <EducationCenterIntro />
            )
        }

        {
            !viewingIntro && (
                <>
                    {
                        selectedVideo.type == "video" && (
                            <div className={styles.reactPlayerContainer}>
                                <ReactPlayer url={selectedVideo.link} controls={true} width="100%" height="100%" className={styles.reactPlayer}
                                    onEnded={videoEnded} onStart={videoStarted} />
                            </div>
                        )
                    }
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
                            {
                                selectedVideo.type != "video" && (
                                    <Button variant="contained" className={styles.markCompleteBtn}
                                        onClick={articleMarkedComplete}>
                                        {videosWatched && videosWatched[selectedVideo._id] ? "Article Finished!" : "Mark Article as Read"}
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>
                </>
            )
        }
      </Box>
    </Box>
    <Footer useDarkTheme={true} />
    </>
  );
}
