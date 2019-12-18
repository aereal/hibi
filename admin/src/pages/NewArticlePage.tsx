import React, { FC, useState, FormEvent } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useMutation } from "@apollo/react-hooks";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { ArticleEditor, ChangeItem } from "../organisms/ArticleEditor";
import mutation from "./PostNewArticleMutation.gql";
import {
  PostNewArticleMutation,
  PostNewArticleMutationVariables,
} from "./__generated__/PostNewArticleMutation";
import { PostCompletedNotification } from "../organisms/PostCompletedNotification";

const NewArticlePageContent: FC = () => {
  const [doMutation, { error, loading }] = useMutation<
    PostNewArticleMutation,
    PostNewArticleMutationVariables
  >(mutation);
  const [title, setTitle] = useState("");
  const [markdownBody, setMarkdownBody] = useState("");
  const [completed, setCompleted] = useState(false);

  if (error !== undefined) {
    return (
      <>
        <div>! Error</div>
        <pre>{JSON.stringify(error)}</pre>
      </>
    );
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await doMutation({
      variables: {
        newArticle: {
          diaryID: "gZJXFGCS7fONfpIKXWYn",
          title,
          markdownBody,
        },
      },
    });
    setTitle("");
    setMarkdownBody("");
    setCompleted(true);
  };

  const onChange = (item: ChangeItem) => {
    switch (item.name) {
      case "title":
        setTitle(item.value);
        break;
      case "markdownBody":
        setMarkdownBody(item.value);
        break;
    }
  };

  const onCloseNotification = () => {
    setCompleted(false);
  };

  return (
    <>
      <ArticleEditor
        onSubmit={onSubmit}
        loading={loading}
        title={title}
        markdownBody={markdownBody}
        onChange={onChange}
      />
      <PostCompletedNotification
        open={completed}
        onClose={onCloseNotification}
      />
      {loading ? <LinearProgress /> : null}
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
