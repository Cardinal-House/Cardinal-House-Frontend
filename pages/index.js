import styles from '../styles/Home.module.css';

import Navigation from '../components/Navigation';
import Intro from '../components/Intro';
import ForCards from '../components/ForCards';
import Community from '../components/Community';
import Education from '../components/Education';
import Services from '../components/Services';
import Token from '../components/Token';
import Tokenomics from '../components/Tokenomics';
import Growth from '../components/Growth';
import Roadmap from '../components/Roadmap';

export default function Home(props) {
  return (
    <>
    <Navigation useDarkTheme={props.useDarkTheme} setUseDarkTheme={props.setUseDarkTheme} />
    <div>
      <main className={props.useDarkTheme ? styles.darkThemeBackground : styles.lightThemeBackground}>
        {/* ~~~~~ Intro Text and Graphic ~~~~~ */}
        <Intro useDarkTheme={props.useDarkTheme} />

        {/* ~~~~~ For Investors and For Project Owners Cards ~~~~~ */}
        <ForCards useDarkTheme={props.useDarkTheme} />

        {/* ~~~~~ Community ~~~~~ */}
        <Community useDarkTheme={props.useDarkTheme} />

        {/* ~~~~~ Education ~~~~~ */}
        <Education useDarkTheme={props.useDarkTheme} />

        {/* ~~~~~ Services ~~~~~ */}
        <Services useDarkTheme={props.useDarkTheme} />

        {/* ~~~~~ Tying it All Together with the Cardinal Token ~~~~~ */}
        <Token useDarkTheme={props.useDarkTheme} />

        {/* ~~~~~ Tokenomics Cards ~~~~~ */}
        <Tokenomics useDarkTheme={props.useDarkTheme} />

        {/* ~~~~~ Growth Visual ~~~~~ */}
        <Growth useDarkTheme={props.useDarkTheme} />

        {/* ~~~~~ Roadmap ~~~~~ */}
        <Roadmap useDarkTheme={props.useDarkTheme} />
      </main>
    </div>
    </>
  )
}
