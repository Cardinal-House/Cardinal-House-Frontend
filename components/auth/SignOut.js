import { Button } from '@mui/material';

import styles from '../../styles/Community.module.css';

import { useAuth } from "../../contexts/AuthContext";

export default function SignOut() {
    const { currentUser, logout } = useAuth();

    return currentUser && (
        <Button variant="contained" onClick={logout} className={styles.signOut}>
            Sign Out
        </Button>        
    )
}