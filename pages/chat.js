import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import clsx from 'clsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiFillHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { collection, query } from "firebase/firestore";
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';

import { Grid, Typography, Collapse } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
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

import Footer from '../components/Footer';
import SignIn from '../components/auth/SignIn';
import SignOut from '../components/auth/SignOut';
import ChatRoom from '../components/chat/ChatRoom';

import { auth } from '../firebase-vars';
import { firestore } from '../firebase-vars';

import styles from '../styles/Community.module.css';

const drawerWidth = 300;

export default function Chat(props) {
  const { window2 } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(["Cardinal Info"]);
  const [selectedTextChannel, setSelectedTextChannel] = useState({name: "Announcements", id: "9lNxSA0wSoRkaiEUybf0"});

  const [user] = useAuthState(auth);  

  const channelsRef = collection(firestore, "textChannels");
  const channelsQuery = query(channelsRef);

  // const [textChannels] = useCollectionData(channelsQuery);
  const [textChannels, loading, error] = useCollection(channelsQuery);

  // console.log(textChannels ? textChannels.docs[0] : "")
  // console.log(textChannels ? textChannels.docs[0].id : "")

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

  const getTextChannels = () => {
    const currTextChannels = {"Cardinal Info": []};

    if (!textChannels || !textChannels?.docs) {
        return currTextChannels;
    }

    textChannels.docs.forEach(textChannel => {
        const currCategory = getAttribute(textChannel, "category");

        if (Object.keys(currTextChannels).includes(currCategory)) {
            currTextChannels[currCategory].push({name: getAttribute(textChannel, "name"), id: textChannel.id});
        }
        else {
            currTextChannels[currCategory] = [{name: getAttribute(textChannel, "name"), id: textChannel.id}];
        }
    });

    Object.keys(currTextChannels).forEach((category) => {
        currTextChannels[category].sort(alphSort);
    });

    return currTextChannels;
  }

  const currTextChannels = getTextChannels();

  const drawer = (
    <div className={styles.navDrawer}>
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

      <Divider />
      <List>
        <ListItem key="Back to Homepage" button className={styles.bigBtn} onClick={() => {window.location.href = `${window.location.origin}`}}>
            <ListItemIcon>
                <AiFillHome className={styles.navIcons} />
            </ListItemIcon>
            <ListItemText primary="Back to Home Page" />
        </ListItem>
        {
            Object.keys(currTextChannels).map((category) => (
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
                        currTextChannels[category].map((currTextChannel) => (
                            <ListItem key={currTextChannel.id} className={clsx(selectedTextChannel.id == currTextChannel.id ? styles.currSelected : "")} disablePadding>
                                <ListItemButton className="channelBtn" onClick={() => updateSelectedTextChannel(currTextChannel)}>
                                    <ListItemText primary={
                                        <Typography variant="p">
                                            <BsFillChatSquareTextFill /> &nbsp;&nbsp;&nbsp;
                                            {currTextChannel.name}
                                        </Typography>
                                    }/>
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </Collapse>
                </div>
            ))
        }        
      </List>
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
                {user ? <SignOut /> : <SignIn />}
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

                {user && <ChatRoom selectedTextChannel={selectedTextChannel} />}
                
                <Grid container justifyContent="center" alignItems="center" spacing={4}>
                    <Grid item xs={12}>

                    </Grid>
                </Grid>
            </Box>
        </Box>
    </>
  );
}
