import firebase from "firebase/app";
import "firebase/auth";

export const app = firebase.initializeApp({
  apiKey: "TODO",
  authDomain: "TODO",
  projectId: "TODO",
  appId: "TODO",
});

export const auth = firebase.auth(app);
