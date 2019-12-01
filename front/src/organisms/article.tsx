import React, { FC } from "react";
import { ArticleFragment } from "./__generated__/ArticleFragment";

interface ArticleProps {
  readonly article: ArticleFragment;
}

export const Article: FC<ArticleProps> = ({ article }) => (
  <div>
    <h1>{article.title}</h1>
  </div>
);
