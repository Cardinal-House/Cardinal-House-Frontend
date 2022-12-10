import { Grid, Typography, Button } from '@mui/material';
import { FaDiscord } from 'react-icons/fa';
import moment from 'moment';

import styles from '../styles/EducationCenter.module.css';

export default function DiscordFeedItem({ feed, project }) {
    return (
        <>
            <Typography variant="p">
                <FaDiscord size={35} className={styles.discordIcon} /> <b>{project.name}</b> ● {moment(feed.timestamp).fromNow()}
            </Typography>
            <br/>
            <div className="mt-3 mb-3">
                <Typography variant="p">
                    {feed.text}
                </Typography>
            </div>
            <br/>
            <Typography variant="p" className="mt-3">
                <Button size="medium" variant="contained" color="primary" className={styles.discordBtn} href={feed.link} target="_blank" rel="noreferrer">
                    View on Discord 
                </Button>
            </Typography>
        </>
    )
}