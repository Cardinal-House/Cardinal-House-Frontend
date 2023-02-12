import { useState } from "react";
import { Grid, Button } from "@mui/material";
import clsx from 'clsx';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicOffIcon from "@mui/icons-material/MicOff";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useAuth } from "../../contexts/AuthContext";
import ChatRoom from '../chat/ChatRoom';

import styles from '../../styles/Community.module.css';

export default function VoiceCall(props) {
    const { muted, deafened, inVoiceChannel, users, selectedTextChannel } = props;

    const { currentUser, currentUserData } = useAuth();

    const [showUsers, setShowUsers] = useState(true);
    const [showTextChannels, setShowTextChannels] = useState(true);

    const uidHashedToImageIndex = () => {
        let asciiValue = 0;
        const uid = currentUser.uid;
        for (var i = 0; i < uid.length; i ++)
            asciiValue += uid[i].charCodeAt(0);
    
        return asciiValue % 20 + 1;
    }
    
    const imageIndex = uidHashedToImageIndex();

    const handleUpArrowClicked = () => {
        if (showTextChannels) {
            setShowUsers(false);
        }
        else {
            setShowTextChannels(true);
        }
    }

    const handleDownArrowClicked = () => {
        if (showUsers) {
            setShowTextChannels(false);
        }
        else {
            setShowUsers(true);
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" className="mt-4">
            <Grid item xs={12} className={clsx(showUsers ? showTextChannels ? styles.smallVoiceRoomDiv : styles.largeVoiceRoomDiv : "hide", "mb-3")}>
                <Grid container justifyContent="center" alignItems="center" spacing={0}>
                    <Grid item xs={3} className={clsx(styles.voiceUserGrid, users[currentUser.uid]?.speaking && !muted ? styles.speakingImg : "")}>
                        <img src={currentUser.photoURL ? currentUser.photoURL : `/Original Cardinal NFT ${imageIndex}.png`} className={styles.voiceImgLarge} />
                        <span className={styles.voiceRoomUsername}>{currentUserData.username}</span>
                        {deafened && !users[currentUser.uid]?.adminDeafened && <HeadsetOffIcon className={clsx(styles.voiceRoomUserIcon, styles.voiceRoomuserMute)} />}
                        {users[currentUser.uid]?.adminDeafened && <HeadsetOffIcon className={clsx(styles.voiceRoomUserIcon, styles.voiceRoomuserMute, "text-danger")} />}
                        {muted && !users[currentUser.uid]?.adminMuted && <MicOffIcon className={clsx(styles.voiceRoomUserIcon, styles.voiceRoomuserDeafen)} />}
                        {users[currentUser.uid]?.adminMuted && <MicOffIcon className={clsx(styles.voiceRoomUserIcon, styles.voiceRoomuserDeafen, "text-danger")} />}
                    </Grid>

                    {
                        Object.keys(users).filter((userUid) => userUid != currentUser.uid).map((userUid) => {
                            return (
                              <Grid item xs={3} className={clsx(styles.voiceUserGrid, users[userUid]?.speaking && !users[userUid]?.muted && !users[userUid].userMuted ? styles.speakingImg : "")}>
                                <img src={users[userUid].photoURL} className={styles.voiceImgLarge} />
                                <span className={styles.voiceRoomUsername}>{users[userUid].username}</span>
                                {users[userUid]?.deafened && !users[userUid]?.adminDeafened && <HeadsetOffIcon className={clsx(styles.voiceRoomUserIcon, styles.voiceRoomuserMute)} />}
                                {users[userUid]?.adminDeafened && <HeadsetOffIcon className={clsx(styles.voiceRoomUserIcon, styles.voiceRoomuserMute, "text-danger")} />}
                                {users[userUid]?.muted && !users[userUid]?.adminMuted && !users[userUid].userMuted && <MicOffIcon className={clsx(styles.voiceRoomUserIcon, styles.voiceRoomuserDeafen)} />}
                                {(users[userUid].userMuted || users[userUid]?.adminMuted) && <MicOffIcon className={clsx(styles.voiceRoomUserIcon, styles.voiceRoomuserDeafen, "text-danger")} />}
                              </Grid>
                            )
                        })
                    }
                </Grid>
            </Grid>
            {
                showUsers && (
                    <Grid item xs={12} className={styles.voiceRoomBtnGrid}>
                        <Button variant="contained" className={styles.voiceRoomUsersHideBtn} onClick={handleUpArrowClicked}>
                            <KeyboardArrowUpIcon />
                        </Button>
                    </Grid>
                )
            }
            {
                showTextChannels && (
                    <Grid item xs={12} className={styles.voiceRoomBtnGrid}>
                        <Button variant="contained" className={styles.voiceRoomChatHideBtn} onClick={handleDownArrowClicked}>
                            <KeyboardArrowDownIcon />
                        </Button>
                    </Grid>
                )
            }
            {
                showTextChannels && (
                    <Grid item xs={12}>
                        <ChatRoom selectedTextChannel={selectedTextChannel} smallChat={showUsers} />
                    </Grid>
                )
            }
        </Grid>
    )
}