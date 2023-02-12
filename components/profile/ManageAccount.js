import { useState } from "react";
import { Button, Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
        FormControl, InputLabel, OutlinedInput, CircularProgress } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import clsx from "clsx";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { VscAccount } from "react-icons/vsc";
import { IoIosArrowForward, IoIosArrowUp } from "react-icons/io";

import styles from '../../styles/Community.module.css';

import { useAuth } from "../../contexts/AuthContext";
import { storage } from '../../firebase-vars';

export default function ManageAccount() {
    const { currentUser, currentUserData, updateUserData, updateProfilePicture } = useAuth();

    const fields = ["Username", "Email", "Wallet Address", "Discord Username"];

    const fieldToDBName = {
        "Username": "username",
        "Email": "email",
        "Wallet Address": "walletAddress",
        "Discord Username": "discordUsername"
    }

    const fieldToMaxLength = {
        "Username": 32,
        "Email": 50,
        "Wallet Address": 50,
        "Discord Username": 50        
    }

    const [openSetting, setOpenSetting] = useState("");
    const [updatingField, setUpdatingField] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");
    const [updateFail, setUpdateFail] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [updatingProfileImage, setUpdatingProfileImage] = useState(false);
    const [newFields, setNewFields] = useState({
        "Username": "",
        "Email": "",
        "Wallet Address": "",
        "Discord Username": ""
    });

    const updateSettingOpen = (setting) => {
        if (openSetting == setting) {
            setOpenSetting("");
        }
        else {
            setOpenSetting(setting);

            const fieldDBName = fieldToDBName[setting];
            if (newFields[setting] == "" && Object.keys(currentUserData).includes(fieldDBName)) {
                setNewFields({...newFields, [setting]: currentUserData[fieldDBName]});
            }
        }
    }

    const updateNewField = (field, newFieldValue) => {
        if (newFieldValue.length > fieldToMaxLength[field]) {
            return;
        }

        setNewFields({...newFields, [field]: newFieldValue});
    }

    const submitField = async (field) => {
        setUpdatingField(field);
        updateUserData(fieldToDBName[field], newFields[field]).then(async (response) => {
            setUpdatingField("");
            setOpenSetting("");
            setUpdateFail("");
            setUpdateSuccess(`Successfully updated ${field.toLowerCase()} to ${newFields[field]}`);
            setNewFields({...newFields, [field]: ""});
        })
        .catch((error) => {
            console.log(error);
            setUpdatingField("");
            setOpenSetting("");
            setUpdateSuccess("");
            setUpdateFail(`Failed to updated ${field.toLowerCase()} to ${newFields[field]}`);
            setNewFields({...newFields, [field]: ""});
        })
    }

    const profileImageUpdated = (e) => {
        const { photoURL } = currentUser;
        console.log(photoURL);

        const newImage = e.target.files[0];
        if (newImage) {
            if (newImage.size <= 500000) {
                setProfileImage(newImage);
                console.log(newImage);
            }
            else {
                setUpdateSuccess("");
                setUpdateFail("Image too large to upload! Must be less than 500 KB.");
            }
        }
    }

    const revertImageUpload = () => {
        setProfileImage(null);
    }

    const uploadAndSetProfileImage = () => {
        if (profileImage) {
            const uploadTask = uploadBytesResumable(ref(storage, `images/${currentUser.uid}-${profileImage.name}`), profileImage);
            setUpdatingProfileImage(true);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                },
                error => {
                    setUpdateSuccess("");
                    setUpdateFail("Failed to change profile picture");
                    setUpdatingProfileImage(false);
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((url) => {
                        updateProfilePicture(url).then((response) => {
                            setUpdateFail("");
                            setProfileImage(null);
                            setUpdateSuccess("Profile picture updated successfully!");
                            setUpdatingProfileImage(false);
                        })
                        .catch((error) => {
                            setUpdateSuccess("");
                            setUpdateFail("Failed to change profile picture");
                            setUpdatingProfileImage(false);
                            console.log(error);
                        })
                    })
                }
            );
        }
    }

    return currentUser && (
        <Grid container justifyContent="center" alignItems="center" className="mt-5">
            <Snackbar open={updateSuccess != ""} autoHideDuration={4000} onClose={() => {setUpdateSuccess("")}}>
                <MuiAlert elevation={6} variant="filled" onClose={() => {setUpdateSuccess("")}} severity="success" sx={{ width: '100%' }} className="mobileSnackbarTextSize" >
                    {updateSuccess}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={updateFail != ""} autoHideDuration={4000} onClose={() => {setUpdateFail("")}}>
                <MuiAlert elevation={6} variant="filled" onClose={() => {setUpdateFail("")}} severity="error" sx={{ width: '100%' }} className="mobileSnackbarTextSize" >
                    {updateFail}
                </MuiAlert>
            </Snackbar>
            <Grid item xs={1}>
                {!profileImage && (currentUser.photoURL ? <img src={currentUser.photoURL} className={styles.profileImage} width="75" height="75" /> : <VscAccount className={styles.profileAccountIcon} />)}
                {profileImage && <img src={URL.createObjectURL(profileImage)} className={styles.profileImage} width="75" height="75" />}
            </Grid>
            <Grid item xs={2}>
                <Typography variant="h3">
                    {currentUserData && currentUserData["username"] ? currentUserData["username"] : "Username Not Set"}
                </Typography>
                <Typography variant="p">
                    {currentUserData && currentUserData["email"] ? currentUserData["email"] : "Email Not Set"}
                </Typography>
            </Grid>
            <Grid item xs={1}></Grid>
            {
                !profileImage && (
                    <Grid item xs={2}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="change-profile-picture"
                            multiple={false}
                            type="file"
                            onChange={profileImageUpdated}
                        />
                        <label htmlFor="change-profile-picture">
                            <Button variant="contained" component="span">
                                Change Profile Picture
                            </Button>
                        </label>                 
                    </Grid>
                )
            }
            {
                profileImage && (
                    <>
                        {
                            !updatingProfileImage && (
                                <Grid item xs={1}>
                                    <Button variant="outlined" onClick={revertImageUpload}>
                                        Revert
                                    </Button>                        
                                </Grid>
                            )
                        }
                        <Grid item xs={updatingProfileImage ? 2 : 1}>
                            <Button variant="contained" onClick={uploadAndSetProfileImage}>
                                {!updatingProfileImage && "Confirm"}
                                {updatingProfileImage && <CircularProgress size={20} color="secondary" className={styles.progress}/>}
                                {updatingProfileImage && <>&nbsp; Uploading...</>}
                            </Button>                        
                        </Grid>
                    </>
                )
            }
            <Grid item xs={12}></Grid>
            <Grid item xs={6} className="mt-5">
                <TableContainer component={Paper} style={{ borderRadius: 18}}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                        <TableRow className={styles.profileTableRow}>
                            <TableCell align="left" className="pb-4 pt-4">
                                <Typography variant="h3" className={styles.profileInfoHeader}>
                                    Profile Info
                                </Typography>
                            </TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                fields.map((field) => (
                                    <TableRow
                                    className={clsx(styles.profileTableRow, openSetting != field ? styles.profileTableRowHover : "")}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    onClick={openSetting != field ? () => updateSettingOpen(field) : () => {}}
                                    >
                                        <TableCell align="left" className="pb-4 pt-4">
                                            <div onClick={() => updateSettingOpen(field)} className={styles.profileTableNoHover}>
                                                <div className={styles.accountVariableDiv}>
                                                    <Typography variant="h3" className={styles.fieldLabel}>
                                                        {field}
                                                    </Typography>
                                                </div>
                                                {
                                                    openSetting != field && (
                                                        <div className={styles.accountValueDiv}>
                                                            <Typography variant="h3">
                                                                <span className={styles.fieldValue}>
                                                                    {Object.keys(currentUserData).includes(fieldToDBName[field]) ? currentUserData[fieldToDBName[field]] : "Not Set"}
                                                                </span>
                                                                &nbsp;&nbsp;&nbsp; 
                                                                <IoIosArrowForward />
                                                            </Typography>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    openSetting == field && (
                                                        <div className={styles.accountValueDiv}>
                                                            <Typography variant="h3">
                                                                <IoIosArrowUp />
                                                            </Typography>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            {
                                                openSetting == field && (
                                                    <>
                                                        <FormControl sx={{ m: 0, width: '100%' }} className="mt-3" autoComplete="true" variant="outlined">
                                                            <InputLabel htmlFor={`new-${field}`}>New {field}</InputLabel>
                                                            <OutlinedInput
                                                                id={`new-${field}`}
                                                                value={newFields[field]}
                                                                onChange={(e) => updateNewField(field, e.target.value)}
                                                                label={`New ${field}`}
                                                            />
                                                        </FormControl>  
                                                        <Button variant="contained" onClick={() => submitField(field)} disabled={updatingField != "" || newFields[field] == ""} 
                                                            className={clsx("mt-3", styles.accountSubmitBtn, updatingField != field ? styles.accountSubmitBtnWidth : "")}>
                                                            {updatingField != field && "Save"}
                                                            {updatingField == field && <CircularProgress size={20} color="secondary" className={styles.progress}/>}
                                                            {updatingField == field && <>&nbsp; Saving...</>}
                                                        </Button>
                                                        <Button variant="outlined" onClick={() => updateSettingOpen(field)} className={clsx("mt-3", styles.accountCancelBtn)} disabled={updatingField != ""}>
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer> 
            </Grid>
        </Grid>   
    )
}