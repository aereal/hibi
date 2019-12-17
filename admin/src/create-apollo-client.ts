import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";

export const createApolloClient = (
  idToken: string
): ApolloClient<NormalizedCacheObject> => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  if (REACT_APP_API_ENDPOINT === undefined) {
    throw new Error(`[BUG] REACT_APP_API_ENDPOINT is not defined`);
  }

  const link = new HttpLink({
    headers: {
      authorization: `Bearer ${idToken}`,
    },
    uri: REACT_APP_API_ENDPOINT,
  });
  const cache = new InMemoryCache();
  return new ApolloClient({
    cache,
    link,
  });
};
