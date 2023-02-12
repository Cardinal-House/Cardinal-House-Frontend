import { useState } from 'react';
import { Button, Typography, Grid, TextField, FormControl, InputLabel, OutlinedInput, 
    InputAdornment, IconButton, ButtonGroup } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Modal } from "react-bootstrap";
import clsx from 'clsx';
import { FcGoogle } from 'react-icons/fc';
import { FaTwitter, FaWallet } from 'react-icons/fa';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from '../../styles/Community.module.css';

import { useAuth } from "../../contexts/AuthContext";
import ManageAccount from '../profile/ManageAccount';

export default function SignIn() {
    const { 
        signInWithGoogle, signInWithTwitter, signInMoralis, login, signup, 
        resetPassword, settingUpAccount, setSettingUpAccount 
    } = useAuth();

    const [signInModalOpen, setSignInModalOpen] = useState(false);
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState("");
    const [showInvalidLogin, setShowInvalidLogin] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [loggingInWithWeb3, setLoggingInWithWeb3] = useState(false);
    const [signingUp, setSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Failed to Login: Invalid Username or Password");
    const [passwordResetSent, setPasswordResetSent] = useState(false);

    const startLogin = () => {
        if (email == "" || password == "") {
            setShowInvalidLogin(true);
            setErrorMessage("Please Enter an Email and Password");
            return;
        }

        setLoggingIn(true);
        login(email, password).then((response) => {
            setShowInvalidLogin(false);
            setLoggingIn(false);
        })
        .catch((error) => {
            console.log(error);
            setShowInvalidLogin(true);
            setErrorMessage("Failed to Login: Invalid Username or Password");
            setLoggingIn(false);
        });
    }

    const startSignInWIthMoralis = () => {
        setLoggingInWithWeb3(true);
        signInMoralis(email, password).then((response) => {
            setShowInvalidLogin(false);
            setLoggingInWithWeb3(false);
        })
        .catch((error) => {
            console.log(error);
            setShowInvalidLogin(true);
            setLoggingInWithWeb3(false);
        });
    }

    const startAccountCreation = () => {
        if (email == "" || password == "" || passwordConfirmation == "") {
            setShowInvalidLogin(true);
            setErrorMessage("Please Enter an Email, Password, and Password Confirmation");
            return;
        }

        if (password !== passwordConfirmation) {
            setShowInvalidLogin(true);
            setErrorMessage("Password and Password Confirmation do not Match");
            return;
        }

        setLoggingIn(true);
        signup(email, password).then((response) => {
            setShowInvalidLogin(false);
            setLoggingIn(false);
            setSettingUpAccount(true);
            hideSignInModal();
        })
        .catch((error) => {
            console.log(error);
            setShowInvalidLogin(true);
            setErrorMessage("Failed to Create Account: Please Try Again Later");
            setLoggingIn(false);
        });
    }
    const startPasswordReset = () => {
        if (email == "") {
            setShowInvalidLogin(true);
            setErrorMessage("Please Supply an Email Address");
            return;
        }

        setLoggingIn(true);
        resetPassword(email, password).then((response) => {
            setShowInvalidLogin(false);
            setLoggingIn(false);
            setPasswordResetSent(true);
        })
        .catch((error) => {
            console.log(error);
            setShowInvalidLogin(true);
            setErrorMessage("Failed to Send Password Reset Email");
            setLoggingIn(false);
        });
    }

    const hideSignInModal = () => {
        setShowInvalidLogin(false);
        setSignInModalOpen(false);
    }

    const hideForgotPasswordModal = () => {
        setShowInvalidLogin(false);
        setForgotPasswordModal(false);        
    }

    const hideSettingUpAccountModal = () => {
        if (!loggingIn && !loggingInWithWeb3) {
            setSettingUpAccount(false);
        }
    }

    const showForgotPassword = () => {
        setSignInModalOpen(false);
        setForgotPasswordModal(true);
        setPasswordResetSent(false);
        setShowInvalidLogin(false);
    }

    const forgotPasswordBack = () => {
        setSignInModalOpen(true);
        setForgotPasswordModal(false);    
        setPasswordResetSent(false);    
        setShowInvalidLogin(false);
    }

    return (
        <>
            <Modal aria-labelledby="SetUpAccountModal" centered size="lg" show={settingUpAccount} onHide={hideSettingUpAccountModal} dialogClassName="finishAccountCreationModal" contentClassName="signInModal">
                <Modal.Body className={styles.modalDark}>
                    <Grid container justifyContent="center" alignItems="top" spacing={3} className={styles.accountFinishGrid}>
                        <Grid item xs={12}>
                            <Typography variant="h3" className={styles.finishAccountCreation}>
                                Finish Account Creation
                            </Typography>
                        </Grid>
                    </Grid>
                    <div className={styles.finishAccountDetailsDiv}>
                        <ManageAccount />
                    </div>
                    <div className="text-center mt-2 pb-3">
                        <Button variant="contained" className={styles.finishAccountSetupBtn} onClick={hideSettingUpAccountModal}>
                            Finish
                        </Button>
                    </div>
                </Modal.Body>
            </Modal> 

            <Modal aria-labelledby="SignInModal" centered size="md" show={signInModalOpen} onHide={hideSignInModal} contentClassName="signInModal">
                <Modal.Header closeButton closeVariant="white" className={clsx(styles.loginModal, styles.modalDark)} />
                <Modal.Body className={styles.modalDark}>
                    <Grid container justifyContent="center" alignItems="top" spacing={3} className={styles.loginModalGrid}>
                        <Grid item xs={12} className={styles.signInTypeGrid}>
                            <ButtonGroup variant="contained" className={clsx(styles.signInType, styles.optionMargin)}>
                                <Button className={clsx(styles.signInTypeBtn, !signingUp ? styles.selectedSignInType : "")}
                                    onClick={() => setSigningUp(false)}>
                                    Log In
                                </Button>
                                <Button className={clsx(styles.signInTypeBtn, signingUp ? styles.selectedSignInType : "")}
                                    onClick={() => setSigningUp(true)}>
                                    Sign Up
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Email" variant="outlined" className={styles.loginField} value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ m: 0, width: '100%' }} autoComplete="true" variant="outlined">
                                <InputLabel htmlFor="password-input">Password</InputLabel>
                                <OutlinedInput
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                        </Grid>
                        {signingUp && (
                            <Grid item xs={12}>
                                <FormControl sx={{ m: 0, width: '100%' }} autoComplete="true" variant="outlined">
                                    <InputLabel htmlFor="confirm-password-input">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        id="confirm-password-input"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            onClick={() => setShowPasswordConfirmation(!showPassword)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            edge="end"
                                            >
                                            {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        label="Confirm Password"
                                    />
                                </FormControl>
                            </Grid>
                        )}
                        {!signingUp && (
                            <Grid item xs={12}>
                                <Button variant="contained" className={styles.loginBtn} onClick={startLogin}>
                                    {!loggingIn ? "Login" : "Logging in..."}
                                </Button>
                            </Grid>
                        )}
                        {!signingUp && (
                            <Grid item xs={12}>
                                <Button variant="outlined" className={styles.forgotPasswordBtn} onClick={showForgotPassword}>
                                    Forgot Password?
                                </Button>
                            </Grid>
                        )}
                        {signingUp && (
                            <Grid item xs={12}>
                                <Button variant="contained" className={styles.loginBtn} onClick={startAccountCreation}>
                                    {!loggingIn ? "Create Account" : "Creating account..."}
                                </Button>
                            </Grid>                            
                        )}
                        {showInvalidLogin && (
                            <Grid item xs={12}>
                                <Typography variant="h6" className="text-danger">
                                    {errorMessage}
                                </Typography>
                            </Grid>   
                        )}                        
                        <Grid item xs={12}>
                            <div class={styles.separator}>OR</div>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" size="large" className={styles.signInBtn} onClick={signInWithGoogle}>
                                <FcGoogle className={styles.loginIcon} /> 
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                Continue with Google
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                            </Button>                            
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" size="large" className={styles.signInBtn} onClick={signInWithTwitter}>
                                <FaTwitter className={clsx(styles.twitterIcon, styles.loginIcon)} />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                Continue with Twitter
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </Button>                            
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" size="large" className={styles.signInBtn} onClick={startSignInWIthMoralis}>
                                <FaWallet className={clsx(styles.walletIcon, styles.loginIcon)} />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {
                                    loggingInWithWeb3 && (
                                        "Logging in with Wallet..."
                                    )
                                }
                                {
                                    !loggingInWithWeb3 && (
                                        "Continue with Wallet"
                                    )
                                }
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </Button>                            
                        </Grid>
                    </Grid>
                </Modal.Body>
            </Modal>    
            
            <Modal aria-labelledby="ForgotPasswordModal" centered size="md" show={forgotPasswordModal} onHide={hideForgotPasswordModal} contentClassName="signInModal">
                <Modal.Header closeButton closeVariant="white" className={clsx(styles.loginModal, styles.modalDark)}>
                    <ArrowBackIcon className={styles.backArrow} onClick={forgotPasswordBack} />
                </Modal.Header>
                <Modal.Body className={styles.modalDark}>
                    <Grid container justifyContent="center" alignItems="top" spacing={3} className={styles.loginModalGrid}>
                        <Grid item xs={12} className={styles.forgotPasswordHeader}>
                            <Typography variant="h3">
                                Forgot your Password?
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className="mb-3">
                            <Typography variant="p">
                            Enter your email below, you will receive an email with instructions on how to reset your password.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Email" variant="outlined" className={styles.loginField} value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" className={styles.loginBtn} onClick={startPasswordReset}>
                                {!loggingIn ? "Send Instructions" : "Sending Instructions..."}
                            </Button>
                        </Grid>
                        {showInvalidLogin && (
                            <Grid item xs={12}>
                                <Typography variant="h6" className="text-danger">
                                    {errorMessage}
                                </Typography>
                            </Grid>   
                        )}
                        {passwordResetSent && (
                            <Grid item xs={12}>
                                <Typography variant="h6" className="text-success">
                                    Password reset email sent!
                                </Typography>
                            </Grid>   
                        )}
                    </Grid>
                </Modal.Body>
            </Modal>    

            {
                !settingUpAccount && (
                    <>
                        <Button variant="contained" onClick={() => {setSigningUp(false);setSignInModalOpen(true)}} className={styles.signIn}>
                            Log in
                        </Button>
                        <Button variant="contained" onClick={() => {setSigningUp(true);setSignInModalOpen(true)}} className={styles.signIn}>
                            Sign Up
                        </Button>
                    </>
                )
            }
        </>
    )
}