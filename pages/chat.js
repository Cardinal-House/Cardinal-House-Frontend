import dynamic from 'next/dynamic'

const ChatEngine = dynamic(() => import('nextjs-chat-engine').then(lib => lib.ChatEngine), {
  ssr: false,
})

import styles from '../styles/Home.module.css';

import Navigation from '../components/Navigation';
import HomeFooter from '../components/HomeFooter';

export default function Chat(props) {
  return (
    <>
    <Navigation useDarkTheme={props.useDarkTheme} setUseDarkTheme={props.setUseDarkTheme} />
    <div>
      <main className={props.useDarkTheme ? styles.darkThemeBackground : styles.lightThemeBackground}>
        <ChatEngine
          projectID='02ab1a2d-7bd9-4a1e-9fe7-8aedd3e48d5b'
          userName='cole'
          userSecret='test12345654321'
        />

        {/* ~~~~~ Footer ~~~~~ */}
        <HomeFooter useDarkTheme={props.useDarkTheme} />
      </main>
    </div>
    </>
  )
}
