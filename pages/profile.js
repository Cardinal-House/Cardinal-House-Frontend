import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import clsx from 'clsx';
import { AiFillHome } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { BsFillGearFill } from "react-icons/bs";
import { MdCardMembership } from "react-icons/md";
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
import ProfileDropdown from '../components/auth/ProfileDropdown';
import ManageAccount from '../components/profile/ManageAccount';
import Settings from '../components/profile/Settings';
import Membership from '../components/profile/Membership';

import { firestore } from '../firebase-vars';

import styles from '../styles/Community.module.css';

import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 300;

export default function Profile(props) {
  const { window2 } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPane, setSelectedPane] = useState("manageAccount");

  const { currentUser } = useAuth();

  const channelsRef = collection(firestore, "textChannels");
  const channelsQuery = query(channelsRef);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };  

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

      <List>
        <ListItem button className={clsx("mt-2", styles.bigBtn)} onClick={() => {window.location.href = `${window.location.origin}`}}>
            <ListItemIcon>
                <AiFillHome className={styles.navIcons} />
            </ListItemIcon>
            <ListItemText primary="Back to Home Page" />
        </ListItem>      
        <ListItem button className={styles.bigBtn} onClick={() => setSelectedPane("manageAccount")}>
            <ListItemIcon>
                <VscAccount className={styles.navIcons} />
            </ListItemIcon>
            <ListItemText primary="Manage Account" />
        </ListItem>      
        <ListItem button className={styles.bigBtn} onClick={() => setSelectedPane("settings")}>
            <ListItemIcon>
                <BsFillGearFill className={styles.navIcons} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
        </ListItem>      
        <ListItem button className={styles.bigBtn} onClick={() => setSelectedPane("membership")}>
            <ListItemIcon>
                <MdCardMembership className={styles.navIcons} />
            </ListItemIcon>
            <ListItemText primary="Membership" />
        </ListItem>      
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
                    Profile
                </Typography>
                {!currentUser && <SignIn />}
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

                {!currentUser && <div>Not Logged In</div>}

                {currentUser && selectedPane == "manageAccount" && <ManageAccount />}
                {currentUser && selectedPane == "settings" && <Settings />}
                {currentUser && selectedPane == "membership" && <Membership />}
            </Box>
        </Box>
    </>
  );
}
