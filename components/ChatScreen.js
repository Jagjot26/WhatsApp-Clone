import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useRef, useState } from "react";
import firebase from "firebase";
import Message from "./Message";
import TimeAgo from "timeago-react";
import ThreeBounce from "better-react-spinkit/dist/ThreeBounce";
import JSTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

function ChatScreen({ chat, messages }) {
  JSTimeAgo.addLocale(en);

  JSTimeAgo.setDefaultLocale("en");

  const timeAgo = new JSTimeAgo("en-US");

  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");

  const endOfMessagesRef = useRef(null); //basically connects a pointer to that EndOfMessagesRef component
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db.collection("chats").doc(router.query.id).collection("messages").orderBy("timestamp", "asc")
  );

  const recipientEmail = getRecipientEmail(chat.users, user);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  );

  const saveLastSeenEveryTenSeconds = () => {
    //update the last seen every 10s
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  };

  const showMessages = () => {
    setInterval(saveLastSeenEveryTenSeconds, 15000);

    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      //this is prefetched data used for when our realtime chat snapshot has not fetched yet
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    //update the last seen
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    //store the sent message in the db
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    //sets input to blank after message is sent
    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data(); //gives us the recipient

  //   const compareTimestampsToCheckForOnline = (timestamp) => {
  //     if (timestamp === undefined) return -1;
  //     const today = new Date();
  //     const diff = today - timestamp;
  //     console.log(today);
  //     console.log(timestamp);
  //     console.log(diff);

  //     if (diff / 1000 <= 30) {
  //       return "Online";
  //     } else {
  //       return "-1";
  //     }
  //   };

  return (
    <Container>
      <Header>
        {recipient ? <Avatar src={recipient?.photoURL} /> : <Avatar>{recipientEmail[0]}</Avatar>}
        {/* recipientEmail[0] gives us the first character of the email */}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            recipient?.lastSeen?.toDate() ? (
              <p>
                Last active: <TimeAgo datetime={recipient?.lastSeen?.toDate()} locale="en-US" />
              </p>
            ) : (
              <p>Last active: Unavailable</p>
            )
          ) : (
            <ThreeBounce color="gray" size={6} />
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // update input everytime user types in something
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  align-items: center;
  padding: 20px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  z-index: 100;
  margin-left: 15px;
  margin-right: 15px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 100;
`;

const Header = styled.div`
  position: sticky;
  background-color: #fff;
  z-index: 100;
  top: 0;
  /* top: 0 to allow it to stick it to the top */
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  /* target h3 in HeaderInformation */
  > h3 {
    margin-bottom: 0px;
  }

  > p {
    font-size: 13px;
    color: gray;
    /* margin-top: -7px; */
  }
`;

//this is for auto scroll when there's a new message
const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
