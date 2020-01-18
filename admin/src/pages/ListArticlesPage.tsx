import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Helmet from "react-helmet";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";

export const ListArticlesPage: FC = () => (
  <>
    <Helmet>
      <title>日記一覧 - hibi</title>
    </Helmet>
    <Layout>
      <Grid item xs={12} spacing={0}>
        <ProvideAuthenApolloClientOrRedirect
          onLoading={() => <LinearProgress />}
        >
          <>日記一覧</>
        </ProvideAuthenApolloClientOrRedirect>
      </Grid>
    </Layout>
  </>
);
