import { Button, Grid, Typography } from '@mui/material';
import clsx from "clsx";

import styles from '../../styles/Community.module.css';

export default function Settings() {
    return (
        <Grid container justifyContent="center" alignItems="center" className="mt-5 text-center">
            <Grid item xs={12}>
                <Typography variant="h1">
                    Coming Soon!
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h3">
                    Here is where you will be able to update settings for your account on the Coin Cardinal platform.
                    The manage account section is for editing your profile while this section will be for updating
                    site preferences such as the theme or site layout.
                </Typography>
            </Grid>
        </Grid>   
    )
}