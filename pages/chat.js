import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { AiFillHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { GiSpeaker } from "react-icons/gi";
import { collection, query } from "firebase/firestore";
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';

import { Grid, Typography, Collapse, Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { doc, setDoc } from "firebase/firestore";

import Footer from '../components/Footer';
import SignIn from '../components/auth/SignIn';
import ProfileDropdown from '../components/auth/ProfileDropdown';
import ChatRoom from '../components/chat/ChatRoom';

import { useAuth } from "../contexts/AuthContext";
import { firestore } from '../firebase-vars';

import styles from '../styles/Community.module.css';

const VoiceCall = dynamic(() => import('../components/voice/VoiceCall'), { ssr: false });

const drawerWidth = 300;

export default function Chat(props) {
  const { window2 } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(["Cardinal Info"]);
  const [selectedTextChannel, setSelectedTextChannel] = useState({name: "Announcements", id: "9lNxSA0wSoRkaiEUybf0"});
  const [joinedVoiceChannel, setJoinedVoiceChannel] = useState({});
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [controlsDisabled, setControlsDisabled] = useState(false);
  const [inVoiceChannel, setInVoiceChannel] = useState(false);

  const { currentUser, settingUpAccount, logoutRequested, isConnected, setIsConnected } = useAuth();

  const textChannelsRef = collection(firestore, "textChannels");
  const textChannelsQuery = query(textChannelsRef);

  const voiceChannelsRef = collection(firestore, "voiceChannels");
  const voiceChannelsQuery = query(voiceChannelsRef);

  // const [textChannels] = useCollectionData(channelsQuery);
  const [textChannels, textChannelsLoading, textChannelsError] = useCollection(textChannelsQuery);
  const [voiceChannels, voiceChannelsLoading, voiceChannelsError] = useCollection(voiceChannelsQuery);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };  

  const hideCategory = (category, expandedCategoriesList) => {
    const filteredExpandedCategories = expandedCategoriesList.filter((currCategory) => currCategory != category);
    return filteredExpandedCategories;
  }

  const showCategory = (category, expandedCategoriesList) => {
    if (expandedCategoriesList.includes(category)) {
        return expandedCategoriesList;
    }

    let newExpandedCategories = JSON.parse(JSON.stringify(expandedCategoriesList));

    if (!newExpandedCategories) {
        newExpandedCategories = [];
    }

    newExpandedCategories.push(category);
    return newExpandedCategories;
  }

  const updateCategory = (category) => {
    if (expandedCategories.includes(category)) {
        const filteredExpandedCategories = hideCategory(category, expandedCategories);
        setExpandedCategories(filteredExpandedCategories);
    }
    else {
        const newExpandedCategories = showCategory(category, expandedCategories);
        setExpandedCategories(newExpandedCategories);
    }
  }

  const updateSelectedTextChannel = (channel) => {
    setSelectedTextChannel(channel);
  }

  const getAttribute = (d, attr) => {
    return d._document.data.value.mapValue.fields[attr].stringValue;
  }

  const alphSort = (a, b) => {
    if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;    
  }

  const joinVoiceChannel = async (voiceChannel) => {
    const agoraVoiceChannelName = voiceChannel.agoraName;

    setJoinedVoiceChannel(voiceChannel);
    setInVoiceChannel(true);
    setIsConnected(true);

    const docRef = doc(firestore, "voiceChannels", voiceChannel.id, "users", currentUser.uid);
    await setDoc(docRef, { muted: muted, deafened: deafened, joined: true }, { merge: true });
  }

  const enableControlsAfterWait = () => {
    setTimeout(() => {
        setControlsDisabled(false);
      }, "1000")
  }

  const updateMuted = () => {
    setMuted(!muted);

    if (deafened) {
        setDeafened(false);
    }

    setControlsDisabled(true);
    enableControlsAfterWait();
  }

  const updateDeafened = () => {
    if (deafened) {
        setMuted(false);
    }
    else {
        setMuted(true);
    }

    setDeafened(!deafened);
    setControlsDisabled(true);
    enableControlsAfterWait();
  }

  const getChannels = () => {
    const currChannels = {"Cardinal Info": []};

    if (!textChannels || !textChannels?.docs) {
        return currChannels;
    }

    textChannels.docs.forEach(textChannel => {
        const currCategory = getAttribute(textChannel, "category");

        if (Object.keys(currChannels).includes(currCategory)) {
            currChannels[currCategory].push({name: getAttribute(textChannel, "name"), type: "text", id: textChannel.id});
        }
        else {
            currChannels[currCategory] = [{name: getAttribute(textChannel, "name"), type: "text", id: textChannel.id}];
        }
    });

    Object.keys(currChannels).forEach((category) => {
        currChannels[category].sort(alphSort);
    });

    if (!voiceChannels || !voiceChannels?.docs) {
        return currChannels;
    }

    voiceChannels.docs.forEach(voiceChannel => {
        const currCategory = getAttribute(voiceChannel, "category");

        if (Object.keys(currChannels).includes(currCategory)) {
            currChannels[currCategory].push({name: getAttribute(voiceChannel, "name"), agoraName: getAttribute(voiceChannel, "agoraName"), type: "voice", id: voiceChannel.id});
        }
        else {
            currChannels[currCategory] = [{name: getAttribute(voiceChannel, "name"), agoraName: getAttribute(voiceChannel, "agoraName"), type: "voice", id: voiceChannel.id}];
        }
    });    

    return currChannels;
  }

  useEffect(() => {
    if (logoutRequested) {
        setJoinedVoiceChannel({});
    }
  }, [logoutRequested])

  const currChannels = getChannels();

  const drawer = (
    <div className={clsx("communityDrawer", styles.navDrawer)}>
      <Grid container justifyContent="center" alignItems="center" spacing={2} className={styles.toolbarDiv}>
          <Grid item xs={2}>
            <img alt="" src="/NewCardinalHouseLogo.png" width="45" height="45" className={clsx(styles.logoImage)} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" className={styles.toolbarText}>
                Cardinal House
            </Typography>
          </Grid>
      </Grid>

      <List>
        <ListItem key="Back to Homepage" button className={styles.bigBtn} onClick={() => {window.location.href = `${window.location.origin}`}}>
            <ListItemIcon>
                <AiFillHome className={styles.navIcons} />
            </ListItemIcon>
            <ListItemText primary="Back to Home Page" />
        </ListItem>
        {
            Object.keys(currChannels).map((category) => (
                <div key={category}>
                <ListItem disablePadding>
                    <ListItemButton className="categoryBtn" onClick={() => updateCategory(category)}>
                        <ListItemText primary={
                                <Typography variant="p">
                                    <BiCategory /> &nbsp;&nbsp;&nbsp;
                                    {category}
                                </Typography>
                        } />
                        {expandedCategories.includes(category) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={expandedCategories.includes(category)} timeout="auto" unmountOnExit>
                    {
                        currChannels[category].map((currChannel) => (
                            <>
                                {
                                    currChannel.type == "text" && (
                                        <ListItem key={currChannel.id} className={clsx(selectedTextChannel.id == currChannel.id ? styles.currSelected : "")} disablePadding>
                                            <ListItemButton className="channelBtn" onClick={() => updateSelectedTextChannel(currChannel)}>
                                                <ListItemText primary={
                                                    <Typography variant="p">
                                                        <BsFillChatSquareTextFill /> &nbsp;&nbsp;&nbsp;
                                                        {currChannel.name}
                                                    </Typography>
                                                }/>
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                }
                                {
                                    currChannel.type == "voice" && (
                                        <ListItem key={currChannel.id} className={clsx(joinedVoiceChannel.id == currChannel.id ? styles.currSelected : "")} disablePadding>
                                            <Grid container justifyContent="center" alignItems="center">
                                                <Grid item xs={12}>
                                                    <ListItemButton className="channelBtn" onClick={() => joinVoiceChannel(currChannel)}>
                                                        <ListItemText primary={
                                                            <Typography variant="p">
                                                                <GiSpeaker style={{fontSize: '25px'}} /> &nbsp;&nbsp;&nbsp;
                                                                {currChannel.name}
                                                            </Typography>
                                                        }/>
                                                    </ListItemButton>
                                                </Grid>
                                                {
                                                joinedVoiceChannel.id == currChannel.id && isConnected && currentUser && currentUser.uid && (
                                                    <Grid item xs={12}>
                                                        <VoiceCall channelName={currChannel.agoraName} channelId={currChannel.id} setJoinedVoiceChannel={setJoinedVoiceChannel}
                                                            muted={muted} deafened={deafened} inVoiceChannel={inVoiceChannel} setInVoiceChannel={setInVoiceChannel} />
                                                    </Grid>
                                                )
                                                }   
                                            </Grid>
                                        </ListItem>
                                    )
                                }
                            </>
                        ))
                    }
                </Collapse>
                </div>
            ))
        }     
      </List>
        {
            <div className={styles.voiceControlsDiv}>
                <Button variant="contained" onClick={updateMuted} disabled={controlsDisabled}
                    className={clsx(styles.emojiBtn, styles.voiceControlBtn, controlsDisabled ? styles.voiceControlBtnDisabled : "")}>
                    {muted ? <MicOffIcon /> : <MicIcon />}
                </Button> 
                <Button variant="contained" onClick={updateDeafened} disabled={controlsDisabled}
                    className={clsx(styles.emojiBtn, styles.voiceControlBtn, controlsDisabled ? styles.voiceControlBtnDisabled : "")}>
                    {deafened ? <HeadsetOffIcon /> : <HeadphonesIcon />}
                </Button>
                {
                    inVoiceChannel && (
                        <Button variant="contained" className={clsx(styles.emojiBtn, styles.voiceControlBtn)} onClick={() => setInVoiceChannel(false)}>
                            <ExitToAppIcon />
                        </Button> 
                    )
                }
            </div>  
        }    
    </div>
  );

  const container = window2 !== undefined ? () => window2().document.body : undefined;

  return (
    <>
            <Box sx={{ display: 'flex' }} className="educationCenterBox">
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar className={styles.toolbar}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Chat Prototype
                </Typography>
                {(!currentUser || settingUpAccount) && <SignIn />}
                <ProfileDropdown />
                </Toolbar>
            </AppBar>            
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                className={styles.drawerContainer}
            >
                <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                className={styles.drawerContainer}
                >
                {drawer}
                </Drawer>
                <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                }}
                className={styles.drawerContainer}
                open
                >
                {drawer}
                </Drawer>
            </Box>
        
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 0, width: { xs: `calc(100% - ${drawerWidth}px)` } }}
                className={styles.mainContent}
            >
                <Toolbar />

                {currentUser && <ChatRoom selectedTextChannel={selectedTextChannel} />}
            </Box>
        </Box>
    </>
  );
}
