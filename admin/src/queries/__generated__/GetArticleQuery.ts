/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticleQuery
// ====================================================

export interface GetArticleQuery_diary_article_body {
  readonly __typename: "ArticleBody";
  readonly html: string;
}

export interface GetArticleQuery_diary_article {
  readonly __typename: "PublishedArticle" | "Draft";
  readonly title: string | null;
  readonly body: GetArticleQuery_diary_article_body;
}

export interface GetArticleQuery_diary {
  readonly __typename: "Diary";
  readonly article: GetArticleQuery_diary_article | null;
}

export interface GetArticleQuery {
  readonly diary: GetArticleQuery_diary | null;
}

export interface GetArticleQueryVariables {
  readonly diaryID: string;
  readonly articleID: string;
}
