/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PermalinkQuery
// ====================================================

export interface PermalinkQuery_diary_article_Draft {
  readonly __typename: "Draft";
}

export interface PermalinkQuery_diary_article_PublishedArticle_body {
  readonly __typename: "ArticleBody";
  readonly html: string;
}

export interface PermalinkQuery_diary_article_PublishedArticle {
  readonly __typename: "PublishedArticle";
  readonly id: string;
  readonly title: string | null;
  readonly publishedAt: any;
  readonly body: PermalinkQuery_diary_article_PublishedArticle_body;
}

export type PermalinkQuery_diary_article = PermalinkQuery_diary_article_Draft | PermalinkQuery_diary_article_PublishedArticle;

export interface PermalinkQuery_diary {
  readonly __typename: "Diary";
  readonly name: string;
  readonly article: PermalinkQuery_diary_article | null;
}

export interface PermalinkQuery {
  readonly diary: PermalinkQuery_diary | null;
}

export interface PermalinkQueryVariables {
  readonly diaryID: string;
  readonly articleID: string;
}
