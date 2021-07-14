import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAeNGH_bHub83FycH75xgkFFTO12AqAick",
  authDomain: "whatsapp-cl-ed877.firebaseapp.com",
  projectId: "whatsapp-cl-ed877",
  storageBucket: "whatsapp-cl-ed877.appspot.com",
  messagingSenderId: "903073136862",
  appId: "1:903073136862:web:93b0600e02d2b92b07c24f",
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
