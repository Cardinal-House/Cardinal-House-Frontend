import Image from 'next/image';
import { Grid, Typography } from '@mui/material';
import clsx from 'clsx';

import ProjectInsightNavigation from '../components/ProjectInsightNavigation';
import styles from '../styles/EducationCenter.module.css';

export default function termsofservice(props) {
    return (
        <>
        <ProjectInsightNavigation />
        <Grid container justifyContent="center" className={clsx(styles.mainGrid, "mt-5 mb-5")} style={{minHeight: '100vh'}}>
            <Grid item lg={8} md={10} sm={10} xs={12} className={styles.headerTextGrid}>
                <Typography variant="h1" className={clsx("text-center", styles.insightsHeaderText)}>
                    Coin Cardinal Terms of Service
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Introduction:
                </Typography>
                <Typography variant="p">
                    By using the services provided by Coin Cardinal (the "Platform"), you agree to be bound by the following terms of use (the "Terms"). These Terms apply to all users of the Platform, including users who are also contributors of content, information, and other materials or services on the Platform. If you do not agree to these Terms, you may not use the Platform.
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Use of the Platform:
                </Typography>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>User Account:</b> To use certain features of the Platform, you may be required to create an account. You agree to provide accurate and complete information when creating your account, and to update your information as necessary to keep it accurate and complete. You are responsible for maintaining the confidentiality of your account and password, and for all activities that occur under your account.
                    </Typography>
                </div>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>Prohibited Activities:</b> You may not use the Platform for any illegal or unauthorized purpose. You agree not to, or attempt to, circumvent, disable or otherwise interfere with security-related features of the Platform or features that prevent or restrict use or copying of any content or enforce limitations on use of the Platform or the content accessible via the Platform.
                    </Typography>
                </div>
                <Typography variant="p">
                    <b>Content and Conduct:</b> You are solely responsible for your conduct and any content that you submit, post, or display on or through the Platform, including any information, text, graphics, photos, or other materials (collectively, "Content"). You agree not to engage in any of the following prohibited activities: (a) posting, uploading, publishing, submitting, or transmitting any Content that is fraudulent, false, misleading, or deceptive; (b) posting, uploading, publishing, submitting, or transmitting any Content that infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party; (c) posting, uploading, publishing, submitting, or transmitting any Content that is defamatory, obscene, pornographic, offensive, or otherwise inappropriate; (d) posting, uploading, publishing, submitting, or transmitting any Content that constitutes spam or unsolicited commercial communication; or (e) using the Platform to engage in any other activities that are illegal or harm the rights of others.
                </Typography>
            </Grid>  
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    YouTube Terms of Service:
                </Typography>
                <Typography variant="p">
                    Coin Cardinal leverages the YouTube Data API to retrieve YouTube videos displayed on all the individual project pages on the listing platform for projects that have a YouTube channel. Because of this, as a user of the Coin Cardinal platform you are also agreeing to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">YouTube Terms of Service.</a>
                </Typography>
            </Grid>   
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Intellectual Property:
                </Typography>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>Ownership:</b> The Platform and all content and materials on the Platform, including, but not limited to, text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, software, and the compilation of all content on the Platform (collectively, the "Materials"), are the property of Coin Cardinal and are protected by intellectual property laws.
                    </Typography>
                </div>
                <Typography variant="p">
                    <b>License:</b> Coin Cardinal grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform and the Materials for your personal, non-commercial use. You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from the Platform or the Materials.    
                </Typography>
            </Grid>    
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Termination:
                </Typography>
                <Typography variant="p">
                    Coin Cardinal may terminate these Terms, or suspend your access to all or part of the Platform, at any time, with or without notice, for any reason deemed fit by the Coin Cardinal administrators or creators.
                </Typography>
            </Grid>                                        
        </Grid>
        </>
    )
}