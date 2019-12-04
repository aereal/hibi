import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { ArticleFragment } from "./__generated__/ArticleFragment";
import { DateTime } from "../atoms/date-time";

export interface ArticleProps {
  article: ArticleFragment;
}

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
    padding: theme.spacing(3, 2),
  },
}));

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export const Article: FC<ArticleProps> = ({ article }) => {
  const { root } = useStyles();
  return (
    <Paper square elevation={0} className={root}>
      <Typography variant="h5">{article.title}</Typography>
      <DateTime formatter={dateTimeFormatter} datetime={article.publishedAt} />
      <div dangerouslySetInnerHTML={{ __html: article.body.html }} />
    </Paper>
  );
};
