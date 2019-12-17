import React, { FC, FormEventHandler } from "react";
import Grid from "@material-ui/core/Grid";
import { useQuery } from "@apollo/react-hooks";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { ArticleEditor } from "../organisms/ArticleEditor";
import query from "../queries/NewArticlePageQuery.gql";
import {
  NewArticlePageQuery,
  NewArticlePageQueryVariables,
} from "../queries/__generated__/NewArticlePageQuery";

const NewArticlePageContent: FC = () => {
  const { data, loading, error } = useQuery<
    NewArticlePageQuery,
    NewArticlePageQueryVariables
  >(query, { variables: { diaryID: "gZJXFGCS7fONfpIKXWYn" } });

  if (error !== undefined) {
    return (
      <>
        <div>! Error</div>
        <pre>{JSON.stringify(error)}</pre>
      </>
    );
  }

  if (loading) {
    return <>Loading ...</>;
  }

  if (data === undefined) {
    return null;
  }

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
  };

  return <ArticleEditor onSubmit={onSubmit} />;
};

export const NewArticlePage: FC = () => (
  <Layout>
    <Grid item xs={12} spacing={0}>
      <ProvideAuthenApolloClientOrRedirect>
        <NewArticlePageContent />
      </ProvideAuthenApolloClientOrRedirect>
    </Grid>
  </Layout>
);
