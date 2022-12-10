import { Grid, Typography } from '@mui/material';
import { FaTelegram } from 'react-icons/fa';
import moment from 'moment';

import styles from '../styles/EducationCenter.module.css';

export default function TelegramFeedItem({ feed, project }) {
    return (
        <>
            <Typography variant="p">
                <FaTelegram size={35} className={styles.telegramIcon} /> <b>{project.name}</b> ● {moment(feed.timestamp).fromNow()}
            </Typography>
            <br/>
            <div className="mt-3 mb-3">
                <Typography variant="p">
                    {feed.text.replace("&amp;", "&")}
                </Typography>
            </div>
        </>
    )
}