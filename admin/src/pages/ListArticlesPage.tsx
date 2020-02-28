import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Helmet from "react-helmet";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { PublishState } from "../globalTypes";
import { ArticlesList } from "../templates/ArticlesList";

export const ListArticlesPage: FC = () => (
  <>
    <Helmet>
      <title>日記一覧 - hibi</title>
    </Helmet>
    <Layout>
      <Grid item xs={12} spacing={0}>
        <Typography variant="h4">日記一覧</Typography>
        <ProvideAuthenApolloClientOrRedirect
          onLoading={() => <LinearProgress />}
        >
          <ArticlesList
            diaryID="gZJXFGCS7fONfpIKXWYn"
            initialStates={[PublishState.PUBLISHED]}
          />
        </ProvideAuthenApolloClientOrRedirect>
      </Grid>
    </Layout>
  </>
);
