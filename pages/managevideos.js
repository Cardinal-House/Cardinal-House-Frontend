import { 
    Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, Paper, Button, IconButton, TextField, CircularProgress,
    Snackbar, Autocomplete, Select, MenuItem, FormControl, InputLabel, InputBase
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Modal } from "react-bootstrap";
import clsx from 'clsx';
import ReactHtmlParser from "react-html-parser";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';

import styles from '../styles/managevideos.module.css';

import Navigation from '../components/Navigation';
import transform from '../components/HtmlParseTransform';

import dynamic from "next/dynamic";
import { SearchOffSharp } from '@mui/icons-material';

const ReactRTE = dynamic(() => import("../components/Editor"), {
	ssr: false,
});

const options = {
    decodeEntities: true,
    transform
};

export default function managevideos(props) {
    const [videos, setVideos] = useState([]);
    const [currVideo, setCurrVideo] = useState({
        id: "",
        title: "",
        type: "",
        link: "",
        description: "",
        category: "",
        minutes: "",
        categoryOrder: "",
        videoOrder: ""
    });
    const [categories, setCategories] = useState([]);
    const [videosByCategory, setVideosByCategory] = useState({});
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showVideoDeleteModal, setShowVideoDeleteModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [creatingOrEditingVideo, setCreatingOrEditingVideo] = useState(false);
    const [deletingVideo, setDeletingVideo] = useState(false);
    const [inputError, setInputError] = useState("");
    const [editingVideo, setEditingVideo] = useState(false);
    const [code, setCode] = useState("");
    const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
    const [showSubmissionFailure, setShowSubmissionFailure] = useState(false);
    const [showSubmissionInProgress, setShowSubmissionInProgress] = useState(false);
    const [submissionSuccessMessage, setSubmissionSuccessMessage] = useState("");
    const [submissionPendingMessage, setSubmissionPendingMessage] = useState("");
    const [submissionErrorMessage, setSubmissionErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [expandedDescriptions, setExpandedDescriptions] = useState([]);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    }
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    }

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

        for (let i = 0; i < videosToLoad.length; i++) {
            const currVideoCategory = videosToLoad[i].category;
            if (!currCategories.includes(currVideoCategory)) {
                currCategories.push(currVideoCategory);
                currVideosByCategory[currVideoCategory] = [videosToLoad[i]];
                categoryOrders[currVideoCategory] = videosToLoad[i].categoryOrder;
            }
            else {
                currVideosByCategory[currVideoCategory].push(videosToLoad[i]);
            }
        }

        for (let i = 0; i < currCategories.length; i++) {
            currVideosByCategory[currCategories[i]].sort(sortVideos);
        }

        setCategories(JSON.parse(JSON.stringify(currCategories.sort(function(c1, c2) {return sortCategories(c1, c2, categoryOrders)}))));
        setVideos(JSON.parse(JSON.stringify(videosToLoad)));
        setVideosByCategory(JSON.parse(JSON.stringify(currVideosByCategory)));
    }
    
    useEffect(() => {
        loadVideos();
    }, [])

    const hideVideoModal = () => {
        setEditingVideo(false);
        setShowVideoModal(false);
        setCurrVideo({
            id: "",
            title: "",
            type: "",
            link: "",
            description: "",
            category: "",
            minutes: "",
            categoryOrder: "",
            videoOrder: ""
        });
    }

    const hideVideoDeleteModal = () => {
        setShowVideoDeleteModal(false);
        setCurrVideo({
            id: "",
            title: "",
            type: "",
            link: "",
            description: "",
            category: "",
            minutes: "",
            categoryOrder: "",
            videoOrder: ""
        });
    }

    const openEditModal = (videoToEdit) => {
        setEditingVideo(true);
        setShowVideoModal(true);
        setCurrVideo(videoToEdit);
    }

    const openDeleteModal = (videoToDelete) => {
        setShowVideoDeleteModal(true);
        setCurrVideo(videoToDelete);
    }

    const searchFilter = (video) => {
        if (search == "") {
            return true;
        }

        const videoKeys = Object.keys(video);
        for (let i = 0; i < videoKeys.length; i++) {
            if (video[videoKeys[i]] && video[videoKeys[i]].toString().toLowerCase().includes(search.toLowerCase())) {
                return true;
            }
        }

        return false;
    }

    const expandDescription = (video) => {
        if (expandedDescriptions.includes(video.description)) {
            setExpandedDescriptions([...expandedDescriptions.filter((desc) => desc != video.description)]);
        }   
        else {
            setExpandedDescriptions([...expandedDescriptions].concat([video.description]));
        }
    }

    const updateCurrVideo = (e, property) => {
        const value = e.target.value;
        let newCurrVideo = JSON.parse(JSON.stringify(currVideo));
        newCurrVideo[property] = value;
        setCurrVideo(JSON.parse(JSON.stringify(newCurrVideo)));
    }

    const createOrEditVideo = () => {
        setCreatingOrEditingVideo(true);
        setSubmissionErrorMessage("");
        setSubmissionSuccessMessage("");
        setShowSubmissionSuccess(false);
        setShowSubmissionFailure(false);
        setShowSubmissionInProgress(true);
        if (editingVideo) {
            setSubmissionPendingMessage("Updating video in database...");
            axios.post("/api/updatevideo", {
                id: currVideo._id,
                title: currVideo.title,
                type: currVideo.type,
                link: currVideo.link,
                description: currVideo.description,
                category: currVideo.category,
                videoOrder: parseInt(currVideo.videoOrder),
                categoryOrder: parseInt(currVideo.categoryOrder),
                minutes: parseInt(currVideo.minutes),
                code: code
            })  
            .then(function (response) {
              console.log(response);
              setCreatingOrEditingVideo(false);
              setShowSubmissionInProgress(false);

              const success = response.data.success;

              if (success === 'true') {
                  setShowSubmissionSuccess(true);
                  setSubmissionSuccessMessage("Video updated in database successfully!");
                  hideVideoModal();
                  loadVideos();
              }
              else {
                  setShowSubmissionFailure(true);
                  setSubmissionErrorMessage(`Failed to update video in database: ${response.data.reason}`);
              }
            })
            .catch(function (error) {
              console.log(error);
              setCreatingOrEditingVideo(false);
              setShowSubmissionInProgress(false);
              setSubmissionErrorMessage(`Failed to update video in database: ${error.toString()}`);
            });
        }
        else {
            setSubmissionPendingMessage("Adding video to database...");
            axios.post("/api/addvideo", {
                title: currVideo.title,
                type: currVideo.type,
                link: currVideo.link,
                description: currVideo.description,
                category: currVideo.category,
                videoOrder: parseInt(currVideo.videoOrder),
                categoryOrder: parseInt(currVideo.categoryOrder),
                minutes: parseInt(currVideo.minutes),
                code: code
            })  
            .then(function (response) {
              console.log(response);
              setCreatingOrEditingVideo(false);
              setShowSubmissionInProgress(false);

              const success = response.data.success;

              if (success === 'true') {
                  setShowSubmissionSuccess(true);
                  setSubmissionSuccessMessage("Video added to database successfully!");
                  setCurrVideo({
                        id: "",
                        title: "",
                        type: "",
                        link: "",
                        description: "",
                        category: "",
                        minutes: "",
                        categoryOrder: "",
                        videoOrder: ""
                    });
                  loadVideos();
              }
              else {
                  setShowSubmissionFailure(true);
                  setSubmissionErrorMessage(`Failed to add video to database: ${response.data.reason}`);
              }
            })
            .catch(function (error) {
              console.log(error);
              setCreatingOrEditingVideo(false);
              setShowSubmissionInProgress(false);
              setSubmissionErrorMessage(`Failed to add video to database: ${error.toString()}`);
            });
        }
    }

    const deleteVideo = () => {
        setDeletingVideo(true);
        setSubmissionErrorMessage("");
        setSubmissionSuccessMessage("");
        setShowSubmissionSuccess(false);
        setShowSubmissionFailure(false);
        setShowSubmissionInProgress(true);
        setSubmissionPendingMessage("Deleting video from database...");

        axios.post("/api/deletevideo", {
            id: currVideo._id,
            code: code
        })  
        .then(function (response) {
          console.log(response);
          setDeletingVideo(false);
          setShowSubmissionInProgress(false);

          const success = response.data.success;

          if (success === 'true') {
              setShowSubmissionSuccess(true);
              setSubmissionSuccessMessage("Video deleted from database successfully!");
              hideVideoDeleteModal();
              loadVideos();
          }
          else {
              setShowSubmissionFailure(true);
              setSubmissionErrorMessage(`Failed to delete video from database: ${response.data.reason}`);
          }
        })
        .catch(function (error) {
          console.log(error);
          setDeletingVideo(false);
          setShowSubmissionInProgress(false);
          setSubmissionErrorMessage(`Failed to delete video from database: ${error.toString()}`);
        });
    }

    const descriptionChange = (value) => {
        console.log(value.toString('html'));

        let newCurrVideo = JSON.parse(JSON.stringify(currVideo));
        newCurrVideo["description"] = value.toString('html');
        setCurrVideo(JSON.parse(JSON.stringify(newCurrVideo)));
    }

    return (
        <>
        <Navigation useDarkTheme={props.useDarkTheme} setUseDarkTheme={props.setUseDarkTheme} />

        <Snackbar open={showSubmissionSuccess} autoHideDuration={6000} onClose={() => {setShowSubmissionSuccess(false)}}>
            <MuiAlert elevation={6} variant="filled" onClose={() => {setShowSubmissionSuccess(false)}} severity="success" sx={{ width: '100%' }} >
                {submissionSuccessMessage}
            </MuiAlert>
        </Snackbar>
        <Snackbar open={showSubmissionFailure} autoHideDuration={6000} onClose={() => {setShowSubmissionFailure(false)}}>
            <MuiAlert elevation={6} variant="filled" onClose={() => {setShowSubmissionFailure(false)}} severity="error" sx={{ width: '100%' }} >
                {submissionErrorMessage}
            </MuiAlert>
        </Snackbar>
        <Snackbar open={showSubmissionInProgress} autoHideDuration={20000} onClose={() => {setShowSubmissionInProgress(false)}}>
            <MuiAlert elevation={6} variant="filled" onClose={() => {setShowSubmissionInProgress(false)}} severity="info" sx={{ width: '100%' }} >
                {submissionPendingMessage}
            </MuiAlert>
        </Snackbar>

        <Modal centered show={showVideoModal} onHide={() => hideVideoModal(false)} className="entryModal">
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>
                    <Typography variant="p" component="div" className={styles.modalHeaderText}>
                        {currVideo.title && editingVideo ? `Edit Video - ${currVideo.title}` : "Create New Video"}
                    </Typography>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <Typography variant="h6" component="div" className={styles.modalSecondaryHeader}>
                    Add/Edit Video Properties
                </Typography>
                <FormControl fullWidth className={styles.videoTextField}>
                    <InputLabel id="type-label">Entry Type</InputLabel>
                    <Select
                        labelId="type-label"
                        value={currVideo.type}
                        label="Entry Type"
                        onChange={(e) => updateCurrVideo(e, "type")}
                    >
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="article">Article</MenuItem>
                    </Select>
                </FormControl>
                <br/>
                <TextField error={inputError != ""} helperText={inputError}
                    label={currVideo.type ? currVideo.type == "video" ? "Video Title" : "Article Title" : "Title"}
                    value={currVideo.title} onChange={(e) => updateCurrVideo(e, "title")} className={styles.videoTextField} />
                <br/>
                {
                    (currVideo.type == "video" || currVideo.link != "") && (
                        <>
                            <TextField error={inputError != ""} label="Video Link" helperText={inputError}
                            value={currVideo.link} onChange={(e) => updateCurrVideo(e, "link")} className={styles.videoTextField} />
                            <br/>
                        </>
                    )
                }
                <Typography variant="p" component="div" className={styles.descriptionText}>
                    {currVideo.type ? currVideo.type == "video" ? "Video Description" : "Article Text" : "Video Description / Article Text"}
                </Typography>
                <br/>
                <ReactRTE
                    descriptionChange={descriptionChange}
                    description={currVideo.description}
                    startingValue={currVideo.description}
                />
                <br/>
                <Autocomplete disablePortal options={categories} className={clsx(styles.videoTextField, styles.videoCategoryField)} value={currVideo.category}
                    onChange={(event, value, reason) => updateCurrVideo({"target": {"value": value}}, "category")}
                    noOptionsText={`New Category Will be Created - ${currVideo.category}`}
                    renderInput={(params) => 
                        <TextField {...params} error={inputError != ""} helperText={inputError} value={currVideo.category} 
                            label={currVideo.type ? currVideo.type == "video" ? "Video Category" : "Article Category" : "Category"}
                            onChange={(e) => updateCurrVideo(e, "category")} />
                    }
                />
                <br/>
                <TextField error={inputError != ""} helperText={inputError}
                    label={currVideo.type ? currVideo.type == "video" ? "Video Length (minutes)" : "Approximate Article Length (minutes)" : "Length (minutes)"}
                    value={currVideo.minutes} onChange={(e) => updateCurrVideo(e, "minutes")} className={styles.videoTextField} />
                <br/>
                <TextField error={inputError != ""} label="Category Order" helperText={inputError}
                    value={currVideo.categoryOrder} onChange={(e) => updateCurrVideo(e, "categoryOrder")} className={styles.videoTextField} />
                <br/>
                <TextField error={inputError != ""} helperText={inputError}
                    label={currVideo.type ? currVideo.type == "video" ? "Video Order" : "Article Order" : "Video/Article Order"}
                    value={currVideo.videoOrder} onChange={(e) => updateCurrVideo(e, "videoOrder")} className={styles.videoTextField} />
                <br/>
                <TextField error={inputError != ""} label="Code" helperText={inputError}
                    value={code} onChange={(e) => setCode(e.target.value)} className={styles.videoTextField} />
                <br/>
                <Button size="small" variant="contained" color="primary" onClick={() => createOrEditVideo()}
                    disabled={creatingOrEditingVideo}>
                    {creatingOrEditingVideo && <CircularProgress size={18} color="secondary" className={styles.circularProgress}/>} 
                    {creatingOrEditingVideo ? <>&nbsp; Submitting</> : "Submit Video Entry"}
                </Button>
            </Modal.Body>
        </Modal>

        <Modal centered show={showVideoDeleteModal} onHide={() => hideVideoDeleteModal(false)}>
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>
                    <Typography variant="p" component="div" className={styles.modalHeaderText}>
                        Delete Video - {currVideo.title}
                    </Typography>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <Typography variant="h6" component="div" className={styles.modalSecondaryHeader}>
                    Type Delete Code Here Then Submit
                </Typography>
                <TextField error={inputError != ""} label="Code" helperText={inputError}
                    value={code} onChange={(e) => setCode(e.target.value)} className={styles.videoTextField} />
                <br/>
                <Button size="small" variant="contained" color="primary" onClick={() => deleteVideo()}
                    disabled={creatingOrEditingVideo}>
                    {deletingVideo && <CircularProgress size={18} color="secondary" className={styles.circularProgress}/>} 
                    {deletingVideo ? <>&nbsp; Submitting</> : "Delete Video"}
                </Button>
            </Modal.Body>
        </Modal>

        <Grid container justifyContent="center" className={clsx(styles.mainGrid, props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
            <Grid item xs={3} className={styles.spacingGrid}></Grid>
            <Grid item xs={6} className={styles.headerGrid}>
                <Typography variant="h4" className={clsx(styles.header)}>
                    Manage Education Center Videos
                </Typography>
            </Grid>
            <Grid item xs={3} className={styles.spacingGrid}></Grid>
            <Grid item lg={3} md={4} sm={8} xs={12} className={styles.newVideoBtnGrid}>
                <Button size="large" variant="contained" color="primary" onClick={() => setShowVideoModal(true)}>
                    Add New Video/Article
                </Button>
            </Grid>
            <Grid item lg={3} md={4} sm={8} xs={12} className={styles.searchGrid}>
                <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'left', width: 250 }} className={styles.search}>
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                    <IconButton sx={{ p: '10px' }}>
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 1000 }}>
                        <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.tableHeadCell}>Actions</TableCell>
                                <TableCell className={styles.tableHeadCell}>Title</TableCell>
                                <TableCell className={styles.tableHeadCell}>Link</TableCell>
                                <TableCell className={styles.tableHeadCell}>Description</TableCell>
                                <TableCell className={styles.tableHeadCell}>Category</TableCell>
                                <TableCell className={styles.tableHeadCell}>Length (minutes)</TableCell>
                                <TableCell className={styles.tableHeadCell}>Category order</TableCell>
                                <TableCell className={styles.tableHeadCell}>Video order</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={styles.tableBody}>
                            {
                                videos.length == 0 && (
                                    Array.apply(null, Array(5)).map(function (_, index) {
                                        return (
                                            <TableRow hover key={index}>
                                                <TableCell>Loading...</TableCell>
                                                <TableCell>...</TableCell>
                                                <TableCell>...</TableCell>
                                                <TableCell>...</TableCell>
                                                <TableCell>...</TableCell>
                                                <TableCell>...</TableCell>
                                                <TableCell>...</TableCell>
                                                <TableCell>...</TableCell>
                                            </TableRow>
                                        )
                                    })
                                )
                            }
                            {videos
                            .filter(searchFilter)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((video) => {
                                return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={video._id}>
                                    <TableCell className={styles.actionsTableCell}>
                                    <Button variant="contained" className={styles.editBtn} endIcon={<EditIcon />}
                                        onClick={() => openEditModal(video)}>
                                        Edit
                                    </Button>
                                    <br/>
                                    <Button variant="contained" endIcon={<DeleteIcon />}
                                        onClick={() => openDeleteModal(video)}>
                                        Delete
                                    </Button>
                                    </TableCell>
                                    <TableCell>
                                        {video.title}
                                    </TableCell>
                                    <TableCell>
                                        {video.link}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" startIcon={<ArticleIcon />}
                                            className={clsx(styles.descriptionBtn, expandedDescriptions.includes(video.description) ? "mb-3" : "")}
                                            onClick={() => expandDescription(video)}>
                                            {expandedDescriptions.includes(video.description) ? "Hide" : "Expand"}
                                        </Button>
                                        {
                                            expandedDescriptions.includes(video.description) && (
                                                <div>
                                                    { ReactHtmlParser(
                                                        video.description.replaceAll("&lt;", "<").replaceAll("&gt;", ">"), 
                                                        options
                                                    ) }
                                                </div>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {video.category}
                                    </TableCell>
                                    <TableCell>
                                        {video.minutes}
                                    </TableCell>
                                    <TableCell>
                                        {video.categoryOrder}
                                    </TableCell>
                                    <TableCell>
                                        {video.videoOrder}
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={videos.filter(searchFilter).length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        className={styles.tablePagination}
                    />
                </Paper>
            </Grid>
        </Grid>
        </>
    )
}