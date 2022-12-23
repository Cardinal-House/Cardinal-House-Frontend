import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import clsx from 'clsx';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, query, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AiFillHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";

import { Grid, Button, Typography, InputBase, Paper } from '@mui/material';
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

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import styles from '../styles/Chat.module.css';
const drawerWidth = 300;

const app = initializeApp({
    apiKey: "AIzaSyCparc8fNTAUhsEygb5gILejPSz2p9mL7M",
    authDomain: "cardinal-house-community.firebaseapp.com",
    projectId: "cardinal-house-community",
    storageBucket: "cardinal-house-community.appspot.com",
    messagingSenderId: "713295281156",
    appId: "1:713295281156:web:79f58b90b6725084f24951",
    measurementId: "G-6KRHNW8M7J"
})

const firestore = getFirestore(app);
const auth = getAuth(app);

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    return (
        <Button variant="contained" onClick={signInWithGoogle} className={styles.signIn}>
            Sign in with Google
        </Button>
    )
}

function SignOut() {
    return auth.currentUser && (
        <Button variant="contained" onClick={() => auth.signOut()} className={styles.signOut}>
            Sign Out
        </Button>        
    )
}

function ChatRoom() {
    const messageRef = collection(firestore, "messages");
    const messageQuery = query(messageRef, orderBy("createdAt"), limit(25));

    const [messages] = useCollectionData(messageQuery, {idField: 'id'});

    const dummy = useRef();
    const [formValue, setFormValue] = useState("");

    const sendMessage = async(e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await addDoc(messageRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <div className={styles.messageDiv}>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} /> )}
                <span ref={dummy}></span>
            </div>

            <Paper component="form" onSubmit={sendMessage} className={styles.chatForm}>
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Type here..." value={formValue}
                    onChange={(e) => setFormValue(e.target.value)} className={styles.chatInput} />
                <Button variant="contained" type="submit" className={styles.submitBtn}>
                    Send
                </Button>
            </Paper>  
        </>
    )
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

    return (
        <div className={clsx(styles.message, messageClass == "sent" ? styles.sentMessage : styles.receivedMessage)}>
            <img src={photoURL} className={styles.chatImg} />
            <Typography variant="p" className={styles.chatElement}>
                {text}
            </Typography>
        </div>
    )
}

export default function Chat(props) {
  const { window2 } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user] = useAuthState(auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };  

  const drawer = (
    <div className={styles.navDrawer}>
      <Grid container justifyContent="center" alignItems="center" spacing={2} className={styles.toolbarDiv}>
          <Grid item xs={2}>
            <Image alt="" src="/NewCardinalHouseLogo.png" width="50" height="50" className={clsx(styles.logoImage, "mt-1")} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" className={styles.toolbarText}>
                Cardinal House
            </Typography>
          </Grid>
      </Grid>

      <Divider />
      <List>
        <ListItem key="Introduction" disablePadding>
            {user ? <SignOut /> : <SignIn />}
        </ListItem>
        <ListItem key="Back to Homepage" button onClick={() => {window.location.href = `${window.location.origin}`}}>
            <ListItemIcon>
                <AiFillHome className={styles.navIcons} />
            </ListItemIcon>
            <ListItemText primary="Back to Home Page" />
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
                    Chat Prototype
                </Typography>
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

                {user && <ChatRoom />}
                
                <Grid container justifyContent="center" alignItems="center" spacing={4}>
                    <Grid item xs={12}>

                    </Grid>
                </Grid>
            </Box>
        </Box>
        <Footer useDarkTheme={true} />
    </>
  );
}
