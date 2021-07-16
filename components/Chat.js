import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/router";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const recipientEmail = getRecipientEmail(users, user);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  ); //this gets the recipient's details from the users collection

  const recipient = recipientSnapshot?.docs?.[0]?.data(); //[0] is there we need to get the first element which matches the criteria of condition(email == 'recemail'). But in our case there's only one element in array

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? <UserAvatar src={recipient?.photoURL} /> : <UserAvatar />}

      <p>{recipientEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  /* word-break is for when someone has a super long email. break-word breaks the word onto a new line */

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
