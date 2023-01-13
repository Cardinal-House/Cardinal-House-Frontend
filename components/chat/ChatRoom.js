import { useState, useEffect, useRef } from 'react';
import { Button, InputBase, Paper, Grid, TextField, Menu, MenuItem, Typography } from '@mui/material';
import { collection, addDoc, query, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import clsx from 'clsx';
import { AiOutlineSend } from "react-icons/ai";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";

import styles from '../../styles/Community.module.css';

import { useAuth } from '../../contexts/AuthContext';
import { firestore } from '../../firebase-vars';

import ChatMessage from './ChatMessage';

export default function ChatRoom(props) {
    const { currentUser } = useAuth();

    const messageRef = collection(firestore, "textChannels", props.selectedTextChannel.id, "messages");
    const messageQuery = query(messageRef, orderBy("createdAt", "desc"), limit(25));

    const [messages, loading] = useCollectionData(messageQuery, {idField: 'id'});
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);

    const dummy = useRef();
    const [formValue, setFormValue] = useState("");

    const emojiSelectionOpen = Boolean(emojiAnchorEl);

    const handleEmojiSelectionOepn = (e) => {
        setEmojiAnchorEl(e.currentTarget);
    };

    const handleEmojiSelectionClose = (emoji) => {
      if (typeof(emoji) == "string") {
        setFormValue(formValue + emoji);
      }
      setEmojiAnchorEl(null);
    };

    const scrollToBottomFast = () => {
        dummy.current.scrollIntoView();
    }

    const scrollToBottomSmooth = () => {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    const updateHeights = (chatObj) => {
        const chatForm = document.getElementById("chatForm");
        const messageDiv = document.getElementById("messageDiv");

        // if (parseInt(chatObj.style.height.replace("px", "")) < 300) {
        const prevHeight = chatObj.style.height;
        chatObj.style.height = 0;
        chatObj.style.height = (chatObj.scrollHeight) + "px";

        if (parseInt(chatObj.style.height.replace("px", "")) > 300) {
            chatObj.style.height = prevHeight;
        }
        else {
            chatForm.setAttribute("style", "bottom:" + (chatObj.scrollHeight) + "px;");
            chatForm.setAttribute("style", "height:" + `calc(4vh + ${chatObj.scrollHeight}px);`);
            messageDiv.setAttribute("style", "bottom:" + `calc(9vh + ${chatObj.scrollHeight}px);`);
        }
    }

    function OnInput() {
        updateHeights(this);
    }

    const sendMessage = async() => {
        if (formValue == '') {
            return;
        }

        setFormValue('');

        const { uid, photoURL } = currentUser;

        addDoc(messageRef, {
            text: formValue.replaceAll("\n", "NEWLINE"),
            createdAt: serverTimestamp(),
            uid,
            photoURL
        }).then((response) => {
            scrollToBottomSmooth();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (!loading) {
            scrollToBottomFast();
        }
    }, [loading, props.selectedTextChannel.id]) 
    
    useEffect(() => {
        if (formValue == '') {
            updateHeights(document.getElementById("userInput"));
        }
    }, [formValue])

    useEffect(() => {
        const userInputBox = document.getElementById("userInput");
        userInputBox.setAttribute("style", "height:" + (userInputBox.scrollHeight) + "px;overflow-y:hidden;");
        userInputBox.addEventListener("input", OnInput, false);
    }, [])

    const chatEnterPressed = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            sendMessage();
        } 
    }

    const updateFormValue = (e) => {
        setFormValue(e.target.value);
    }

    return (
        <>
            <Grid container spacing={2} id="messageDiv" className={styles.messageDiv}>
                {messages && messages.reverse().map(msg => (
                    <Grid item xs={12}>
                        <ChatMessage key={msg.id} message={msg} />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <span ref={dummy}></span>
                </Grid>
            </Grid>

            <Paper component="form" id="chatForm" onSubmit={sendMessage} className={clsx(styles.chatForm)}>
                <TextField multiline variant="outlined" maxRows={1} id="userInput" placeholder="Type here..." value={formValue}
                    onChange={updateFormValue} className={styles.chatInput} onKeyDown={chatEnterPressed}
                    sx={{
                        "& fieldset": { border: 'none' },
                        }} />
                <BsFillEmojiSunglassesFill onClick={handleEmojiSelectionOepn} className={styles.emojiIcon} />
                <AiOutlineSend onClick={sendMessage} className={styles.submitIcon} />       
            </Paper>   
            <Menu
                anchorEl={emojiAnchorEl}
                open={emojiSelectionOpen}
                onClose={handleEmojiSelectionClose}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'bottom', horizontal: 'center'}}
                sx={{
                    marginTop: '-18px',
                  }}
            >
                <Grid container spacing={4} className={styles.emojiMenuGrid}>
                    {
                        [
                            "😀", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
                            "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚",
                            "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗",
                            "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏",
                            "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤",
                            "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶",
                            "🥴", "😵", "😵‍💫", "🤯", "🤠", "🥳", "🥸", "😎", "🤓",
                            "🧐", "😕", "😟", "🙁", "😮", "🥺", "😧", "😱", "😖",
                            "💩", "🤖", "👽", "🙈", "💕", "💯", "👌", "👍", "👀",
                        ].map((emoji) => {
                            return (
                                <Grid item xs={1}>
                                    <Button variant="contained" className={styles.emojiBtn} onClick={() => handleEmojiSelectionClose(emoji)}>
                                        {emoji}
                                    </Button>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Menu>           
        </>
    )
}