import { Grid, Typography, Button } from '@mui/material';
import { FaTwitter } from 'react-icons/fa';
import moment from 'moment';

import styles from '../styles/EducationCenter.module.css';

export default function TwitterFeedItem({ feed, project }) {
    return (
        <>
            <Typography variant="p">
                <FaTwitter size={35} className={styles.twitterIcon} /> <b>{project.name}</b> {`  @${project.twitter.split("/").at(-1)}`} ● {moment(feed.timestamp).fromNow()}
            </Typography>
            <br/>
            <div className="mt-3 mb-3">
                <Typography variant="p">
                    {feed.text.replace("&amp;", "&")}
                </Typography>
            </div>
            <br/>
            <Typography variant="p" className="mt-3">
                <Button size="medium" variant="contained" color="primary" className={styles.twitterBtn} href={feed.link} target="_blank" rel="noreferrer">
                    View on Twitter 
                </Button>                
            </Typography>
        </>
    )
}