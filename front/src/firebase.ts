import firebase from "firebase/app";
import "firebase/auth";

let cachedApp: firebase.app.App | undefined;

const getApp = (): firebase.app.App => {
  if (cachedApp !== undefined) {
    return cachedApp;
  }
  const [initializedApp] = firebase.apps;
  if (initializedApp !== undefined) {
    cachedApp = initializedApp;
    return initializedApp;
  }

  cachedApp = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId:
      process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
    appId: process.env.FIREBASE_APP_ID,
  });
  return cachedApp;
};

export const auth = firebase.auth(getApp());
