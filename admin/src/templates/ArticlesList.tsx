import React, { FC, useState, MouseEvent, ChangeEventHandler } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useQuery } from "@apollo/react-hooks";
import { ArticleTable, RowsPerPage } from "../organisms/ArticleTable";
import {
  ListArticlesQuery,
  ListArticlesQueryVariables,
} from "../queries/__generated__/ListArticlesQuery";
import query from "../queries/ListArticlesQuery.gql";
import {
  ArticleOrderField,
  OrderDirection,
  PublishState,
} from "../globalTypes";

interface ArticlesListProps {
  readonly diaryID: string;
  readonly initialStates: PublishState[];
}

export const ArticlesList: FC<ArticlesListProps> = ({
  diaryID,
  initialStates,
}) => {
  const field = ArticleOrderField.CREATED_AT;
  const direction = OrderDirection.DESC;

  const [states] = useState<PublishState[]>(initialStates);
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
      states,
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
