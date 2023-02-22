import { useState, useEffect, useRef } from 'react';
import { Button, InputBase, Paper, Grid, TextField, Menu, MenuItem, Typography } from '@mui/material';
import { collection, addDoc, query, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import clsx from 'clsx';
import { AiOutlineSend } from "react-icons/ai";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";

import styles from '../../styles/Community.module.css';

import { useAuth } from '../../contexts/AuthContext';
import { firestore } from '../../firebase-vars';

import ChatMessage from './ChatMessage';

const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

    return [ htmlElRef, setFocus ] 
}

export default function ChatRoom(props) {
    const { currentUser, currentUserData } = useAuth();

    const messageRef = collection(firestore, "textChannels", props.selectedTextChannel.id, "messages");
    const messageQuery = query(messageRef, orderBy("createdAt", "desc"), limit(25));

    const [messages, loading] = useCollection(messageQuery);
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    const [atBottom, setAtBottom] = useState(true);
    const [chatDisabled, setChatDisabled] = useState(false);
    const [messageEditing, setMessageEditing] = useState(null);
    const [inputRef, setInputFocus] = useFocus();

    const dummy = useRef();
    const [formValue, setFormValue] = useState("");

    const emojiSelectionOpen = Boolean(emojiAnchorEl);

    const handleEmojiSelectionOpen = (e) => {
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

    const enableChatAfterWait = () => {
        setTimeout(() => {
            setChatDisabled(false);
          }, "1000")
      }

    const sendMessage = async() => {
        if (formValue == '' || chatDisabled) {
            return;
        }

        setFormValue('');

        const { uid, photoURL } = currentUser;

        addDoc(messageRef, {
            text: formValue.replaceAll("\n", "NEWLINE"),
            createdAt: serverTimestamp(),
            username: currentUserData && currentUserData.username ? currentUserData.username : "User",
            uid,
            photoURL
        }).then((response) => {
            scrollToBottomSmooth();
            setChatDisabled(true);
            enableChatAfterWait();
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
        if (emojiAnchorEl == null) {
            setInputFocus();
        }
    }, [emojiAnchorEl])

    useEffect(() => {
        if (atBottom) {
            scrollToBottomSmooth();
        }
    }, [messages ? messages.docs.length : messages])

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

    const messageDivScroll = () => {
        const messageDiv = document.getElementById("messageDiv");
        if (Math.abs(Math.ceil(messageDiv.scrollHeight - messageDiv.scrollTop) - messageDiv.clientHeight) < 50 && !atBottom) {
            setAtBottom(true);
        }
        else if (Math.abs(Math.ceil(messageDiv.scrollHeight - messageDiv.scrollTop) - messageDiv.clientHeight) >= 50 && atBottom) {
            setAtBottom(false);
        }
    }

    return (
        <>
            <Grid container spacing={2} id="messageDiv" className={clsx(styles.messageDiv, props.smallChat ? styles.messageDivSmall : "")} onScroll={messageDivScroll}>
                {messages && messages.docs && [...messages.docs].reverse().map((msg) => (
                    <Grid item xs={12} key={msg.id}>
                        <ChatMessage message={{...msg.data(), msgId: msg.id}} messageEditing={messageEditing} setMessageEditing={setMessageEditing}
                            textChannelId={props.selectedTextChannel.id} />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <span ref={dummy}></span>
                </Grid>
            </Grid>

            <Paper component="form" id="chatForm" onSubmit={sendMessage} className={clsx(styles.chatForm, chatDisabled ? "disabledChat" : "")}>
                <TextField multiline variant="outlined" maxRows={1} id="userInput" placeholder="Type here..." value={formValue}
                    onChange={updateFormValue} className={clsx(styles.chatInput, chatDisabled ? styles.disabledChatSend : "")} 
                    onKeyDown={chatEnterPressed} inputRef={inputRef}
                    sx={{
                        "& fieldset": { border: 'none' }
                        }} />
                <BsFillEmojiSunglassesFill onClick={handleEmojiSelectionOpen} className={styles.emojiIcon} />
                <AiOutlineSend onClick={sendMessage} className={clsx(styles.submitIcon, chatDisabled ? styles.disabledChatSend : "")} />       
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
                                <Grid item xs={1} key={emoji}>
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