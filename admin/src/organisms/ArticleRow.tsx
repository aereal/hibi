import React, { FC } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import { ListItemArticleFragment } from "../fragments/__generated__/ListItemArticleFragment";
import { routes } from "../routes";
import { ListItemDraftFragment } from "../fragments/__generated__/ListItemDraftFragment";

export type ArticleType = Omit<ListItemArticleFragment, "__typename"> &
  Omit<ListItemDraftFragment, "__typename">;

interface ArticleRowProps {
  readonly article: ArticleType;
}

export const ArticleRow: FC<ArticleRowProps> = ({ article }) => (
  <TableRow>
    <TableCell>{article.title}</TableCell>
    <TableCell>{article.createdAt}</TableCell>
    <TableCell padding="checkbox">
      <IconButton {...routes.editArticle.link({ articleID: article.id })}>
        <CreateIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);
