import React, { FC, useState, MouseEvent, ChangeEventHandler } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Helmet from "react-helmet";
import { useQuery } from "@apollo/react-hooks";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { ArticleTable, RowsPerPage } from "../organisms/ArticleTable";
import {
  ListArticlesQuery,
  ListArticlesQueryVariables,
} from "../queries/__generated__/ListArticlesQuery";
import query from "../queries/ListArticlesQuery.gql";
import { ArticleOrderField, OrderDirection } from "../globalTypes";

const Content: FC = () => {
  const diaryID = "gZJXFGCS7fONfpIKXWYn";
  const field = ArticleOrderField.PUBLISHED_AT;
  const direction = OrderDirection.DESC;

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState<RowsPerPage>(10);
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

  const handleChangePage = (
    _: MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void => {
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = event => {
    const perPage = parseInt(event.target.value, 10);
    setPerPage((perPage as unknown) as RowsPerPage);
  };

  return (
    <>
      <ArticleTable
        articlesList={data.diary.articles}
        rowsPerPage={perPage}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
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
