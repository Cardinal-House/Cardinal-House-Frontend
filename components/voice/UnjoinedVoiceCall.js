import { Grid } from "@mui/material";
import clsx from 'clsx';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicOffIcon from "@mui/icons-material/MicOff";

import { useAuth } from "../../contexts/AuthContext";

import styles from '../../styles/Community.module.css';

export default function UnjoinedVoiceCall(props) {
  const { users } = props;

  const { currentUser } = useAuth();

  const uidHashedToImageIndex = (uid) => {
    let asciiValue = 0;
    for (var i = 0; i < uid.length; i ++)
        asciiValue += uid[i].charCodeAt(0);

    return asciiValue % 20 + 1;
  }

  const getShortenedUsername = (username) => {
    if (username.length < 25) {
      return username;
    }
    else {
      return username.slice(0, 22) + "...";
    }
  }

  return (
    <Grid container justifyContent="center" alignItems="center">
      {
        users && users.filter((user) => user.id != currentUser.uid).map((user) => {
          return (
            <Grid item xs={12} className={"pt-2 pb-2"}>
              <img src={user.photoURL ? user.photoURL : `/Original Cardinal NFT ${uidHashedToImageIndex(user.id)}.png`} className={styles.voiceImg} />
              <span className={styles.voiceUsername}>{getShortenedUsername(user.username)}</span>
              {user.deafened && !user.adminDeafened && <HeadsetOffIcon className={styles.voiceUserIcon} />}
              {user.adminDeafened && <HeadsetOffIcon className={clsx(styles.voiceUserIcon, "text-danger")} />}
              {user.muted && !user.adminMuted && <MicOffIcon className={styles.voiceUserIcon} />}
              {user.adminMuted && <MicOffIcon className={clsx(styles.voiceUserIcon, "text-danger")} />}
            </Grid>
          )
        })
      }
    </Grid>
  );
}