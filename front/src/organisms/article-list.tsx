import React, { FC } from "react";
import { Article, ArticleProps } from "./article";

interface ArticleListProps {
  readonly articles: ReadonlyArray<ArticleProps["article"]>;
}

export const ArticleList: FC<ArticleListProps> = ({ articles }) => (
  <>
    {articles.map((article, idx) => (
      <Article article={article} key={idx} />
    ))}
  </>
);
