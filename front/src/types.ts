import { NextPageContext } from "next";
import { AppContext } from "next/app";
import ApolloClient from "apollo-client";

export interface ApolloAppContext extends NextPageContext {
  apolloClient: ApolloClient<any>;
}

export interface ApolloContext extends AppContext {
  readonly ctx: ApolloAppContext;
}

interface WithApolloState<TCache> {
  readonly data?: TCache;
}

export interface WithApolloProps<TCache> {
  readonly apolloClient: ApolloClient<TCache>;
  readonly apolloState: WithApolloState<TCache>;
}
