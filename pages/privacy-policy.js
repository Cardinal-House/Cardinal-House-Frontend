import Image from 'next/image';
import { Grid, Typography } from '@mui/material';
import clsx from 'clsx';

import ProjectInsightNavigation from '../components/ProjectInsightNavigation';
import styles from '../styles/EducationCenter.module.css';

export default function privacypolicy(props) {
    return (
        <>
        <ProjectInsightNavigation />
        <Grid container justifyContent="center" className={clsx(styles.mainGrid, "mt-5 mb-5")} style={{minHeight: '100vh'}}>
            <Grid item lg={8} md={10} sm={10} xs={12} className={styles.headerTextGrid}>
                <Typography variant="h1" className={clsx("text-center", styles.insightsHeaderText)}>
                    Coin Cardinal Privacy Policy
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Introduction:
                </Typography>
                <Typography variant="p">
                    At Coin Cardinal, we are committed to protecting the privacy of our users and their information. This Privacy Policy outlines the types of information we collect from our users, how we use and disclose that information, and the steps we take to ensure the security of the information. By using our services, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy.
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Information We Collect:
                </Typography>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>Personal Information:</b> We may collect personal information such as your name, email address, Discord username, and wallet address when you register an account with us or update your account information.
                    </Typography>
                </div>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>Transaction Information:</b> We collect information related to your transactions on the platform, including the type of transaction, the assets transacted upon, and the date and time of the transaction.
                    </Typography>
                </div>
                <Typography variant="p">
                    <b>Usage Information:</b> We collect information about how you use our platform, including the pages you visit, the links you click, and the search terms you enter.
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    How We Use Your Information:
                </Typography>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>To Provide Our Services:</b> We use your information to provide you with the services you request such as access to our community platform, purchasing memberships, and viewing our listing platform.
                    </Typography>
                </div>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>To Improve Our Services:</b> We use your information to understand how our users interact with our platform and to make improvements to our services.
                    </Typography>
                </div>
                <Typography variant="p">
                    <b>To Communicate with You:</b> We may use your information to communicate with you, such as to send you updates on your membership or to respond to your questions and concerns. You will not receive spam email communication from us.
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Disclosure of Your Information:
                </Typography>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>Service Providers:</b> We may share your information with third-party service providers who assist us in providing our services, such as payment processors or customer support providers.
                    </Typography>
                </div>
                <div className="mb-3">
                    <Typography variant="p">
                        <b>Legal Requests:</b> We may disclose your information in response to a subpoena, court order, or other legal request.
                    </Typography>
                </div>
                <Typography variant="p">
                    <b>To Protect Our Rights:</b> We may disclose your information as necessary to enforce our terms of service, protect the security of our platform, or to protect the rights and property of Coin Cardinal and its users.
                </Typography>
            </Grid>
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Security of Your Information:
                </Typography>
                <Typography variant="p">
                    We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of your information. These measures include internal reviews of our data collection, storage, and processing practices and security measures, as well as leveraging secure technological services as the foundation of the platform.
                </Typography>
            </Grid>            
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    YouTube Services:
                </Typography>
                <Typography variant="p">
                    Coin Cardinal leverages the YouTube Data API to retrieve YouTube videos displayed on all the individual project pages on the listing platform for projects that have a YouTube channel. This means as a user of the Coin Cardinal platform it is beneficial to read the <a href="http://www.google.com/policies/privacy" target="_blank" rel="noreferrer">YouTube privacy policy page.</a>                  
                </Typography>
            </Grid>            
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Child Privacy:
                </Typography>
                <Typography variant="p">
                    Our Website is not intended for children under 18 years of age (or the age of majority in your jurisdiction). We do not knowingly collect, use, or disclose Personal Data from children under 18. If you believe that we have collected, used or disclosed Personal Data of a child under the age of 18 (or the age of majority in your jurisdiction), please contact us using the contact information below so that we can take appropriate action.
                </Typography>
            </Grid>            
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Changes to This Privacy Policy:
                </Typography>
                <Typography variant="p">
                    We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. Your continued use of our services after any such changes indicates your acceptance of the new Privacy Policy.
                </Typography>
            </Grid>            
            <Grid item xs={10} className="mt-5">
                <Typography variant="h2" className="mb-4">
                    Contact Us:
                </Typography>
                <Typography variant="p">
                    If you have any questions about this Privacy Policy, please contact us at cole@coincardinal.io.
                </Typography>
            </Grid>            
        </Grid>
        </>
    )
}