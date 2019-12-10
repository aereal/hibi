import React, {
  useEffect,
  createContext,
  useState,
  PropsWithChildren,
} from "react";
import firebase from "firebase";
import { auth } from "../firebase";

export interface User {
  readonly email: string | null;
  readonly uid: string;
  readonly displayName: string | null;
  readonly idToken: string;
}

interface SignedIn {
  readonly currentUser: User;
  readonly status: "signed-in";
}

interface Unauthenticated {
  readonly status: "unauthenticated";
}

interface Uninitialized {
  readonly status: "uninitialized";
}

type AuthenticationStatus = SignedIn | Unauthenticated | Uninitialized;

export const isSignedIn = (status: AuthenticationStatus): status is SignedIn =>
  status.status === "signed-in";

export const isUnauthenticated = (
  status: AuthenticationStatus
): status is Unauthenticated => status.status === "unauthenticated";

export const isUninitialized = (
  status: AuthenticationStatus
): status is Uninitialized => status.status === "uninitialized";

export const AuthenticationContext = createContext<AuthenticationStatus>({
  status: "uninitialized",
});

export const useAuthentication = (): AuthenticationStatus => {
  const [status, setStatus] = useState<AuthenticationStatus>({
    status: "uninitialized",
  });

  useEffect(() => {
    return auth().onAuthStateChanged(async user => {
      if (user === null) {
        setStatus({ status: "unauthenticated" });
        return;
      }

      const idToken = await user.getIdToken();
      setStatus({
        status: "signed-in",
        currentUser: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          idToken,
        },
      });
    });
  }, []);

  return status;
};

export const DefaultAuthenticationProvider = (props: PropsWithChildren<{}>) => (
  <AuthenticationContext.Provider value={useAuthentication()}>
    {props.children}
  </AuthenticationContext.Provider>
);

const authProvider = new firebase.auth.GoogleAuthProvider();

export const signIn = async (): Promise<void> => {
  await auth().signInWithPopup(authProvider);
};

export const signOut = (): Promise<void> => auth().signOut();
