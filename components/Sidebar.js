import { Avatar, Button, IconButton, Alert } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

function Sidebar() {
  const [user] = useAuthState(auth); //keeps a real time mapping of the user's authentication. Basically, user is the logged in user
  const userChatRef = db.collection("chats").where("users", "array-contains", user.email); //this goes to chats and checks where the user.email is seen inside of users array
  const [chatsSnapshot] = useCollection(userChatRef);
  //chatsSnapshot gives us a real time listener

  const createChat = () => {
    const input = prompt("Please enter an email for the user you wish to chat with");

    if (!input) return null; //email id of the person we want to chat with

    //Now, we'll check if the email is valid, and if the chat already exists
    if (input === user.email) {
      alert("You can't start a chat with yourself!");
      return;
    } else if (EmailValidator.validate(input)) {
      //we need to add the chat into the DB 'chats' collection
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = async (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  //this goes through all the chats of the logged in user and checks to see if a chat with recipient's email already exists
  // '!!' is used to convert a variable to boolean. If value is falsy like null or undefined or '', it'll become false, otherwise it'll become true
  // '?.' is used so that it doesnt throw error if variable is undefined, which it could be for async stuff in the beg
  return (
    <Container>
      <Header>
        <UserAvatar onClick={() => auth.signOut()} />

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/* List of chats  */}
    </Container>
  );
}

export default Sidebar;

//styled component
const Container = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  /* by default since we're using a component provided by Styled Component, css styles for border and stuff are predefined. If we want our styles to take priority over them, we need to enclose them within &&&{} */
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const SearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;

  /* this z index is needed so that header is on top of everything else when contacts are scrolling */

  /* we want the top header to be sticky even when we're scrolling the list of contacts under it */
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`; //this is using styled-components on a material-ui component

const IconsContainer = styled.div``;
