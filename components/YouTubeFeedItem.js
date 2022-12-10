import { Grid, Typography, Button } from '@mui/material';
import ReactPlayer from "react-player";
import { FaYoutube } from 'react-icons/fa';
import clsx from 'clsx';
import moment from 'moment';

import styles from '../styles/EducationCenter.module.css';

export default function YouTubeFeedItem({ feed, project }) {
    return (
        <>
            <Typography variant="p">
                <FaYoutube size={35} className={styles.youtubeIcon} /> <b>{project.name}</b> ● {moment(feed.timestamp).fromNow()}
            </Typography>
            <br/>
            <div className={clsx(styles.reactPlayerContainer, "mt-3 mb-3")}>
                <ReactPlayer url={feed.link} controls={true} width="100%" height="100%" className={styles.reactPlayer} />
            </div>   
            <br/>
            <div className="mt-3 mb-3">
                <Typography variant="p">
                    {feed.text}
                </Typography>
            </div>
            <Typography variant="p" className="mt-3">
                <Button size="medium" variant="contained" color="primary" className={styles.youtubeBtn} href={feed.link} target="_blank" rel="noreferrer">
                    View on YouTube 
                </Button>
            </Typography>
        </>
    )
}