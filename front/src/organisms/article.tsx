import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { ArticleFragment } from "./__generated__/ArticleFragment";

export interface ArticleProps {
  article: ArticleFragment;
}

const useStyles = makeStyles(theme => ({
  root: {
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
  const localPublishedAt = new Date(
    Date.parse(article.publishedAt) // + 60 * 60 * 9
  );
  const formattedPublishedAt = dateTimeFormatter.format(localPublishedAt);
  return (
    <Paper square elevation={0} className={root}>
      <Typography variant="h5">{article.title}</Typography>
      <Typography component="time">{formattedPublishedAt}</Typography>
      <div dangerouslySetInnerHTML={{ __html: article.body.html }} />
    </Paper>
  );
};
