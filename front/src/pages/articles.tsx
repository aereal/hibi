import React, { FC } from "react";
import { useQuery } from "@apollo/react-hooks";
import LIST_ARTICLES from "./list-articles.gql";
import {
  ListArticles,
  ListArticlesVariables,
} from "./__generated__/ListArticles";

export const ArticlesPage: FC = () => {
  const { loading, data } = useQuery<ListArticles, ListArticlesVariables>(
    LIST_ARTICLES,
    {
      variables: { diaryID: "126" },
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
      <h1>
        Diary: {JSON.stringify(data.diary.name)}{" "}
        {data.diary.articles.nodes.length} articles
      </h1>
    </>
  );
};
