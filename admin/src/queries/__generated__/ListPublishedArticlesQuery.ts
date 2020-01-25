/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ArticleOrder } from "./../../globalTypes";

// ====================================================
// GraphQL query operation: ListPublishedArticlesQuery
// ====================================================

export interface ListPublishedArticlesQuery_diary_publishedArticles_pageInfo {
  readonly __typename: "OffsetBasePageInfo";
  readonly hasNextPage: boolean;
  readonly nextPage: number | null;
}

export interface ListPublishedArticlesQuery_diary_publishedArticles_nodes {
  readonly __typename: "PublishedArticle";
  readonly id: string;
  readonly title: string | null;
  readonly createdAt: any;
}

export interface ListPublishedArticlesQuery_diary_publishedArticles {
  readonly __typename: "PublishedArticleConnection";
  readonly pageInfo: ListPublishedArticlesQuery_diary_publishedArticles_pageInfo;
  readonly totalCount: number;
  readonly nodes: ReadonlyArray<ListPublishedArticlesQuery_diary_publishedArticles_nodes>;
}

export interface ListPublishedArticlesQuery_diary {
  readonly __typename: "Diary";
  readonly publishedArticles: ListPublishedArticlesQuery_diary_publishedArticles;
}

export interface ListPublishedArticlesQuery {
  readonly diary: ListPublishedArticlesQuery_diary | null;
}

export interface ListPublishedArticlesQueryVariables {
  readonly diaryID: string;
  readonly currentPage: number;
  readonly perPage: number;
  readonly order: ArticleOrder;
}
