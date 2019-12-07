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
    apiKey: "TODO",
    authDomain: "TODO",
    projectId: "TODO",
    appId: "TODO",
  });
  return cachedApp;
};

export const auth = firebase.auth(getApp());
