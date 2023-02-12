import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Grid, Menu, MenuItem, Fade, Divider } from "@mui/material";
import AgoraRTC from "agora-rtc-sdk-ng";
import { RtcRole } from "agora-access-token";
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
  const { 
    channelName, channelId, setJoinedVoiceChannel, muted, deafened, inVoiceChannel,
    setInVoiceChannel, users, setUsers
  } = props;

  const [selectedUser, setSelectedUser] = useState({});
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

  const messageRef = collection(firestore, "voiceChannels", channelId, "voiceChannelUsers");
  const voiceChannelUsersQuery = query(messageRef, where("joined", "==", true));
  const [voiceChannelUsers, loading, error] = useCollection(voiceChannelUsersQuery);

  const userDropdownOpen = Boolean(anchorEl);

  const handleVoiceUserClicked = (event, userUid) => {
    if (userDropdownOpen) {
      handleUserDropdownClose();
    }
    else {
      setAnchorEl(event.currentTarget);

      if (users[userUid]) {
        setSelectedUser({...users[userUid], uid: userUid});
      }
    }
  };
  const handleUserDropdownClose = () => {
    setAnchorEl(null);
    setSelectedUser({});
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
        const photoURL = user.uid.split("<~>")[2].replaceAll("AND", "&").replaceAll("P2F", "%2F").replaceAll("P20", "%20");

        await client.subscribe(user, "audio");

        setUsers((prevUsers) => {
          return {...prevUsers, [uid]: {agoraUser: user, username: username, photoURL: photoURL, muted: false}};
        });

        user.audioTrack.play();
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (user.audioTrack) user.audioTrack.stop();

        const uid = user.uid.split("<~>")[1];

        setUsers((prevUsers) => {
          const newUserList = JSON.parse(JSON.stringify(prevUsers));
          delete newUserList[uid];
          return JSON.parse(JSON.stringify(newUserList));
        });
      });

      client.on("user-left", (user) => {
        const uid = user.uid.split("<~>")[1];

        if (selectedUser.uid == uid) {
          handleUserDropdownClose();
        }

        setUsers((prevUsers) => {
          const newUserList = JSON.parse(JSON.stringify(prevUsers));
          delete newUserList[uid];
          return JSON.parse(JSON.stringify(newUserList));
        });
      });

      client.on("token-privilege-will-expire", async () => {
        const photoURL = currentUser.photoURL ? currentUser.photoURL : `/Original Cardinal NFT ${imageIndex}.png`;      
        const agoraUid = `${currentUserData.username}<~>${currentUser.uid}<~>${photoURL.replaceAll("&", "AND").replaceAll("%2F", "P2F").replaceAll("%20", "P20")}`;

        axios.get(`/api/agoratoken?channelName=${channelName}&uid=${agoraUid}&role=${RtcRole.PUBLISHER}`)  
        .then(async function (response) {
          const success = response.data.success;
  
          if (success === 'true') {
            const agoraToken = response.data.token;
            await client.renewToken(agoraToken);         
          }
          else {
              console.error(response.data.error);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
      });

      AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 500);
      client.enableAudioVolumeIndicator();
      client.on("volume-indicator", volumes => {
        setUsers((prevUsers) => {
          const newUserList = JSON.parse(JSON.stringify(prevUsers));
          volumes.forEach((volume) => {
            // console.error(`UID ${volume.uid} Level ${volume.level}`);
            if (!volume.uid.includes("<~>")) {
              return;
            }
      
            const currUid = volume.uid.split("<~>")[1];

            if (!newUserList[currUid]) {
              return;
            }

            if (volume.level > 60) {
              newUserList[currUid].speaking = true;
            }
            else {
              newUserList[currUid].speaking = false;
            }
          });
          return JSON.parse(JSON.stringify(newUserList));
        });
      })

      const photoURL = currentUser.photoURL ? currentUser.photoURL : `/Original Cardinal NFT ${imageIndex}.png`;      
      const agoraUid = `${currentUserData.username}<~>${currentUser.uid}<~>${photoURL.replaceAll("&", "AND").replaceAll("%2F", "P2F").replaceAll("%20", "P20")}`;

      axios.get(`/api/agoratoken?channelName=${name}&uid=${agoraUid}&role=${RtcRole.PUBLISHER}`)  
      .then(async function (response) {
        const success = response.data.success;

        if (success === 'true') {
          setStart(true);

          const agoraToken = response.data.token;

          console.error(agoraToken);

          try {
            console.error(agoraUid);
            await client.join(config.appId, name, agoraToken, agoraUid);
          } catch (error) {
            console.log(`Error joining ${name}: ${error}`);
            return;
          }
    
          if (track) await client.publish(track);          
        }
        else {
            console.error(response.data.error);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
    };

    if (ready && track && !start) {
      try {
        setUsers({[currentUser.uid]: {}});
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
    setUsers({});
    window.removeEventListener("beforeunload", handleUnload, false);
    const docRef = doc(firestore, "voiceChannels", channelId, "voiceChannelUsers", currentUser.uid);
    await setDoc(docRef, { joined: false }, { merge: true, mergeFields: ["joined"] });
    setIsConnected(false);
  };

  const getAttribute = (d, attr) => {
    return d._document.data.value.mapValue.fields[attr]?.booleanValue;
  }

  const updateUserStatuses = async () => {
    if (!voiceChannelUsers || !voiceChannelUsers?.docs || !start) {
      return;
    }

    setUsers((prevUsers) => {
      const remoteUsers = client.remoteUsers;
      const newUserList = JSON.parse(JSON.stringify(prevUsers));

      const firebaseUsers = {};
      let currDeafened = false;
      voiceChannelUsers.docs.forEach((user) => {
        firebaseUsers[user.id] = {
          muted: getAttribute(user, "muted"),
          deafened: getAttribute(user, "deafened"),
          adminMuted: getAttribute(user, "adminMuted"),
          adminDeafened: getAttribute(user, "adminDeafened"),
        }
  
        if (user.id == currentUser.uid && newUserList[currentUser.uid]) {
          newUserList[currentUser.uid].adminMuted = getAttribute(user, "adminMuted");
          newUserList[currentUser.uid].adminDeafened = getAttribute(user, "adminDeafened");
          const isAdminKicked = getAttribute(user, "adminKicked");

          if (isAdminKicked) {
            leaveChannel();
          }

          currDeafened = getAttribute(user, "adminDeafened");
        }
      })
      
      remoteUsers.forEach((remoteUser) => {
        if (!remoteUser.uid.includes("<~>")) {
          return;
        }
  
        const currUid = remoteUser.uid.split("<~>")[1];

        if (!Object.keys(firebaseUsers).includes(currUid) && remoteUser.audioTrack.isPlaying) {
          remoteUser.audioTrack.stop();
          return;
        }

        const currFirebaseUser = firebaseUsers[currUid];
  
        if ((deafened || currDeafened || newUserList[currentUser.uid].adminDeafened) && remoteUser.audioTrack && remoteUser.audioTrack.isPlaying) {
          remoteUser.audioTrack.stop();
        }
  
        if (currFirebaseUser && newUserList[currUid]) {
          if (currFirebaseUser.muted || currFirebaseUser.adminMuted) {
            if (remoteUser.audioTrack && remoteUser.audioTrack.isPlaying) {
              remoteUser.audioTrack.stop();
            }
            newUserList[currUid].muted = true;
  
            if (currFirebaseUser.adminMuted) {
              newUserList[currUid].adminMuted = true;
            }
          }
          else {
            if (remoteUser.audioTrack && !remoteUser.audioTrack.isPlaying && !newUserList[currUid].userMuted && !deafened && !currFirebaseUser.adminDeafened) {
              remoteUser.audioTrack.play();
            }
            newUserList[currUid].muted = false;
            newUserList[currUid].adminMuted = false;
          }
  
          if (currFirebaseUser.deafened || currFirebaseUser.adminDeafened) {
            newUserList[currUid].deafened = true;
  
            if (currFirebaseUser.adminDeafened) {
              newUserList[currUid].adminDeafened = true;
            }
          }
          else {
            newUserList[currUid].deafened = false;
            newUserList[currUid].adminDeafened = false;
          }
        }
  
        if (remoteUser.audioTrack && newUserList[currUid] && newUserList[currUid].userMuted) {
          remoteUser.audioTrack.stop();
        }
      });      

      return JSON.parse(JSON.stringify(newUserList));
    });
  }

  const updateUserMute = (isUserMuted) => {
    const newUserList = JSON.parse(JSON.stringify(users));
    const currUid = selectedUser.uid;
    newUserList[currUid].userMuted = isUserMuted;
    setUsers(JSON.parse(JSON.stringify(newUserList)));

    const remoteUsers = client.remoteUsers;

    for (let i = 0; i < remoteUsers.length; i++) {
      const remoteUser = remoteUsers[i];
      const remoteUserUid = remoteUser.uid.split("<~>")[1];
      if (remoteUserUid == currUid) {
        if (isUserMuted && remoteUser.audioTrack.isPlaying) {
          remoteUser.audioTrack.stop();
        }
        else if (!isUserMuted && !deafened && !remoteUser.audioTrack.isPlaying && !users[currUid].muted) {
          remoteUser.audioTrack.play();
        }

        break;
      }
    }
  }

  const adminMute = async (isAdminMuted) => {
    const docRef = doc(firestore, "voiceChannels", channelId, "voiceChannelUsers", selectedUser.uid);
    await setDoc(docRef, { adminMuted: isAdminMuted }, { merge: true });
  }

  const adminDeafen = async (isAdminDeafened) => {
    const docRef = doc(firestore, "voiceChannels", channelId, "voiceChannelUsers", selectedUser.uid);
    await setDoc(docRef, { adminMuted: isAdminDeafened, adminDeafened: isAdminDeafened }, { merge: true });
  }

  const mute = async (isMuted) => {
    const docRef = doc(firestore, "voiceChannels", channelId, "voiceChannelUsers", currentUser.uid);
    await setDoc(docRef, { muted: isMuted }, { merge: true, mergeFields: ["muted"] });
  }

  const deafen = async (isDeafend) => {
    const docRef = doc(firestore, "voiceChannels", channelId, "voiceChannelUsers", currentUser.uid);
    await setDoc(docRef, { deafened: isDeafend }, { merge: true, mergeFields: ["deafened"] });
    updateUserStatuses();
  }

  const adminKick = async () => {
    const docRef = doc(firestore, "voiceChannels", channelId, "voiceChannelUsers", selectedUser.uid);
    await setDoc(docRef, { adminKicked: true }, { merge: true });
    handleUserDropdownClose();
  }

  const adminBan = async () => {
    const docRef = doc(firestore, "users", selectedUser.uid);
    await setDoc(docRef, { isBanned: true }, { merge: true });
    const docRef2 = doc(firestore, "voiceChannels", channelId, "voiceChannelUsers", selectedUser.uid);
    await setDoc(docRef2, { joined: false }, { merge: true, mergeFields: ["joined"] });
    handleUserDropdownClose();
  }

  useEffect(() => {
    if (start) {
      updateUserStatuses();
    }
  }, [voiceChannelUsers, Object.keys(users).length, start])

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
            <img src={currentUser.photoURL ? currentUser.photoURL : `/Original Cardinal NFT ${imageIndex}.png`} className={clsx(styles.voiceImg, users[currentUser.uid].speaking && !muted ? styles.speakingImg : "")} />
            <span className={styles.voiceUsername}>{getShortenedUsername(currentUserData.username)}</span>
            {deafened && !users[currentUser.uid].adminDeafened && <HeadsetOffIcon className={styles.voiceUserIcon} />}
            {users[currentUser.uid].adminDeafened && <HeadsetOffIcon className={clsx(styles.voiceUserIcon, "text-danger")} />}
            {muted && !users[currentUser.uid].adminMuted && <MicOffIcon className={styles.voiceUserIcon} />}
            {users[currentUser.uid].adminMuted && <MicOffIcon className={clsx(styles.voiceUserIcon, "text-danger")} />}
          </Grid>
        )
      }
      {
        start && track && Object.keys(users).filter((userUid) => userUid != currentUser.uid).map((userUid) => {
          return (
            <Grid item xs={12} className={clsx("pt-2 pb-2", styles.voiceUserGridItem)} onClick={(e) => handleVoiceUserClicked(e, userUid)}>
              <img src={users[userUid].photoURL} className={clsx(styles.voiceImg, users[userUid].speaking && !users[userUid]?.muted && !users[userUid].userMuted ? styles.speakingImg : "")} />
              <span className={styles.voiceUsername}>{getShortenedUsername(users[userUid].username)}</span>
              {users[userUid]?.deafened && !users[userUid]?.adminDeafened && <HeadsetOffIcon className={styles.voiceUserIcon} />}
              {users[userUid]?.adminDeafened && <HeadsetOffIcon className={clsx(styles.voiceUserIcon, "text-danger")} />}
              {users[userUid]?.muted && !users[userUid]?.adminMuted && !users[userUid].userMuted && <MicOffIcon className={styles.voiceUserIcon} />}
              {(users[userUid].userMuted || users[userUid]?.adminMuted) && <MicOffIcon className={clsx(styles.voiceUserIcon, "text-danger")} />}
            </Grid>
          )
        })
      }

      <Menu anchorEl={anchorEl} open={userDropdownOpen} onClose={handleUserDropdownClose} TransitionComponent={Fade}
        className="accountDropDownMenu" sx={{
            marginTop: '0px'
        }}>
        {
          <div>
            {
              users[selectedUser.uid]?.userMuted ? (
                <MenuItem onClick={() => updateUserMute(false)} className={styles.accountDropdownMenuItem}>Unmute for Me</MenuItem>          
              )
              :
              (
                <MenuItem onClick={() => updateUserMute(true)} className={styles.accountDropdownMenuItem}>Mute for Me</MenuItem>          
              )
            }  
          </div>
        }
        {
          currentUserData.isAdmin && (
            <div>
              {
                users[selectedUser.uid]?.adminMuted && (
                  <MenuItem onClick={() => adminMute(false)} className={styles.accountDropdownMenuItem}>Unmute</MenuItem>
                )
              }
              {
                !users[selectedUser.uid]?.adminMuted && (
                  <MenuItem onClick={() => adminMute(true)} className={styles.accountDropdownMenuItem}>Mute</MenuItem>
                )
              }
              {
                users[selectedUser.uid]?.adminDeafened && (
                  <MenuItem onClick={() => adminDeafen(false)} className={styles.accountDropdownMenuItem}>Undeafen</MenuItem>
                )
              }
              {
                !users[selectedUser.uid]?.adminDeafened && (
                  <MenuItem onClick={() => adminDeafen(true)} className={styles.accountDropdownMenuItem}>Deafen</MenuItem>
                )
              }
              <MenuItem onClick={() => adminKick()} className={clsx(styles.accountDropdownMenuItem, "text-danger")}>Kick</MenuItem>
              <MenuItem onClick={() => adminBan()} className={clsx(styles.accountDropdownMenuItem, "text-danger")}>Ban</MenuItem>            
            </div>
          )
        }
      </Menu>
    </Grid>
  );
}