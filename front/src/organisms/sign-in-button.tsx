import React, { FC } from "react";
import Button from "@material-ui/core/Button";
import firebase from "firebase/app";
import { auth } from "../firebase";

const signIn = (): Promise<void> =>
  auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());

export const SignInButton: FC = () => {
  return (
    <Button variant="contained" color="primary" onClick={signIn}>
      Sign in with Google
    </Button>
  );
};
