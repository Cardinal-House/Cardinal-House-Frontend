import { Grid, Typography, Button } from '@mui/material';
import { FaMedium } from 'react-icons/fa';
import moment from 'moment';

import styles from '../styles/EducationCenter.module.css';

export default function MediumFeedItem({ feed, project }) {
    return (
        <>
            <Typography variant="p">
                <FaMedium size={35} className={styles.mediumIcon} /> <b>{project.name}</b> {`  @${project.mediumUsername}`} ● {moment(feed.timestamp).fromNow()}
            </Typography>
            <br/>
            <div className="mt-3 mb-3 mediumImages">
                <Typography variant="p">
                    <div dangerouslySetInnerHTML={{__html: feed.text.replace("&amp;", "&")}} className={styles.limitHeight}></div>
                </Typography>
            </div>
            <br/>
            <Typography variant="p" className="mt-3">
                <Button size="medium" variant="contained" color="primary" className={styles.mediumBtn} href={feed.link} target="_blank" rel="noreferrer">
                    View on Medium 
                </Button>
            </Typography>
        </>
    )
}