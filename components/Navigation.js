import { Grid, Typography, Switch } from '@mui/material';
import { Navbar, Nav, Container } from 'react-bootstrap';
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
            
            gsap.to(window, 0.1, {scrollTo: {y: `#${section}`, offsetY: 150}});
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
        <Grid container justifyContent="center" className={styles.navGrid}>
            <Navbar expand="lg" bg={useDarkTheme ? "custom-dark" : "custom-light"} variant={useDarkTheme ? "dark" : "light"} className={clsx("m-auto", styles.navBar)}>
                <Navbar.Text className={styles.navBarBrand}>
                    <Container>
                        <Navbar.Brand href="/">
                            <img alt="" src="/CardinalHouseLogo.png" width="35" height="35" className={clsx(styles.logoImage, "align-top")} />
                            <Typography variant="p" className={styles.navBrandText}>
                                Cardinal House
                            </Typography>
                        </Navbar.Brand>
                    </Container>
                </Navbar.Text>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className={styles.navBarItems}>
                    <Nav>
                        <Nav.Link href="/" className={styles.navPadding}>
                            <Typography variant="h6" className={clsx(useDarkTheme ? styles.navbarDarkCustom : styles.navbarLightCustom, styles.navText)}>
                                Home
                            </Typography>
                        </Nav.Link>
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
                        <div className={styles.changeThemeDiv}>
                            {useDarkTheme ? <DarkModeIcon className={clsx(styles.darkModeIcon, styles.iconSizeTheme)} /> : <LightModeIcon className={styles.lightModeIcon} fontSize="large" />}
                            <Switch checked={useDarkTheme} color="primary" onChange={e => setUseDarkTheme(e.target.checked)} />
                        </div>
                        <IconContext.Provider value={{ color: useDarkTheme ? "#1649ff" : "#c50a0a" }} className={styles.socialIcons}>
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