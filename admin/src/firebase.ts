import firebase from "firebase/app";
import "firebase/auth";

export const auth = () => {
  if (firebase.apps.length === 0) {
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    };
    firebase.initializeApp(config);
  }
  return firebase.auth();
};
