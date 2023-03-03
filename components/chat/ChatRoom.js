import { useState, useEffect, useRef } from 'react';
import { Button, Paper, Grid, TextField, Menu, CircularProgress } from '@mui/material';
import { collection, addDoc, query, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import clsx from 'clsx';
import { AiOutlineSend } from "react-icons/ai";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import styles from '../../styles/Community.module.css';

import { useAuth } from '../../contexts/AuthContext';
import { firestore } from '../../firebase-vars';

import ChatMessage from './ChatMessage';

const chatIncrement = 25;

function useVisibility(offset = 0,) {
    const [isVisible, setIsVisible] = useState(false);
    const currentElement = useRef(null);
  
    const onScroll = () => {
      if (!currentElement.current) {
        setIsVisible(false);
        return;
      }
      const top = currentElement.current.getBoundingClientRect().top;
      setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
    }
  
    useEffect(() => {
      document.addEventListener('scroll', onScroll, true);
      return () => document.removeEventListener('scroll', onScroll, true);
    }, [])
  
    return [isVisible, currentElement]
}

const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

    return [ htmlElRef, setFocus ] 
}

export default function ChatRoom(props) {
    const { currentUser, currentUserData } = useAuth();

    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [atBottom, setAtBottom] = useState(true);
    const [hitBottom, setHitBottom] = useState(-1);
    const [formValue, setFormValue] = useState("");
    const [chatDisabled, setChatDisabled] = useState(false);
    const [messageEditing, setMessageEditing] = useState(null);
    const [counter, setCounter] = useState(1);
    const [currNumMessages, setCurrNumMessages] = useState(chatIncrement);
    const [messages, setMessages] = useState(undefined);

    const [lastChatShown, lastChatShownRef] = useVisibility();
    const [inputRef, setInputFocus] = useFocus();
    const dummy = useRef();

    const messageRef = collection(firestore, "textChannels", props.selectedTextChannel.id, "messages");
    const messageQuery = query(messageRef, orderBy("createdAt", "desc"), limit(currNumMessages));

    const [messagesData, loading] = useCollection(messageQuery);

    const emojiSelectionOpen = Boolean(emojiAnchorEl);

    const handleEmojiSelectionOpen = (e) => {
        setEmojiAnchorEl(e.currentTarget);
        setTimeout(() => {
            setShowEmojiPicker(true);
        }, "25");
    };

    const handleEmojiSelectionClose = (emoji) => {
      if (typeof(emoji) == "string") {
        setFormValue(formValue + emoji);
      }
      setEmojiAnchorEl(null);
      setShowEmojiPicker(false);
    };

    const handleEmojiSelection = (emojiData, e) => {
        setFormValue(formValue + "#~#" + emojiData.unified + "#~#");
        setEmojiAnchorEl(null);
        setShowEmojiPicker(false);        
    }

    const scrollToBottomFast = () => {
        dummy.current.scrollIntoView();
        setHitBottom(-1);
        setTimeout(() => {
            setHitBottom(props.selectedTextChannel.id);
        }, "1000")
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
        if (messagesData) {
            setMessages(messagesData);
        }
        if (hitBottom != props.selectedTextChannel.id) {
            setCurrNumMessages(chatIncrement);
        }
    }, [messagesData, loading, props.selectedTextChannel.id]) 
    
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
        if (atBottom && hitBottom == props.selectedTextChannel.id) {
            scrollToBottomSmooth();
        }
        else if (hitBottom != props.selectedTextChannel.id) {
            scrollToBottomFast();
        }
    }, [messages ? messages.docs.length : messages])

    useEffect(() => {
        const userInputBox = document.getElementById("userInput");
        userInputBox.setAttribute("style", "height:" + (userInputBox.scrollHeight) + "px;overflow-y:hidden;");
        userInputBox.addEventListener("input", OnInput, false);
    }, [])

    useEffect(() => {
        if (lastChatShown && messages && messages.docs.length >= currNumMessages && hitBottom == props.selectedTextChannel.id) {
            setCurrNumMessages(currNumMessages + chatIncrement);
            setTimeout(() => {
                setCounter(counter + 1);
            }, "1000")

        }
    }, [lastChatShown, lastChatShownRef.current])

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
                {
                    loading && hitBottom == props.selectedTextChannel.id && (
                        <Grid item xs={12} className="mb-5 text-center">
                            <CircularProgress size={80} />
                        </Grid>
                    )
                }
                {messages && messages.docs && [...messages.docs].reverse().map((msg, index) => (
                    <Grid item xs={12} key={msg.id} ref={index == 5 ? lastChatShownRef : null}>
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
                className={!showEmojiPicker ? "hideEmojiPicker" : ""}
                sx={{
                    marginTop: '-18px',
                  }}
            >
                <Picker data={data} onEmojiSelect={(emojiData) => handleEmojiSelectionClose(emojiData.native)} theme="dark" />
                {
                    /*
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
                    */
                }
            </Menu>           
        </>
    )
}