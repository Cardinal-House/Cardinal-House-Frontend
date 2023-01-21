import { useState, useEffect } from "react";
import clsx from "clsx";
import { Button, Menu, MenuItem, Fade, Grid, Typography, Divider } from '@mui/material';
import { VscAccount } from "react-icons/vsc";

import styles from '../../styles/Community.module.css';

import { useAuth } from "../../contexts/AuthContext";

export default function ProfileDropdown() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { currentUser, currentUserData, logout } = useAuth();

    const accountDropdownOpen = Boolean(anchorEl);

    const handleAccountBtnClick = (event) => {
      if (accountDropdownOpen) {
        handleAccountDropdownClose();
      }
      else {
        setAnchorEl(event.currentTarget);
      }
    };
    const handleAccountDropdownClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
        handleAccountDropdownClose();
    }, [currentUser])

    return (
        <div>
            {
                currentUser && (currentUser.photoURL 
                ? <img src={currentUser.photoURL} className={clsx(styles.profileImage, styles.hoverProfileImage)} 
                    width="50" height="50" onClick={handleAccountBtnClick} />
                : <VscAccount className={styles.iconSize} onClick={handleAccountBtnClick} />)
            }    

            <Menu anchorEl={anchorEl} open={accountDropdownOpen && currentUser} onClose={handleAccountDropdownClose} TransitionComponent={Fade}
                className="accountDropDownMenu" sx={{
                    marginTop: '15px'
                }}>
                <Grid container className={styles.accountMenuGrid}>
                    <Grid item xs={12}>
                        {
                            currentUser && currentUser.photoURL 
                            ? <img src={currentUser.photoURL} className={clsx(styles.profileImage, styles.smallProfileImage)} 
                                width="40" height="40" onClick={handleAccountBtnClick} />
                            : <VscAccount className={styles.dropDownAccountIcon} />
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3">
                            {currentUserData && currentUserData.username ? <>{currentUserData.username}</> : <>Username Not Set</>}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="p">
                        {currentUserData && currentUserData.email ? <>{currentUserData.email}</> : <>Email Not Set</>}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button href="/profile" target="_blank" rel="noreferrer" variant="outlined" className="mt-3 mb-2">
                            Manage Account
                        </Button>
                    </Grid>
                </Grid>
                <Divider className={styles.customDivider} />
                <MenuItem onClick={handleAccountDropdownClose} className={styles.accountDropdownMenuItem}>Settings</MenuItem>
                <Divider className={styles.customDivider} />
                <MenuItem onClick={handleAccountDropdownClose} className={styles.accountDropdownMenuItem}>Membership</MenuItem>
                <Divider className={styles.customDivider} />
                <MenuItem onClick={logout} className={clsx(styles.accountDropdownMenuItem, "text-danger")}>Logout</MenuItem>
            </Menu>
        </div>
    )
}