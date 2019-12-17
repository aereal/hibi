import React, { useState, useEffect, FC } from "react";
import { ApolloProvider } from "@apollo/react-common";
import {
  useAuthentication,
  isSignedIn,
  isUnauthenticated,
} from "./authentication";
import { createApolloClient } from "../create-apollo-client";
import { getCurrentRoute, routes } from "../routes";

export const useAuthenApolloClient = () => {
  const [apolloClient, setApolloClient] = useState<
    ReturnType<typeof createApolloClient>
  >();
  const authenticationStatus = useAuthentication();

  useEffect(() => {
    if (isSignedIn(authenticationStatus)) {
      setApolloClient(
        createApolloClient(authenticationStatus.currentUser.idToken)
      );
    }
  }, [isSignedIn(authenticationStatus)]);

  return { apolloClient, authenticationStatus };
};

export const ProvideAuthenApolloClientOrRedirect: FC = ({ children }) => {
  const { apolloClient, authenticationStatus } = useAuthenApolloClient();

  if (isUnauthenticated(authenticationStatus)) {
    const { name } = getCurrentRoute();
    routes.signIn.push({
      callbackRoute: name === false ? undefined : name,
    });
    return null;
  }

  if (apolloClient === undefined) {
    return null;
  }

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
