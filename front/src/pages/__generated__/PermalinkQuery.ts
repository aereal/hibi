/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PermalinkQuery
// ====================================================

export interface PermalinkQuery_diary_publishedArticle_body {
  readonly __typename: "ArticleBody";
  readonly html: string;
}

export interface PermalinkQuery_diary_publishedArticle {
  readonly __typename: "PublishedArticle";
  readonly id: string;
  readonly title: string | null;
  readonly publishedAt: any;
  readonly body: PermalinkQuery_diary_publishedArticle_body;
}

export interface PermalinkQuery_diary {
  readonly __typename: "Diary";
  readonly name: string;
  readonly publishedArticle: PermalinkQuery_diary_publishedArticle | null;
}

export interface PermalinkQuery {
  readonly diary: PermalinkQuery_diary | null;
}

export interface PermalinkQueryVariables {
  readonly diaryID: string;
  readonly articleID: string;
}
