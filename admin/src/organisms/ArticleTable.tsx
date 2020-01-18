import React, { FC } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ListArticlesFragment } from "../fragments/__generated__/ListArticlesFragment";
import { ArticleRow } from "./ArticleRow";

interface ArticleTableProps {
  readonly articles: ListArticlesFragment["articles"]["nodes"];
}

export const ArticleTable: FC<ArticleTableProps> = ({ articles }) => (
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
          {articles.map(article => (
            <ArticleRow article={article} key={article.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);
