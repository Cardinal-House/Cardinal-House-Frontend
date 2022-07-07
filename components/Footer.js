import { useEffect, useState } from 'react';
import clsx from 'clsx';

import styles from '../styles/Footer.module.css';

export default function Footer() {
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
    <footer className={clsx(styles.footer, footerColor != "default" ? styles.lightFooter : "")}>
        Copyright Cardinal House 2022
    </footer>
    )
}