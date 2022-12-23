import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
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
import dynamic from 'next/dynamic'

const VideoCall = dynamic(() => import('../components/VideoCall'), { ssr: false });

import styles from '../styles/Chat.module.css';
const drawerWidth = 300;

export default function Chat(props) {
  const { window2 } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inCall, setInCall] = useState(false);

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
                    Voice + Video Prototype
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

                {inCall ? (
                            <VideoCall className="mt-3" setInCall={setInCall} />
                        ) : (
                            <Button
                            variant="contained"
                            color="primary"
                            className="mt-3"
                            onClick={() => setInCall(true)}
                            >
                                Join Call
                            </Button>
                        )}                
            </Box>
        </Box>
        <Footer useDarkTheme={true} />
    </>
  );
}
