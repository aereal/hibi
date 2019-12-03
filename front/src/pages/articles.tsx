import React, { FC } from "react";
import { useQuery } from "@apollo/react-hooks";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import LIST_ARTICLES from "./list-articles.gql";
import {
  ListArticles,
  ListArticlesVariables,
} from "./__generated__/ListArticles";
import { ArticleList } from "../organisms/article-list";

export const ArticlesPage: FC = () => {
  const { loading, data } = useQuery<ListArticles, ListArticlesVariables>(
    LIST_ARTICLES,
    {
      variables: { diaryID: "gZJXFGCS7fONfpIKXWYn", articlesCount: 15 },
    }
  );
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
        <Typography variant="h3">{data.diary.name}</Typography>
        <ArticleList articles={data.diary.articles.nodes} />
      </Container>
    </>
  );
};
