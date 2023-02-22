import { Typography, TextField, Paper, Button } from '@mui/material';
import { useState, useRef, useEffect } from "react";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import clsx from 'clsx';
import { AiOutlineSend } from "react-icons/ai";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from '../../styles/Community.module.css';

import { useAuth } from "../../contexts/AuthContext";
import { firestore } from '../../firebase-vars';

const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {
        htmlElRef.current && htmlElRef.current.focus();
        const len = htmlElRef.current.value.length;
        htmlElRef.current.setSelectionRange(len, len);
    }

    return [ htmlElRef, setFocus ] 
}

const defaultScrollHeight = 25;

/**
Props:
    - message - contains the text, uid, photoURL, createdAt, username, msgId
    - messageEditing - the UID of the message currently being edited - null if no message is currently being edited.
    - setMessageEditing - updates the UID of the message being updated
    - textChannelId - the Firebase ID for the text channel the message is from
*/
export default function ChatMessage(props) {
    const { currentUser, currentUserData } = useAuth();

    const { text, uid, photoURL, createdAt, username, msgId } = props.message;

    const [editedMessage, setEditedMessage] = useState(text.replaceAll("NEWLINE", "\n"));
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [inputRef, setInputFocus] = useFocus();

    const messageClass = uid === currentUser.uid ? "sent" : "received";

    const uidHashedToImageIndex = () => {
        let asciiValue = 0;
        for (var i = 0; i < uid.length; i ++)
            asciiValue += uid[i].charCodeAt(0);

        return asciiValue % 20 + 1;
    }

    const imageIndex = uidHashedToImageIndex();

    function toDateString(createdAt) {
        let seconds = 0;
        if (createdAt) {
            seconds = createdAt.seconds;
        }
        else {
            return "Just now";
        }

        let msgDate = new Date(Date.UTC(1970, 0, 1));
        msgDate.setUTCSeconds(seconds);

        let currDate = new Date(Date.UTC(1970, 0, 1));
        currDate.setUTCSeconds(Date.now() / 1000);

        let dateStr = "";

        const time = msgDate.toLocaleTimeString();

        const timeDiff = currDate.getTime() - msgDate.getTime();
        const dayDiff = timeDiff / (1000 * 3600 * 24);

        if (msgDate.getDate() == currDate.getDate()) {
            dateStr = `Today at ${time.split(":")[0]}:${time.split(":")[1]} ${time.split(" ")[1]}`;
        }
        else if (dayDiff < 2) {
            dateStr = `Yesterday at ${time.split(":")[0]}:${time.split(":")[1]} ${time.split(" ")[1]}`;
        }
        else {
            dateStr = `${msgDate.toLocaleDateString()} ${time}`;
        }

        return dateStr;
    }

    const handleEmojiSelectionOpen = (e) => {
        
    };

    const chatEnterPressed = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            updateMessage();
        }
        if (e.keyCode == 27) {
            props.setMessageEditing(null);
        }
    }  
    
    const updateMessage = async () => {
        const docRef = doc(firestore, "textChannels", props.textChannelId, "messages", msgId);
        await setDoc(docRef, { text: editedMessage.replaceAll("\n", "NEWLINE"), updatedAt: serverTimestamp() }, { merge: true });
        props.setMessageEditing(null);
    }

    const deleteMessage = async () => {
        setConfirmDelete(false);
        const docRef = doc(firestore, "textChannels", props.textChannelId, "messages", msgId);
        await deleteDoc(docRef);
    }

    const updateHeights = (chatObj) => {
        const chatForm = document.getElementById(`chatEditForm-${msgId}`);

        // if (parseInt(chatObj.style.height.replace("px", "")) < 300) {
        const prevHeight = chatObj.style.height;
        chatObj.style.height = 0;
        const newScrollHeight = chatObj.scrollHeight > defaultScrollHeight ? chatObj.scrollHeight : defaultScrollHeight;
        chatObj.style.height = (newScrollHeight) + "px";

        if (parseInt(chatObj.style.height.replace("px", "")) > 300) {
            chatObj.style.height = prevHeight;
        }
        else {
            chatForm.setAttribute("style", "bottom:" + (newScrollHeight) + "px;");
            chatForm.setAttribute("style", "height:" + `calc(4vh + ${newScrollHeight}px);`);
        }
    }

    function OnInput() {
        updateHeights(this);
    }

    useEffect(() => {
        const userInputBox = document.getElementById(`userInputEdit-${msgId}`);
        userInputBox.setAttribute("style", "height:" + (userInputBox.scrollHeight > defaultScrollHeight ? userInputBox.scrollHeight : defaultScrollHeight) + "px;overflow-y:hidden;");
        userInputBox.addEventListener("input", OnInput, false);
    }, [])

    useEffect(() => {
        if (props.messageEditing == msgId) {
            setInputFocus();
        }
    }, [props.messageEditing])

    return (
        <div className={clsx(styles.message, messageClass == "sent" ? styles.sentMessage : styles.receivedMessage)} onMouseLeave={() => setConfirmDelete(false)}>
            {
                (currentUser.uid == uid || currentUserData.isAdmin) && props.messageEditing != msgId && (
                    <div className={styles.chatOptionsDiv}>
                        {
                            !confirmDelete && (
                                <>
                                    <Button variant="contained" className={styles.messageOptionBtn} onClick={() => {props.setMessageEditing(msgId);setEditedMessage(text.replaceAll("NEWLINE", "\n"))}}
                                        style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                                        <EditIcon />
                                    </Button>
                                    <Button variant="contained" className={clsx(styles.messageOptionBtn, styles.deleteBtn)} onClick={() => setConfirmDelete(true)}
                                        style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                                        <DeleteIcon />
                                    </Button>
                                </>
                            )
                        }
                        {
                            confirmDelete && (
                                <Button variant="contained" className={clsx(styles.confirmDelete, styles.deleteBtn)} onClick={deleteMessage}>
                                    Confirm Delete
                                </Button>
                            )
                        }
                    </div>
                )
            }
            <img src={photoURL ? photoURL : `/Original Cardinal NFT ${imageIndex}.png`} className={styles.chatImg} />
            <Typography variant="p" className={styles.chatElement}>
                <span className={styles.userText}>{username ? username : "Username"} </span>
                <span className={styles.dateText}>{toDateString(createdAt)}</span>
                <br/>
                <span className={clsx(styles.messageText, props.messageEditing == msgId ? styles.hide : "")}>{text.replaceAll("NEWLINE", "\n")}</span>
                <Paper component="form" id={`chatEditForm-${msgId}`} onSubmit={updateMessage} className={clsx(styles.chatEditForm, props.messageEditing != msgId ? styles.hide : "")}>
                    <TextField multiline variant="outlined" maxRows={1} id={`userInputEdit-${msgId}`} value={editedMessage}
                    onChange={e => setEditedMessage(e.target.value)} className={styles.chatInput} 
                    onKeyDown={chatEnterPressed} inputRef={inputRef}
                    sx={{
                        "& fieldset": { border: 'none' }
                    }} />
                <BsFillEmojiSunglassesFill onClick={handleEmojiSelectionOpen} className={styles.emojiIcon} />
                <AiOutlineSend onClick={updateMessage} className={styles.submitIcon} />       
            </Paper> 
            </Typography>
        </div>
    )
}