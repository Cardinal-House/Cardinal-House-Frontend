import { Typography } from '@mui/material';
import clsx from 'clsx';

import styles from '../../styles/Community.module.css';

import { useAuth } from "../../contexts/AuthContext";

export default function ChatMessage(props) {
    const { currentUser } = useAuth();

    const { text, uid, photoURL, createdAt } = props.message;

    const messageClass = uid === currentUser.uid ? "sent" : "received";

    const uidHashedToImageIndex = () => {
        let asciiValue = 0;
        for (var i = 0; i < uid.length; i ++)
            asciiValue += uid[i].charCodeAt(0);

        return asciiValue % 20 + 1;
    }

    const imageIndex = uidHashedToImageIndex();

    function toDateString(createdAt) {
        let seconds = 0;
        if (createdAt) {
            seconds = createdAt.seconds;
        }
        else {
            return "Just now";
        }

        let msgDate = new Date(Date.UTC(1970, 0, 1));
        msgDate.setUTCSeconds(seconds);

        let currDate = new Date(Date.UTC(1970, 0, 1));
        currDate.setUTCSeconds(Date.now() / 1000);

        let dateStr = "";

        const time = msgDate.toLocaleTimeString();

        const timeDiff = currDate.getTime() - msgDate.getTime();
        const dayDiff = timeDiff / (1000 * 3600 * 24);

        if (msgDate.getDate() == currDate.getDate()) {
            dateStr = `Today at ${time.split(":")[0]}:${time.split(":")[1]} ${time.split(" ")[1]}`;
        }
        else if (dayDiff < 2) {
            dateStr = `Yesterday at ${time.split(":")[0]}:${time.split(":")[1]} ${time.split(" ")[1]}`;
        }
        else {
            dateStr = `${msgDate.toLocaleDateString()} ${time}`;
        }

        return dateStr;
    }

    return (
        <div className={clsx(styles.message, messageClass == "sent" ? styles.sentMessage : styles.receivedMessage)}>
            <img src={photoURL ? photoURL : `/Original Cardinal NFT ${imageIndex}.png`} className={styles.chatImg} />
            <Typography variant="p" className={styles.chatElement}>
                <span className={styles.userText}>User </span><span className={styles.dateText}>{toDateString(createdAt)}</span>
                <br/>
                <span className={styles.messageText}>{text.replaceAll("NEWLINE", "\n")}</span>
            </Typography>
        </div>
    )
}