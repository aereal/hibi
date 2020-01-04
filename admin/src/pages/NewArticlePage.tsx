import React, { FC, useState } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { ArticleEditor } from "../organisms/ArticleEditor";
import { CompletedNotification } from "../organisms/CompletedNotification";

const NewArticlePageContent: FC = () => {
  const [completed, setCompleted] = useState(false);

  const onSubmit = (): void => {
    setCompleted(true);
  };

  const onCloseNotification = () => {
    setCompleted(false);
  };

  return (
    <>
      <ArticleEditor onSubmit={onSubmit} />
      <CompletedNotification
        open={completed}
        onClose={onCloseNotification}
        message="公開しました"
      />
    </>
  );
};

export const NewArticlePage: FC = () => (
  <Layout>
    <Grid item xs={12} spacing={0}>
      <ProvideAuthenApolloClientOrRedirect onLoading={() => <LinearProgress />}>
        <NewArticlePageContent />
      </ProvideAuthenApolloClientOrRedirect>
    </Grid>
  </Layout>
);
