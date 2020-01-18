import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Helmet from "react-helmet";
import { useQuery } from "@apollo/react-hooks";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { ArticleTable } from "../organisms/ArticleTable";
import {
  ListArticlesQuery,
  ListArticlesQueryVariables,
} from "../queries/__generated__/ListArticlesQuery";
import query from "../queries/ListArticlesQuery.gql";
import { ArticleOrderField, OrderDirection } from "../globalTypes";

const Content: FC = () => {
  const diaryID = "gZJXFGCS7fONfpIKXWYn";
  const currentPage = 1; // TODO
  const perPage = 10; // TODO
  const field = ArticleOrderField.PUBLISHED_AT;
  const direction = OrderDirection.DESC;

  const { data, loading, error } = useQuery<
    ListArticlesQuery,
    ListArticlesQueryVariables
  >(query, {
    variables: {
      diaryID,
      currentPage,
      perPage,
      order: {
        field,
        direction,
      },
    },
  });

  if (error) {
    return <>! Error: {JSON.stringify(error)}</>;
  }

  if (loading || !data?.diary) {
    return <LinearProgress />;
  }

  return (
    <>
      <ArticleTable articles={data.diary.articles.nodes} />
    </>
  );
};

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
          <Content />
        </ProvideAuthenApolloClientOrRedirect>
      </Grid>
    </Layout>
  </>
);
