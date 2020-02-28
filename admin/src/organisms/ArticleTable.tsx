import React, { FC, MouseEvent, ChangeEventHandler } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { ListPublishedArticlesFragment } from "../fragments/__generated__/ListPublishedArticlesFragment";
import { ListDraftsFragment } from "../fragments/__generated__/ListDraftsFragment";
import { ArticleRow, ArticleType } from "./ArticleRow";

const rowsPerPageOptions = [5, 10, 30] as const;

export type RowsPerPage = typeof rowsPerPageOptions[number];

interface ArticlesList {
  readonly totalCount: number;
  readonly pageInfo: ListDraftsFragment["drafts"]["pageInfo"] &
    ListPublishedArticlesFragment["publishedArticles"]["pageInfo"];
  readonly nodes: readonly ArticleType[];
}

interface ArticleTableProps {
  readonly articlesList: ArticlesList;
  readonly rowsPerPage: RowsPerPage;
  readonly currentPage: number;
  readonly onChangePage: (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  readonly onChangeRowsPerPage: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
}

export const ArticleTable: FC<ArticleTableProps> = ({
  articlesList,
  currentPage,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
}) => (
  <>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>タイトル</TableCell>
            <TableCell>日時</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {articlesList.nodes.map(article => (
            <ArticleRow article={article} key={article.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={(rowsPerPageOptions as unknown) as number[]}
      page={currentPage}
      count={articlesList.totalCount}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
    />
  </>
);
