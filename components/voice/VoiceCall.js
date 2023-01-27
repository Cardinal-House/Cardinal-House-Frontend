import { useState, useEffect, useRef } from "react";
import { Grid, Menu, MenuItem, Fade, Divider } from "@mui/material";
import clsx from 'clsx';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicOffIcon from "@mui/icons-material/MicOff";
import { doc, setDoc, query, collection, where } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';

import {
  config,
  useClient,
  useMicrophoneAudioTrack
} from "./settings.js";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from '../../firebase-vars';

import styles from '../../styles/Community.module.css';

export default function VoiceCall(props) {
  const { channelName, channelId, setJoinedVoiceChannel, muted, deafened, inVoiceChannel, setInVoiceChannel } = props;
  const [users, setUsers] = useState({});
  const [userAudioStatuses, setUserAudioStatuses] = useState({});
  const [speakingUids, setSpeakingUids] = useState([]);
  const [start, setStart] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [handleUnload, _] = useState(() => (ev) => {
    ev.preventDefault();
    leaveChannel();
    const msg = 'You are still in a voice channel, please click here to close.'
    ev.returnValue = msg;
    return msg;
  });

  const client = useClient();
  const { ready, track } = useMicrophoneAudioTrack();
  const { currentUser, currentUserData, setIsConnected } = useAuth();

  const messageRef = collection(firestore, "voiceChannels", channelId, "users");
  const voiceChannelUsersQuery = query(messageRef, where("joined", "==", true));
  const [voiceChannelUsers, loading, error] = useCollection(voiceChannelUsersQuery);

  const userDropdownOpen = Boolean(anchorEl);

  const handleVoiceUserClicked = (event) => {
    if (userDropdownOpen) {
      handleUserDropdownClose();
    }
    else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleUserDropdownClose = () => {
    setAnchorEl(null);
  };

  const uidHashedToImageIndex = () => {
    let asciiValue = 0;
    const uid = currentUser.uid;
    for (var i = 0; i < uid.length; i ++)
        asciiValue += uid[i].charCodeAt(0);

    return asciiValue % 20 + 1;
  }

  const imageIndex = uidHashedToImageIndex();

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        if (!user.uid.includes("<~>")) {
          return;
        }

        const username = user.uid.split("<~>")[0];
        const uid = user.uid.split("<~>")[1];
        const photoURL = user.uid.split("<~>")[2];

        await client.subscribe(user, "audio");

        const newUserList = JSON.parse(JSON.stringify(users));
        newUserList[uid] = {agoraUser: user, username: username, photoURL: photoURL, muted: false};
        setUsers(JSON.parse(JSON.stringify(newUserList)));

        user.audioTrack.play();
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (user.audioTrack) user.audioTrack.stop();

        const uid = user.uid.split("<~>")[1];

        const newUserList = JSON.parse(JSON.stringify(users));
        delete newUserList[uid];
        setUsers(JSON.parse(JSON.stringify(newUserList)));
      });

      client.on("user-left", (user) => {
        const uid = user.uid.split("<~>")[1];

        const newUserList = JSON.parse(JSON.stringify(users));
        delete newUserList[uid];
        setUsers(JSON.parse(JSON.stringify(newUserList)));
      });

      client.on("user-info-updated", async (userUid, message) => {
        const uid = userUid.split("<~>")[1];

        const newUserList = JSON.parse(JSON.stringify(users));

        if (message == "mute-audio") {
          newUserList[uid].muted = true;
        }
        else if (message == "unmute-audio") {
          newUserList[uid].muted = false;
        }
        else {
          return;
        }

        setUsers(JSON.parse(JSON.stringify(newUserList)));
      });

      client.enableAudioVolumeIndicator();
      client.on("volume-indicator", volumes => {
          let currSpeakingUids = [];

          volumes.forEach((volume) => {
              // console.error(`UID ${volume.uid} Level ${volume.level}`);
              if (!volume.uid.includes("<~>")) {
                return;
              }
        
              const currUid = volume.uid.split("<~>")[1];

              if (volume.level > 60) {
                  currSpeakingUids.push(currUid);
              }
          });

          setSpeakingUids(JSON.parse(JSON.stringify(currSpeakingUids)));
      })

      setStart(true);

      try {
        const photoURL = currentUser.photoURL ? currentUser.photoURL : `/Original Cardinal NFT ${imageIndex}.png`;
        await client.join(config.appId, name, config.token, `${currentUserData.username}<~>${currentUser.uid}<~>${photoURL}`);
      } catch (error) {
        console.log(`Error joining ${name}: ${error}`);
        return;
      }

      if (track) await client.publish(track);
    };

    if (ready && track && !start) {
      try {
        init(channelName);
      } catch (error) {
        console.log(error);
      }
    }
  }, [channelName, client, ready, track]); 

  const leaveChannel = async () => {
    await client.leave();
    if (track) {
      track.close();
    }
    client.removeAllListeners();
    setStart(false);
    setJoinedVoiceChannel({});
    setInVoiceChannel(false);
    window.removeEventListener("beforeunload", handleUnload, false);
    const docRef = doc(firestore, "voiceChannels", channelId, "users", currentUser.uid);
    await setDoc(docRef, { joined: false }, { merge: true });
    setIsConnected(false);
  };

  const getAttribute = (d, attr) => {
    return d._document.data.value.mapValue.fields[attr]?.booleanValue;
  }

  const updateUserStatuses = async () => {
    const remoteUsers = client.remoteUsers;

    if (!voiceChannelUsers || !voiceChannelUsers?.docs) {
      return;
    }

    const firebaseUsers = {};
    voiceChannelUsers.docs.forEach((user) => {
      firebaseUsers[user.id] = {
        muted: getAttribute(user, "muted"),
        deafened: getAttribute(user, "deafened"),
        adminMuted: getAttribute(user, "adminMuted"),
        adminDeafened: getAttribute(user, "adminDeafened"),
      }
    })

    const newUserAudioStatuses = {};

    remoteUsers.forEach((remoteUser) => {
      if (!remoteUser.uid.includes("<~>")) {
        return;
      }

      const currUid = remoteUser.uid.split("<~>")[1];
      const currFirebaseUser = firebaseUsers[currUid];

      newUserAudioStatuses[currUid] = {};

      if (deafened && remoteUser.audioTrack.isPlaying) {
        remoteUser.audioTrack.stop();
      }

      if (currFirebaseUser) {
        if (currFirebaseUser.muted || currFirebaseUser.adminMuted) {
          if (remoteUser.audioTrack.isPlaying) {
            remoteUser.audioTrack.stop();
          }
          newUserAudioStatuses[currUid].muted = true;
        }
        else {
          if (!remoteUser.audioTrack.isPlaying && !deafened) {
            remoteUser.audioTrack.play();
          }
          newUserAudioStatuses[currUid].muted = false;
        }

        if (currFirebaseUser.deafened || currFirebaseUser.adminDeafened) {
          newUserAudioStatuses[currUid].deafened = true;
        }
        else {
          newUserAudioStatuses[currUid].deafened = false;
        }
      }
    });

    setUserAudioStatuses(JSON.parse(JSON.stringify(newUserAudioStatuses)));
  }

  useEffect(() => {
    if (start) {
      updateUserStatuses();
    }
  }, [voiceChannelUsers, start])

  const mute = async (isMuted) => {
    const docRef = doc(firestore, "voiceChannels", channelId, "users", currentUser.uid);
    await setDoc(docRef, { muted: isMuted }, { merge: true });
  }

  const deafen = async (isDeafendd) => {
    const docRef = doc(firestore, "voiceChannels", channelId, "users", currentUser.uid);
    await setDoc(docRef, { deafened: isDeafendd }, { merge: true });
    updateUserStatuses();
  }

  useEffect(() => {
    if (!inVoiceChannel) {
      leaveChannel();      
    }
  }, [inVoiceChannel])

  useEffect(() => {
      mute(muted);
  }, [muted])

  useEffect(() => {
    deafen(deafened);
  }, [deafened])

  const componentWillUnmount = useRef(false)

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload, false);
    return () => {
      componentWillUnmount.current = true
    }
  }, [])

  useEffect(() => {
    return () => {
        if (componentWillUnmount.current && start) {
            leaveChannel();
        }
    }

  }, [start])

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
        start && track && (
          <Grid item xs={12} className="pt-2 pb-2">
            <img src={currentUser.photoURL ? currentUser.photoURL : `/Original Cardinal NFT ${imageIndex}.png`} className={clsx(styles.voiceImg, speakingUids.includes(currentUser.uid) && !muted ? styles.speakingImg : "")} />
            <span className={styles.voiceUsername}>{getShortenedUsername(currentUserData.username)}</span>
            {deafened && <HeadsetOffIcon className={styles.voiceUserIcon} />}
            {muted && <MicOffIcon className={styles.voiceUserIcon} />}
            {muted && currentUserData.isAdmin && <MicOffIcon className={styles.voiceUserIcon} />}
          </Grid>
        )
      }
      {
        start && track && Object.keys(users).map((userUid) => {
          return (
            <Grid item xs={12} className="pt-2 pb-2" onClick={currentUserData.isAdmin ? handleVoiceUserClicked : () => {}}>
              <img src={users[userUid].photoURL} className={clsx(styles.voiceImg, speakingUids.includes(currentUser.uid) && !userAudioStatuses[userUid]?.muted ? styles.speakingImg : "")} />
              <span className={styles.voiceUsername}>{users[userUid].username}</span>
              {userAudioStatuses[userUid]?.deafened && <HeadsetOffIcon className={styles.voiceUserIcon} />}
              {userAudioStatuses[userUid]?.muted && <MicOffIcon className={styles.voiceUserIcon} />}
            </Grid>
          )
        })
      }

      <Menu anchorEl={anchorEl} open={userDropdownOpen} onClose={handleUserDropdownClose} TransitionComponent={Fade}
        className="accountDropDownMenu" sx={{
            marginTop: '0px'
        }}>
        <MenuItem onClick={() => {}} className={styles.accountDropdownMenuItem}>Mute</MenuItem>
        <MenuItem onClick={() => {}} className={styles.accountDropdownMenuItem}>Deafen</MenuItem>
        <MenuItem onClick={() => {}} className={clsx(styles.accountDropdownMenuItem, "text-danger")}>Kick</MenuItem>
        <MenuItem onClick={() => {}} className={clsx(styles.accountDropdownMenuItem, "text-danger")}>Ban</MenuItem>
      </Menu>
    </Grid>
  );
}