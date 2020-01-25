import React, { FC, useState, MouseEvent, ChangeEventHandler } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Helmet from "react-helmet";
import { useQuery } from "@apollo/react-hooks";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { ArticleTable, RowsPerPage } from "../organisms/ArticleTable";
import query from "../queries/ListDraftsQuery.gql";
import { ArticleOrderField, OrderDirection } from "../globalTypes";
import {
  ListDraftsQuery,
  ListDraftsQueryVariables,
} from "../queries/__generated__/ListDraftsQuery";

const Content: FC = () => {
  const diaryID = "gZJXFGCS7fONfpIKXWYn";
  const field = ArticleOrderField.CREATED_AT;
  const direction = OrderDirection.DESC;

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState<RowsPerPage>(10);
  const { data, loading, error } = useQuery<
    ListDraftsQuery,
    ListDraftsQueryVariables
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
        articlesList={data.diary.drafts}
        rowsPerPage={perPage}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export const ListDraftsPage: FC = () => (
  <>
    <Helmet>
      <title>下書き一覧 - hibi</title>
    </Helmet>
    <Layout>
      <Grid item xs={12} spacing={0}>
        <Typography variant="h4">下書き一覧</Typography>
        <ProvideAuthenApolloClientOrRedirect
          onLoading={() => <LinearProgress />}
        >
          <Content />
        </ProvideAuthenApolloClientOrRedirect>
      </Grid>
    </Layout>
  </>
);
