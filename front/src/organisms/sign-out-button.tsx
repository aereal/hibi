import React, { FC } from "react";
import Button from "@material-ui/core/Button";
import { auth } from "../firebase";

const signOut = (): Promise<void> => auth.signOut();

export const SignOutButton: FC = () => {
  return (
    <Button variant="contained" onClick={signOut}>
      Sign Out
    </Button>
  );
};
