import { Grid, Typography, Switch, Tooltip } from '@mui/material';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useEffect } from 'react';
import clsx from 'clsx';
import { gsap } from "gsap";
import { IconContext } from "react-icons";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { FaDiscord, FaTwitter, FaTelegram, FaYoutube } from 'react-icons/fa';

import styles from '../styles/Navigation.module.css';

export default function Navigation({useDarkTheme, setUseDarkTheme}) {
    gsap.registerPlugin(ScrollToPlugin);

    const sections = ["community", "education", "services", "roadmap"];

    const moveToSection = (section) => {
        if (window.location.pathname == "/") {
            // gsap.to(window, {duration: 0.1, scrollTo:`#${section}`});
            
            gsap.to(window, 0.1, {scrollTo: {y: `#${section}`, offsetY: 75}});
        }
        else {
            window.location.href = `${window.location.origin}/?section=${section}`;
        }
    }

    useEffect(() => {
        const currUrl = window.location.href;
        const currUrlSplit = currUrl.split("?section=");
        if (currUrlSplit.length > 1) {
            const urlSection = currUrlSplit[1];
            if (sections.includes(urlSection)) {
                gsap.to(window, {duration: 0.1, scrollTo:`#${urlSection}`});
            }
        }
    }, []);

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Navbar expand="lg" bg={useDarkTheme ? "custom-dark" : "custom-light"} variant={useDarkTheme ? "dark" : "light"} className={clsx("m-auto", styles.navBar)}>
                <Navbar.Text className={styles.navBarBrand}>
                    <Container>
                        <Navbar.Brand className={styles.navBarBrand}>
                            <img alt="" src="/CardinalLogoLight.png" width="50" height="50" className={clsx(styles.logoImage)} />
                            <Typography variant="p" className={styles.navBrandText}>
                                <b>Cardinal House</b>
                            </Typography>
                        </Navbar.Brand>
                    </Container>
                </Navbar.Text>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className={styles.navBarItems}>
                    <Nav>
                        {/*
                        <Nav.Link className={styles.navPadding} onClick={() => moveToSection("community")}>
                            <Typography variant="h6" className={clsx(useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                                Community
                            </Typography>
                        </Nav.Link>
                        <Nav.Link className={styles.navPadding} onClick={() => moveToSection("education")}>
                            <Typography variant="h6" className={clsx(useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                                Education
                            </Typography>
                        </Nav.Link>
                        <Nav.Link className={styles.navPadding} onClick={() => moveToSection("services")}>
                            <Typography variant="h6" className={clsx(useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                                Services
                            </Typography>
                        </Nav.Link>
                        */}
                        <NavDropdown title="About" className={clsx(styles.navDropdown, styles.navPadding, useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                            <NavDropdown.Item onClick={() => moveToSection("community")}>Community</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => moveToSection("education")}>Education</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => moveToSection("services")}>Services</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => moveToSection("token")}>Cardinal Token</NavDropdown.Item>

                        </NavDropdown>
                        <Nav.Link href="/educationcenter" className={styles.navPadding} >
                            <Typography variant="h6" className={clsx(useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                                Education Center
                            </Typography>
                        </Nav.Link>
                        <Nav.Link className={styles.navPadding} onClick={() => moveToSection("roadmap")}>
                            <Typography variant="h6" className={clsx(useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                                Roadmap
                            </Typography>
                        </Nav.Link>
                        <Nav.Link href="https://chain-estate.gitbook.io/cardinal-house-whitepaper/" target="_blank" className={styles.navPadding}>
                            <Typography variant="h6" className={clsx(useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                                White Paper
                            </Typography>
                        </Nav.Link>
                        <Nav.Link href="/dapp" className={styles.navPadding} >
                            <Typography variant="h6" className={clsx(useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                                DApp
                            </Typography>
                        </Nav.Link>
                        <Tooltip title="Dark Theme Coming Soon!">
                            <div className={styles.changeThemeDiv}>
                                {useDarkTheme ? <DarkModeIcon className={clsx(styles.darkModeIcon, styles.iconSizeTheme)} /> : <LightModeIcon className={styles.lightModeIcon} fontSize="large" />}
                                <Switch checked={useDarkTheme} disabled={true} color="primary" onChange={e => setUseDarkTheme(e.target.checked)} />
                            </div>
                        </Tooltip>
                        <IconContext.Provider value={{ color: useDarkTheme ? "#ff0000" : "#ff0000" }} className={styles.socialIcons}>
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
                                <div className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                                    <a href="https://t.me/CardinalHousechat" target="_blank" rel="noreferrer">
                                        <FaTelegram className={styles.iconSize} />
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