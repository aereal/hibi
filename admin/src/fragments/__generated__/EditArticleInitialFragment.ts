/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: EditArticleInitialFragment
// ====================================================

export interface EditArticleInitialFragment_body {
  readonly __typename: "ArticleBody";
  readonly html: string;
}

export interface EditArticleInitialFragment {
  readonly __typename: "Article";
  readonly title: string | null;
  readonly body: EditArticleInitialFragment_body;
}
