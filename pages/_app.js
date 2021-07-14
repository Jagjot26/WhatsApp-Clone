import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import Loading from "../components/Loading";
import firebase from "firebase";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth); //used for checking logged in status of user on app startup. When a user is logged in, the if check below gets executed again as the useAuthState is kinda real time listener

  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      ); //uid comes from google
    } //set basically updates and replaces everything in the document. With merge, we say that merge the old data with new data we just provided. But if it wasn't created, we need to create it initally. Hence, we used 'set' instead of 'update'
  }, [user]); //useEffect should run on component mount and whenever 'user' changes, i.e. when the user logouts or logs in

  if (loading) return <Loading />;

  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
