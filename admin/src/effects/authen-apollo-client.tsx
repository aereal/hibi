import React, { useState, useEffect, FC } from "react";
import { ApolloProvider } from "@apollo/react-common";
import { useAuthentication, isSignedIn } from "./authentication";
import { createApolloClient } from "../create-apollo-client";

const useAuthenApolloClient = () => {
  const [apolloClient, setApolloClient] = useState<
    ReturnType<typeof createApolloClient>
  >();
  const status = useAuthentication();

  useEffect(() => {
    if (isSignedIn(status)) {
      setApolloClient(createApolloClient(status.currentUser.idToken));
    }
  }, [isSignedIn(status)]);

  return apolloClient;
};

export const AuthenApolloClientProvider: FC = ({ children }) => {
  const client = useAuthenApolloClient();
  if (client === undefined) {
    return null;
  }
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
