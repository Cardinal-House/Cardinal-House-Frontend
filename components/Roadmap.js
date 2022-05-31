import { Grid, Typography } from '@mui/material';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import styles from '../styles/Home.module.css';

export default function Roadmap(props) {
    gsap.registerPlugin(ScrollTrigger);

    const darkThemePrimary = "#1649ff";
    const lightThemePrimary = "#70c1ff";
    const roadmapHeaderRef = useRef();
  
    // Loads animations for elements of the page.
    useEffect(() => {
      gsap.fromTo(roadmapHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#roadmapHeader", start: "bottom bottom" } });
    }, [])

    return (
        <Grid container id="roadmap" justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Typography id="roadmapHeader" ref={roadmapHeaderRef} variant="h3" className={styles.roadmapHeader}>
            Cardinal House Roadmap
            </Typography>
          </Grid>

          <VerticalTimeline className={clsx(styles.verticalTimelineDiv, props.useDarkTheme ? "timeline-dark-theme" : "timeline-light-theme")}>
            {/* ~~~~~~~~~~~~~~~~~~~ Q2 2022 ~~~~~~~~~~~~~~~~~~ */}
            <VerticalTimelineElement
              className="vertical-timeline-element-right"
              contentStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid ${props.useDarkTheme ? darkThemePrimary : lightThemePrimary}` }}
              date="Q2 2022"
              iconStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#000' }}
              icon={<ArrowDownwardIcon />}
            >
              <Typography variant="p">
                <ArrowForwardIcon /> Website Creation
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Continue community growth through AMAs, YouTube, and paid ads
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release Original Cardinal NFTs
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon />  Begin competitions to win Original Cardinal NFTs
              </Typography>
              <br/>
              <Typography variant="p" className={styles.lastTimelineElement}>
                <ArrowForwardIcon /> Release membership program
              </Typography>
            </VerticalTimelineElement>

            {/* ~~~~~~~~~~~~~~~~~~~ Q3 2022 ~~~~~~~~~~~~~~~~~~ */}
            <VerticalTimelineElement
              className="vertical-timeline-element-left"
              contentStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid ${props.useDarkTheme ? darkThemePrimary : lightThemePrimary}` }}
              date="Q3 2022"
              iconStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#000' }}
              icon={<ArrowDownwardIcon />}
              
            >
              <Typography variant="p">
                <ArrowForwardIcon /> Launch Cardinal Token pre-sale and token launch
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release KYC service
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release smart contract auditing service
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Grow Discord server to 10,000 through AMAs, giveaways, YouTube videos, and paid ads
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release referral program
              </Typography>
              <br/>
              <Typography variant="p" className={styles.lastTimelineElement}>
                <ArrowForwardIcon /> Release NFT marketplace
              </Typography>
            </VerticalTimelineElement>

            {/* ~~~~~~~~~~~~~~~~~~~ Q4 2022 ~~~~~~~~~~~~~~~~~~ */}
            <VerticalTimelineElement
              className="vertical-timeline-element-right"
              contentStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid ${props.useDarkTheme ? darkThemePrimary : lightThemePrimary}` }}
              date="Q4 2022"
              iconStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#000' }}
              icon={<ArrowDownwardIcon />}
            >
              <Typography variant="p">
                <ArrowForwardIcon /> Release Lift-Off service
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release Cardinal Pay service
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Add governance utility to the Cardinal Token
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> CoinMarketCap + CoinGecko listings
              </Typography>
              <br/>
              <Typography variant="p" className={styles.lastTimelineElement}>
                <ArrowForwardIcon /> Grow to 20,000 members
              </Typography>
            </VerticalTimelineElement>

            {/* ~~~~~~~~~~~~~~~~~~~ 2023 and Beyond ~~~~~~~~~~~~~~~~~~ */}
            <VerticalTimelineElement
              className="vertical-timeline-element-left"
              contentStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid ${props.useDarkTheme ? darkThemePrimary : lightThemePrimary}` }}
              date="2023 and Beyond"
              iconStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#000' }}
              icon={<ArrowDownwardIcon />}
            >
              <Typography variant="p">
                <ArrowForwardIcon /> Web3 Freelance Service Marketplace
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Grow to 50,000 members
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Get Listed on Centralized Exchanges
              </Typography>
              <br/>
              <Typography variant="p" className={styles.lastTimelineElement}>
                <ArrowForwardIcon /> And much more!
              </Typography>
            </VerticalTimelineElement>
            
            <VerticalTimelineElement
              iconStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#000' }}
              icon={<ArrowDownwardIcon />}
            />
          </VerticalTimeline>
        </Grid>        
    )
}