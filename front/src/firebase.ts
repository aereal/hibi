import firebase from "firebase/app";
import "firebase/auth";

export const auth = () => {
  if (firebase.apps.length === 0) {
    const config = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId:
        process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
      appId: process.env.FIREBASE_APP_ID,
    };
    firebase.initializeApp(config);
  }
  return firebase.auth();
};
