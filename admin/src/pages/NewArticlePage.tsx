import React, { FC, useState } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Helmet from "react-helmet";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { ArticleEditor } from "../organisms/ArticleEditor";
import { CompletedNotification } from "../organisms/CompletedNotification";

const NewArticlePageContent: FC = () => {
  const [published, setPublished] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const onPublished = (): void => {
    setPublished(true);
  };

  const onClosePublishedNotification = () => {
    setPublished(false);
  };

  const onDraftSaved = (): void => setDraftSaved(true);

  const onCloseSavedNotification = (): void => setDraftSaved(false);

  return (
    <>
      <ArticleEditor
        onPublished={onPublished}
        onDraftSaved={onDraftSaved}
        defaultTitle=""
        defaultBodyHTML="<p> </p>\n"
      />
      <CompletedNotification
        open={published}
        onClose={onClosePublishedNotification}
        message="公開しました"
      />
      <CompletedNotification
        open={draftSaved}
        onClose={onCloseSavedNotification}
        message="保存しました"
      />
    </>
  );
};

export const NewArticlePage: FC = () => (
  <>
    <Helmet>
      <title>日記を書く - hibi</title>
    </Helmet>
    <Layout>
      <Grid item xs={12} spacing={0}>
        <ProvideAuthenApolloClientOrRedirect
          onLoading={() => <LinearProgress />}
        >
          <NewArticlePageContent />
        </ProvideAuthenApolloClientOrRedirect>
      </Grid>
    </Layout>
  </>
);
