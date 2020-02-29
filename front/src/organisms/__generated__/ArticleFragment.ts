/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ArticleFragment
// ====================================================

export interface ArticleFragment_body {
  readonly __typename: "ArticleBody";
  readonly html: string;
}

export interface ArticleFragment {
  readonly __typename: "PublishedArticle";
  readonly id: string;
  readonly title: string | null;
  readonly publishedAt: any;
  readonly body: ArticleFragment_body;
}
