import { Grid, Typography } from '@mui/material';
import { Navbar, Nav, Container } from 'react-bootstrap';
import clsx from 'clsx';
import { IconContext } from "react-icons";
import { FaDiscord, FaTwitter, FaTelegram, FaYoutube } from 'react-icons/fa';

import styles from '../styles/Navigation.module.css';

export default function ProjectInsightNavigation(props) {
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Navbar expand="lg" bg="custom-dark" variant="dark" className={clsx("m-auto", "projectInsightNavBar", styles.navBar)}>
                <Navbar.Text className={styles.navBarBrand} onClick={() => {window.location.href = `${window.location.origin}`}}>
                    <Container>
                        <Navbar.Brand className={styles.navBarBrand}>
                            <img alt="" src="/NewCardinalHouseLogo.png" width="50" height="50" className={clsx(styles.logoImage)} />
                            <Typography variant="p" className={styles.navBrandText}>
                                <b>Cardinal House</b>
                            </Typography>
                        </Navbar.Brand>
                    </Container>
                </Navbar.Text>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className={styles.navBarItems}>
                    <Nav className="darkThemeNav">
                        <Nav.Link className={styles.navPadding} >
                            <Typography variant="h6" className={clsx(styles.navbarDarkCustom, styles.navText, styles.desktopSpacing)}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </Typography>
                        </Nav.Link>   
                        <Nav.Link href="/" className={styles.navPadding} >
                            <Typography variant="h6" className={clsx(styles.navbarDarkCustom, styles.navText)}>
                                Home Page
                            </Typography>
                        </Nav.Link>
                        {
                            props.projectSearchClick && (
                                <Nav.Link onClick={props.projectSearchClick} className={styles.navPadding}>
                                    <Typography variant="h6" className={clsx(styles.navbarDarkCustom, styles.navText)}>
                                        Project Search
                                    </Typography>
                                </Nav.Link>                                
                            )
                        }  
                        <Nav.Link href="/educationcenter" className={styles.navPadding} >
                            <Typography variant="h6" className={clsx(styles.navbarDarkCustom, styles.navText)}>
                                Education Center
                            </Typography>
                        </Nav.Link>
                        <Nav.Link href="https://cardinal-house.gitbook.io/cardinal-house-whitepaper-v2/" target="_blank" className={styles.navPadding}>
                            <Typography variant="h6" className={clsx(styles.navbarDarkCustom, styles.navText)}>
                                White Paper
                            </Typography>
                        </Nav.Link>
                        <Nav.Link href="/dapp" className={styles.navPadding} >
                            <Typography variant="h6" className={clsx(styles.navbarDarkCustom, styles.navText)}>
                                DApp
                            </Typography>
                        </Nav.Link>                                              
                        <Nav.Link className={styles.navPadding} >
                            <Typography variant="h6" className={clsx(styles.navbarDarkCustom, styles.navText, styles.desktopSpacing)}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </Typography>
                        </Nav.Link>                     
                            <IconContext.Provider value={{ color: "#00FFC8" }} className={styles.socialIcons}>
                                <div className={styles.socialIcons}>
                                    <div className={styles.socialIcon}>
                                        <a href="https://discord.gg/Sw5qsDx2kr" target="_blank" rel="noreferrer">
                                            <FaDiscord className={styles.iconSize} />
                                        </a>
                                    </div>
                                    <div className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                                        <a href="https://twitter.com/CardinalHouse1" target="_blank" rel="noreferrer">
                                            <FaTwitter className={styles.iconSize} />
                                        </a>
                                    </div>
                                    <div className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                                        <a href="https://www.youtube.com/channel/UC1dUX-MzSWJ046vYP2215-g" target="_blank" rel="noreferrer">
                                            <FaYoutube className={styles.iconSize} />
                                        </a>
                                    </div>
                                </div>
                            </IconContext.Provider>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Grid>
    )
}