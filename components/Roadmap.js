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

    const darkThemePrimary = "#ff0000";
    const lightThemePrimary = "#ff0000";
    const darkThemeSecondary = "#c50a0a";
    const lightThemeSecondary = "#c50a0a";
    const roadmapHeaderRef = useRef();
  
    // Loads animations for elements of the page.
    useEffect(() => {
      gsap.fromTo(roadmapHeaderRef.current, {opacity: 0}, { opacity: 1, duration: 1, scrollTrigger: { trigger: "#roadmapHeader", start: "bottom bottom" } });
    }, [])

    return (
        <Grid container id="roadmap" justifyContent="center" alignItems="center" className={styles.roadmapGrid}>
          <Grid item xs={12}>
            <Typography id="roadmapHeader" ref={roadmapHeaderRef} variant="h2" className={styles.roadmapHeader}>
              Cardinal House Roadmap
            </Typography>
          </Grid>

          <VerticalTimeline className={clsx(styles.verticalTimelineDiv, props.useDarkTheme ? "timeline-dark-theme" : "timeline-light-theme")}>
            {/* ~~~~~~~~~~~~~~~~~~~ Q2 2022 ~~~~~~~~~~~~~~~~~~ */}
            <VerticalTimelineElement
              className="vertical-timeline-element-right"
              contentStyle={{ background: props.useDarkTheme ? darkThemeSecondary : lightThemeSecondary, color: props.useDarkTheme ? '#fff' : '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid ${props.useDarkTheme ? darkThemeSecondary : lightThemeSecondary}` }}
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
              contentStyle={{ background: props.useDarkTheme ? darkThemeSecondary : lightThemeSecondary, color: props.useDarkTheme ? '#fff' : '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid ${props.useDarkTheme ? darkThemeSecondary : lightThemeSecondary}` }}
              date="Q3 2022"
              iconStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#000' }}
              icon={<ArrowDownwardIcon />}
              
            >
              <Typography variant="p">
                <ArrowForwardIcon /> Release smart contract auditing service
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release event planning service
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Launch Cardinal Token pre-sale and token launch
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Grow Discord server through AMAs, giveaways, YouTube videos, and paid ads
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Launch Cardinal Crew membership program
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release NFT marketplace
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Coin Logic listing
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Acquire strategic partners (TCL, MDB, K.C. Consulting)
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Expand core team (Austin Clark & Kurt)
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release newsletter
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Release Cardinal Points
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Launch Education Center
              </Typography>
              <br/>
              <Typography variant="p" className={styles.lastTimelineElement}>
                <ArrowForwardIcon /> Add dark theme to this website
              </Typography>
            </VerticalTimelineElement>

            {/* ~~~~~~~~~~~~~~~~~~~ Q4 2022 ~~~~~~~~~~~~~~~~~~ */}
            <VerticalTimelineElement
              className="vertical-timeline-element-right"
              contentStyle={{ background: props.useDarkTheme ? darkThemeSecondary : lightThemeSecondary, color: props.useDarkTheme ? '#fff' : '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid ${props.useDarkTheme ? darkThemeSecondary : lightThemeSecondary}` }}
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
                <ArrowForwardIcon /> Grow through AMAs, events, partnerships & other marketing avenues
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Education Center UI and UX overhaul
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Expand strategic partners
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Grow Cardinal Crew membership benefits
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Family Feud event
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Launch Ivy Nest
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Improve quality of services/engagement
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Build out long term sponsorships for events
              </Typography>
              <br/>
              <Typography variant="p" className={styles.lastTimelineElement}>
                <ArrowForwardIcon /> Improve Cardinal Points benefits
              </Typography>
              <br/>
            </VerticalTimelineElement>

            {/* ~~~~~~~~~~~~~~~~~~~ 2023 and Beyond ~~~~~~~~~~~~~~~~~~ */}
            <VerticalTimelineElement
              className="vertical-timeline-element-left"
              contentStyle={{ background: props.useDarkTheme ? darkThemeSecondary : lightThemeSecondary, color: props.useDarkTheme ? '#fff' : '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid ${props.useDarkTheme ? darkThemeSecondary : lightThemeSecondary}` }}
              date="2023 and Beyond"
              iconStyle={{ background: props.useDarkTheme ? darkThemePrimary : lightThemePrimary, color: props.useDarkTheme ? '#fff' : '#000' }}
              icon={<ArrowDownwardIcon />}
            >
              <Typography variant="p">
                <ArrowForwardIcon /> In person event
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Build out Ivy Nest ecosystem
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Grow community through education partners & many other avenues
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Continue to improve the education center
              </Typography>
              <br/>
              <Typography variant="p">
                <ArrowForwardIcon /> Expand team
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