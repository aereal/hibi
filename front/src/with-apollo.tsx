import React, { Component, ComponentType } from "react";
import NextApp, { AppProps } from "next/app";
import { AppInitialProps } from "next/dist/next-server/lib/utils";
import { getMarkupFromTree } from "@apollo/react-ssr";
import { renderToString } from "react-dom/server";
import { ApolloClient } from "apollo-client";
import Head from "next/head";
import { initApolloClient } from "./init-apollo-client";
import { WithApolloProps, ApolloContext } from "./types";

type Props = WithApolloProps<any> & AppProps & AppInitialProps;

export const withApollo = (App: typeof NextApp) =>
  class WithApollo extends Component<Props> {
    static displayName = `WithApollo(${getDisplayName(App)})`;

    static async getInitialProps(appCtx: ApolloContext) {
      const { Component, router, ctx } = appCtx;

      const apolloClient = initApolloClient();

      let appProps = { pageProps: {} };
      if (App.getInitialProps) {
        ctx.apolloClient = apolloClient;
        appProps = await App.getInitialProps(appCtx);
      }

      if (!process.browser) {
        try {
          await getMarkupFromTree({
            renderFunction: renderToString,
            tree: (
              <App
                {...appProps}
                Component={Component}
                router={router}
                apolloClient={apolloClient}
              />
            ),
          });
        } catch (e) {
          console.error(`error while runningn getDataFromTree: ${e}`);
        }

        Head.rewind();
      }

      const apolloState = apolloClient.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    private apolloClient: ApolloClient<any>;

    constructor(props: Props) {
      super(props);
      this.apolloClient =
        props.apolloClient || initApolloClient(props.apolloState);
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }

    componentDidMount() {
      const jssStyles = document.getElementById("jss-server-side");
      if (jssStyles) {
        jssStyles.parentElement?.removeChild(jssStyles);
      }
    }
  };

const getDisplayName = (component: ComponentType<any>): string =>
  component.displayName !== undefined
    ? component.displayName
    : component.name !== undefined
    ? component.name
    : "Unknown";
