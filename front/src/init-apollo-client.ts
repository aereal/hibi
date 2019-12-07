/// <reference types="next/types/global" />

import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import fetch from "isomorphic-fetch";

let apolloClient: ApolloClient<any> | null = null;

if (!process.browser) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  global.fetch = fetch;
}

const createApolloClient = (
  initialState: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: new HttpLink({
      uri: `https://api-dot-hibi-260613.appspot.com/graphql`, // TODO
      credentials: "include",
      fetchOptions: { mode: "cors", credentials: "include" },
    }),
    cache: new InMemoryCache().restore(initialState),
  });

export const initApolloClient = (initialState: any = {}) => {
  if (!process.browser) {
    return createApolloClient(initialState);
  }

  if (apolloClient === null) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
};
