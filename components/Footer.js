import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Typography } from '@mui/material';

import styles from '../styles/Footer.module.css';

export default function Footer(props) {
    const [footerColor, setFooterColor] = useState("default");

    useEffect(() => {
        if (window.location.href.includes("educationcenter")) {
            setFooterColor("white");
        }
        else {
            setFooterColor("default");
        }
    }, [])

    return (
    <footer className={clsx(styles.footer, footerColor != "default" && props.useDarkTheme ? styles.lightFooter : "")}>
        <Typography variant="p" className={props.useDarkTheme ? styles.darkThemeFooter : ""}>
            Copyright Cardinal House 2022
        </Typography>
    </footer>
    )
}