import React, { FC } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LIST_ARTICLES from "./list-articles.gql";
import {
  ListArticles,
  ListArticlesVariables,
} from "./__generated__/ListArticles";
import { ArticleList } from "../organisms/article-list";
import { MonodirectionalPager } from "../organisms/monodirectional-pager";
import { toSearchParams } from "../parsed-url-query";
import { tryParseInt } from "../try-parse-int";

const useStyles = makeStyles(theme => ({
  pageTitle: {
    margin: theme.spacing(3, 0),
  },
}));

export const ArticlesPage: FC = () => {
  const router = useRouter() ?? { query: {} };
  const params = toSearchParams(router.query);
  const currentPage = tryParseInt(params.get("page") ?? "1") ?? 1;
  const { loading, data } = useQuery<ListArticles, ListArticlesVariables>(
    LIST_ARTICLES,
    {
      variables: {
        diaryID: "gZJXFGCS7fONfpIKXWYn",
        articlesCount: 5,
        currentPage,
      },
    }
  );
  const classes = useStyles();
  if (loading) {
    return null;
  }
  if (!data) {
    return null;
  }
  if (!data.diary) {
    return <>diary not found</>;
  }
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography className={classes.pageTitle} variant="h3">
          {data.diary.name}
        </Typography>
        <ArticleList articles={data.diary.articles.nodes} />
        <MonodirectionalPager
          baseURL="/"
          pageInfo={data.diary.articles.pageInfo}
        />
      </Container>
    </>
  );
};
