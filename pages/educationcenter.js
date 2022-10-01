import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import ReactPlayer from "react-player";
import clsx from 'clsx';
import { AiFillHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";

import { Grid, Button, Typography, Collapse, TextField, CircularProgress, Snackbar, Fab } from '@mui/material';
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
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArticleIcon from '@mui/icons-material/Article';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import Navigation from '../components/Navigation';
import EducationCenterIntro from '../components/EducationCenterIntro';
import transform from '../components/HtmlParseTransform';
import Footer from '../components/Footer';

import styles from '../styles/EducationCenter.module.css';
import EducationCenterHistoryIntro from '../components/EducationCenterHistoryIntro';
import EducationCenterInvestIntro from '../components/EducationCenterInvestIntro';
import EducationCenterProjectEducationIntro from '../components/EducationCenterProjectEducationIntro';

const drawerWidth = 350;
  
const options = {
    decodeEntities: true,
    transform
};

export default function EducationCenter(props) {
  const { window2 } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videosByCategory, setVideosByCategory] = useState({});
  const [categoryToSection, setCategoryToSection] = useState({});
  const [videoLengthByCategory, setVideoLengthByCategory] = useState({});
  const [videoLengthBySubCategory, setVideoLengthBySubCategory] = useState({});
  const [numVideosByCategory, SetNumVideosByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const [selectedVideo, setSelectedVideo] = useState({});
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [showNextVideoPending, setShowNextVideoPending] = useState(false);
  const [pendingVideoProgress, setPendingVideoProgress] = useState(0);
  const [viewingIntro, setViewingIntro] = useState(true);
  const [viewingSectionIntro, setViewingSectionIntro] = useState(false);
  const [section, setSection] = useState("");
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
    const hashVideoId = window.location.hash.split("%20|%20")[1];
    if (hashVideoId) {
        window.location.hash = window.location.hash.split("%20|%20")[0] + ` | ${hashVideoId}`;
    }
    const videosResponse = await axios.get("/api/videos");
    const videosToLoad = videosResponse.data;
    let currCategories = [];
    let currCategoryToSection = {};
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

        if (videosToLoad[i]._id == hashVideoId) {
            setSelectedVideo(videosToLoad[i]);
            updateCategory(currVideoCategory);

            if (currVideoSubCategory != "") {
                updateSubCategory(currVideoCategory, currVideoSubCategory);
            }

            setTimeout(function () {
                window.scrollTo(0, 0);
            },200);
            setViewingIntro(false);
            setViewingSectionIntro(false);
        }

        if (!currNumVideosByCategory[currVideoCategory]) {
            currNumVideosByCategory[currVideoCategory] = 1;
        }
        else {
            currNumVideosByCategory[currVideoCategory] += 1;
        }

        if (!currCategories.includes(currVideoCategory)) {
            currCategories.push(currVideoCategory);
            currCategoryToSection[currVideoCategory] = videosToLoad[i].section;
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
        for (let j = 0; j < currSubCategories[currCategories[i]].length; j++) {
            currVideosByCategory[currCategories[i]][currSubCategories[currCategories[i]][j]].sort(sortVideos);
        }
    }

    for (let i = 0; i < currCategories.length; i++) {
        currSubCategories[currCategories[i]].sort(function(sc1, sc2) {return sortCategories(sc1, sc2, subCategoryOrders[currCategories[i]])});
    }

    setCategories(JSON.parse(JSON.stringify(currCategories.sort(function(c1, c2) {return sortCategories(c1, c2, categoryOrders)}))));
    setCategoryToSection(JSON.parse(JSON.stringify(currCategoryToSection)));
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

    const hash = window.location.hash;
    if (hash.split("%20|%20")[0].includes("History")) {
        sectionSelected("History and Use Case of Crypto", false);
    }
    else if (hash.split("%20|%20")[0].includes("Buy")) {
        sectionSelected("How to Buy Crypto", false);
    }
    else if (hash.split("%20|%20")[0].includes("Project")) {
        sectionSelected("Project Education", false);
    }

    loadVideos();
  }, [])

  const hideCategory = (category, expandedCategoriesList) => {
    const filteredExpandedCategories = expandedCategoriesList.filter((currCategory) => currCategory != category);
    return filteredExpandedCategories;
  }

  const showCategory = (category, expandedCategoriesList) => {
    if (expandedCategoriesList.includes(category)) {
        return expandedCategoriesList;
    }

    let newExpandedCategories = JSON.parse(JSON.stringify(expandedCategoriesList));

    if (!newExpandedCategories) {
        newExpandedCategories = [];
    }

    newExpandedCategories.push(category);
    return newExpandedCategories;
  }

  const updateCategory = (category) => {
      if (expandedCategories.includes(category)) {
          const filteredExpandedCategories = hideCategory(category, expandedCategories);
          setExpandedCategories(filteredExpandedCategories);
      }
      else {
          const newExpandedCategories = showCategory(category, expandedCategories);
          setExpandedCategories(newExpandedCategories);
      }
  }

  const hideSubCategory = (category, subCategory, expandedSubCategoriesList) => {
    if (!expandedSubCategoriesList[category]) {
        expandedSubCategoriesList[category] = [];
        return expandedSubCategoriesList;
    }
    const filteredExpandedSubCategories = expandedSubCategoriesList[category].filter((currSubCategory) => currSubCategory != subCategory);
    return filteredExpandedSubCategories;
  }

  const showSubCategory = (category, subCategory, expandedSubCategoriesList) => {
    if (!expandedSubCategoriesList[category]) {
        const newExpandedSubCategories = JSON.parse(JSON.stringify(expandedSubCategoriesList));
        newExpandedSubCategories[category] = [subCategory];
        return newExpandedSubCategories;
    }
    else {
        if (expandedSubCategoriesList[category] && expandedSubCategoriesList[category].includes(subCategory)) {
            return expandedSubCategoriesList;
        }

        const newExpandedSubCategories = JSON.parse(JSON.stringify(expandedSubCategoriesList));
        if (newExpandedSubCategories[category]) {
            newExpandedSubCategories[category].push(subCategory);
        }
        else {
            newExpandedSubCategories[category] = [subCategory];
        }
        return newExpandedSubCategories;
    }
  }

  const updateSubCategory = (category, subCategory) => {
    if (expandedSubCategories[category] && expandedSubCategories[category].includes(subCategory)) {
        const filteredExpandedSubCategories = hideSubCategory(category, subCategory, expandedSubCategories);
        setExpandedSubCategories(filteredExpandedSubCategories);
    }
    else {
        const newExpandedSubCategories = showSubCategory(category, subCategory, expandedSubCategories);
        setExpandedSubCategories(newExpandedSubCategories);
    }
  }

  const updateSelectedVideo = (currVideo) => {
      setSelectedVideo(currVideo);
      window.location.hash = window.location.hash.split("%20|%20")[0] + ` | ${currVideo._id}`;
      setTimeout(function () {
        window.scrollTo(0, 0);
      },200);
      setViewingIntro(false);
      setViewingSectionIntro(false);
      setShowNextVideoPending(false);

      const currCategory = currVideo.category;
      const currSubCategory = currVideo.subCategory ? currVideo.subCategory : "No Category";

      if (categories.filter(categorySectionFilter)[0] == currCategory && (subCategories[currCategory][0] == currSubCategory || currSubCategory == "No Category") && videosByCategory[currCategory][currSubCategory][0]._id == currVideo._id) {
        setPrevBtnDisabled(true);
      }
      else {
        setPrevBtnDisabled(false);
      }

      if (categories.filter(categorySectionFilter).at(-1) == currCategory && (subCategories[currCategory].at(-1) == currSubCategory || !subCategories[currCategory].at(-1)) && videosByCategory[currCategory][currSubCategory].at(-1)._id == currVideo._id) {
        setNextBtnDisabled(true);
      }
      else {
        setNextBtnDisabled(false);
      }
  }

  const updateViewingSectionIntro = (isViewingSectionIntro) => {
      setViewingSectionIntro(isViewingSectionIntro);
      setSelectedVideo({});
  }

  const sectionSelected = (sectionChosen, updateHash = true) => {
    setSection(sectionChosen);
    setViewingIntro(false);
    setViewingSectionIntro(true);

    if (updateHash) {
        window.location.hash = sectionChosen;
    }
    
    setTimeout(function () {
        window.scrollTo(0, 0);
    },200);
  }

  const categorySectionFilter = (currCategory) => {
    const categorySection = categoryToSection[currCategory];
    if (categorySection != section) {
        return false;
    }

    return true;
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

    if (videosWatchedCount >= videos.length) {
        setShowContentCompleteModal(true);
        return true;
    }

    return false;
  }

  const pendingNextVideo = () => {
    if (pendingVideoProgress == 100) {
        nextOrPreviousVideo(1, 0);
        return;
    }
    else {
        setTimeout(() => setPendingVideoProgress((p) => p + 1), 40);
    }
  }

  useEffect(() => {
    if (showNextVideoPending) {
        pendingNextVideo();
    }
  }, [pendingVideoProgress])

  const cancelPending = () => {
    setShowNextVideoPending(false);

    const highestId = window.setTimeout(() => {
        for (let i = highestId; i >= 0; i--) {
          window.clearInterval(i);
        }
      }, 0);
  }

  const videoEnded = () => {
      let currVideosWatched = videosWatched;
      currVideosWatched[selectedVideo._id] = true;
      setVideosWatched(JSON.parse(JSON.stringify(currVideosWatched)));
      localStorage.setItem("CardinalHouseEducationCenterVideosWatched", JSON.stringify(currVideosWatched));

      const allComplete = checkAllContentComplete(currVideosWatched);

      if (!nextBtnDisabled && !allComplete) {
        setPendingVideoProgress(0);
        setShowNextVideoPending(true);
        pendingNextVideo(0);
      }
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

  const backToSectionSelection = () => {
    window.location.hash = "";
    setViewingIntro(true);
  }

  const nextOrPreviousVideo = (delta, videoIndex) => {
    const selectedCategory = selectedVideo.category;
    const selectedSubCategory = selectedVideo.subCategory ? selectedVideo.subCategory : "No Category";
    const currCategories = categories.filter(categorySectionFilter);
    const selectedSubCategoryVideos = videosByCategory[selectedCategory][selectedSubCategory];
    const selectedCategorySubCategories = Object.keys(videosByCategory[selectedCategory]);

    // Is there another video in the subcategory?
    for (let i = 0; i < selectedSubCategoryVideos.length; i++) {
        // If the video isn't the last in the subcategory, go to the next one.
        if (selectedSubCategoryVideos[i]._id == selectedVideo._id && ((delta > 0 && i < selectedSubCategoryVideos.length - 1) || (delta < 1 && i > 0))) {
            updateSelectedVideo(selectedSubCategoryVideos[i + delta]);
            return;
        }
    }

    // If not, is there another subcategory to view the first video of?
    for (let i = 0; i < selectedCategorySubCategories.length; i++) {
        if (selectedCategorySubCategories[i] == selectedSubCategory) {
            for (let j = i + delta; (delta > 0 && j < selectedCategorySubCategories.length) || (delta < 0 && j >= 0); j += delta) {
                if (videosByCategory[selectedCategory][selectedCategorySubCategories[j]].length > 0) {
                    let newExpandedSubCategories = hideSubCategory(selectedCategory, selectedSubCategory, expandedSubCategories);
                    newExpandedSubCategories = showSubCategory(selectedCategory, selectedCategorySubCategories[j], newExpandedSubCategories);
                    setExpandedSubCategories(newExpandedSubCategories);
                    updateSelectedVideo(videosByCategory[selectedCategory][selectedCategorySubCategories[j]].at(videoIndex));
                    return;
                }
            }
        }
    }

    // Otherwise, go the first video in the next category.
    for (let i = 0; i < currCategories.length; i++) {
        if (currCategories[i] == selectedCategory) {
            for (let j = i + delta; (delta > 0 && j < currCategories.length) || (delta < 0 && j >= 0); j += delta) {
                const currSubCategories = Object.keys(videosByCategory[currCategories[j]]);
                for (let k = delta > 0 ? 0 : currSubCategories.length - 1; (delta > 0 && k < currSubCategories.length) || (delta < 0 && k >= 0); k += delta) {
                    if (videosByCategory[currCategories[j]][currSubCategories[k]].length > 0) {
                        let newExpandedCategories = hideCategory(selectedCategory, expandedCategories);
                        newExpandedCategories = showCategory(currCategories[j], newExpandedCategories);
                        setExpandedCategories(newExpandedCategories);
                        let newExpandedSubCategories = hideSubCategory(selectedCategory, selectedSubCategory, expandedSubCategories);
                        newExpandedSubCategories = showSubCategory(currCategories[j], currSubCategories[k], newExpandedSubCategories);
                        setExpandedSubCategories(newExpandedSubCategories);
                        updateSelectedVideo(videosByCategory[currCategories[j]][currSubCategories[k]].at(videoIndex));
                        return;
                    }
                }
            }
        }
    }

    // If this point is reached then next was selected on the last video in the playlist.
    return;
  }

  const drawer = (
    <div className={styles.navDrawer}>
      <Grid container justifyContent="center" alignItems="center" spacing={2} className={styles.toolbarDiv}>
          <Grid item xs={2}>
            <Image alt="" src="/CardinalHouseLogoOutline.png" width="50" height="50" className={clsx(styles.logoImage, "mt-1")} />
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
            <ListItemButton className={clsx("introBtn", viewingIntro ? styles.currSelected : "")} onClick={() => updateViewingSectionIntro(true)}>
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
                <ListItem key="Back to Section Selection" button onClick={backToSectionSelection}>
                    <ListItemIcon>
                        <BiCategory className={styles.navIcons} />
                    </ListItemIcon>
                    <ListItemText primary="Back to Section Selection" />
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
                categories.filter(categorySectionFilter).map((category) => (
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
                                    <ListItem key={currVideo._id} className={clsx(styles.videoBtn, selectedVideo._id == currVideo._id ? styles.currSelected : "")} disablePadding>
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
                                    <ListItemButton className="subCategoryBtn" onClick={() => updateSubCategory(category, subCategory)}>
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
                                            <ListItem key={currVideo._id} className={clsx(styles.videoBtn, selectedVideo._id == currVideo._id ? styles.currSelected : "")} disablePadding>
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
    {
        viewingIntro && (
            <>
                <Navigation useDarkTheme={props.useDarkTheme} setUseDarkTheme={props.setUseDarkTheme} hideThemeToggle={false} />
                <EducationCenterIntro useDarkTheme={props.useDarkTheme} sectionSelected={sectionSelected} />
            </>
        )
    }

    {
        !viewingIntro && (
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

                {viewingSectionIntro && (
                    section == "History and Use Case of Crypto" ? <EducationCenterHistoryIntro /> : section == "How to Buy Crypto" ? <EducationCenterInvestIntro /> : <EducationCenterProjectEducationIntro />
                )}
                
                {!viewingSectionIntro && (
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
                            {
                                showNextVideoPending && (
                                    <div className={clsx("mt-5", styles.circularProgress)}>
                                        <Box sx={{ m: 1, position: 'relative' }}>
                                            <Fab
                                            aria-label="play"
                                            color="primary"
                                            onClick={() => nextOrPreviousVideo(1, 0)}
                                            >
                                            <KeyboardDoubleArrowRightIcon />
                                            </Fab>
                                            <CircularProgress
                                                size={68}
                                                variant="determinate"
                                                value={pendingVideoProgress}
                                                sx={{
                                                color: "primary",
                                                position: 'absolute',
                                                top: -6,
                                                left: -6,
                                                zIndex: 1,
                                                }}
                                            />
                                        </Box>
                                    </div>
                                )
                            }

                            {
                                showNextVideoPending && (
                                    <Grid item xs={12} className={clsx("text-center", styles.circularProgress)}>
                                        <Button variant="contained" color="primary" size="large" className="mb-5" onClick={cancelPending}>
                                            &nbsp;&nbsp;Cancel&nbsp;&nbsp;
                                        </Button>
                                    </Grid>
                                )
                            }

                            {selectedVideo.type == "video" && (
                                <>
                                    <Grid item xs={12} className="text-center">
                                        <Button variant="contained" color="primary" className={styles.prevBtn} disabled={prevBtnDisabled}
                                            onClick={() => nextOrPreviousVideo(-1, -1)}>
                                            <KeyboardDoubleArrowLeftIcon /> &nbsp; Previous &nbsp;
                                        </Button>
                                        <Button variant="contained" color="primary" className={styles.nextBtn} disabled={nextBtnDisabled}
                                            onClick={() => nextOrPreviousVideo(1, 0)}>
                                            &nbsp;&nbsp;&nbsp;&nbsp; Next &nbsp; <KeyboardDoubleArrowRightIcon /> &nbsp;&nbsp;&nbsp;
                                        </Button>
                                    </Grid>
                                </>
                            )}

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
                                {                           
                                    selectedVideo.type != "video" && (
                                    <>
                                        <Grid item xs={12} className="text-center mt-5">
                                            <Button variant="contained" color="primary" className={styles.prevBtn} disabled={prevBtnDisabled}
                                                onClick={() => nextOrPreviousVideo(-1, -1)}>
                                                <KeyboardDoubleArrowLeftIcon /> &nbsp; Previous &nbsp;
                                            </Button>
                                            <Button variant="contained" color="primary" className={styles.nextBtn} disabled={nextBtnDisabled}
                                                onClick={() => nextOrPreviousVideo(1, 0)}>
                                                &nbsp;&nbsp;&nbsp;&nbsp; Next &nbsp; <KeyboardDoubleArrowRightIcon /> &nbsp;&nbsp;&nbsp;
                                            </Button>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>  
                    </>
                )}
            </Box>
        </Box>
        )
    }
    <Footer useDarkTheme={viewingIntro ? props.useDarkTheme : true} />
    </>
  );
}
