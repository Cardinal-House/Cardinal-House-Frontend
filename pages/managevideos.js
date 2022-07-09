import { 
    Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, Paper, Button, IconButton
} from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import styles from '../styles/managevideos.module.css';

import Navigation from '../components/Navigation';

export default function managevideos(props) {
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [videosByCategory, setVideosByCategory] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
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

    return (
        <>
        <Navigation useDarkTheme={props.useDarkTheme} setUseDarkTheme={props.setUseDarkTheme} />
        <Grid container justifyContent="center" className={clsx(styles.mainGrid, props.useDarkTheme ? styles.backgroundDark : styles.backgroundLight)}>
            <Grid item xs={3} className={styles.spacingGrid}></Grid>
            <Grid item xs={6} className={styles.headerGrid}>
                <Typography variant="h4" className={clsx(styles.header)}>
                    Manage Education Center Videos
                </Typography>
            </Grid>
            <Grid item xs={3} className={styles.spacingGrid}></Grid>
            <Grid item xs={12} className={styles.newVideoBtnGrid}>
            <Button size="large" variant="contained" color="primary">
              Add New Video to the Cardinal House Education Center
            </Button>
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
                            {videos
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((video) => {
                                return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={video._id}>
                                    <TableCell className={styles.actionsTableCell}>
                                    <Button variant="contained" className={styles.editBtn} endIcon={<EditIcon />}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" endIcon={<DeleteIcon />}>
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
                                        {video.description}
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
                        count={videos.length}
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