//routes to /chat/[id]
//we do have another Chat component, but this one is local to this file and all that matters in next.js is the file name

//if we want to route to /chat/, we can just create a index.js inside of the chat folder
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

//Nest.js server prefetcehs data for you beofore it gets to the browser
export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id); //query.id is the chat id in the url

  //PREP the messages on the server
  const messagesRes = await ref.collection("messages").orderBy("timestamp", "asc").get(); //on server you can't do snapshots. YOu can only do get()

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toData().getTime(),
    }));

  //PREP the chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  console.log(chat, messages);

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  /* to hide the scrollbar on overflow */
  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none; /*IE and Edge*/
  scrollbar-width: none; /* Firefox */
  /* to hide the scrollbar on overflow */
`;
