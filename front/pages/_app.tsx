import React from "react";
import App from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/react-common";
import { ThemeProvider } from "styled-components";
import { WithApolloProps } from "../src/types";
import { withApollo } from "../src/with-apollo";
import { defaultTheme } from "../src/styling";

class ApolloApp extends App<WithApolloProps<any>> {
  render(): JSX.Element {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <>
        <Head>
          <title>hibi</title>
        </Head>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={defaultTheme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </ApolloProvider>
      </>
    );
  }
}

export default withApollo(ApolloApp);
