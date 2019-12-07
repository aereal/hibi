import React, { FC } from "react";
import Typography from "@material-ui/core/Typography";
import { useAuthentication, isSignedIn } from "../effects/authentication";
import { SignOutButton } from "./sign-out-button";
import { SignInButton } from "./sign-in-button";

export const AuthenticatedScreen: FC = () => {
  const auth = useAuthentication();
  if (isSignedIn(auth)) {
    const { currentUser } = auth;
    return (
      <>
        <Typography>Name: {currentUser.displayName}</Typography>
        <Typography>UID: {currentUser.uid}</Typography>
        <SignOutButton />
      </>
    );
  } else {
    return <SignInButton />;
  }
};
