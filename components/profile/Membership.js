import { Button, Grid, Typography } from '@mui/material';
import clsx from "clsx";

import styles from '../../styles/Community.module.css';

export default function Membership() {
    return (
        <Grid container justifyContent="center" alignItems="center" className="mt-5 text-center">
            <Grid item xs={12}>
                <Typography variant="h1">
                    Coming Soon!
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h3">
                    Here is where you will be able to get the status of your Cardinal Crew membership.
                    This will not be where you purchase your Cardinal Crew membership NFT - that will still be
                    on our DApp. However, once you are a Cardinal Crew member, you can come here to see when
                    you will next be charged for your membership and how long you have been a member for.
                </Typography>
            </Grid>
        </Grid>   
    )
}