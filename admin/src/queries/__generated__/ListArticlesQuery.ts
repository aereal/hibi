/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ArticleOrder } from "./../../globalTypes";

// ====================================================
// GraphQL query operation: ListArticlesQuery
// ====================================================

export interface ListArticlesQuery_diary_articles_pageInfo {
  readonly __typename: "OffsetBasePageInfo";
  readonly hasNextPage: boolean;
  readonly nextPage: number | null;
}

export interface ListArticlesQuery_diary_articles_nodes {
  readonly __typename: "Article";
  readonly id: string;
  readonly title: string | null;
  readonly publishedAt: any;
}

export interface ListArticlesQuery_diary_articles {
  readonly __typename: "ArticleConnection";
  readonly pageInfo: ListArticlesQuery_diary_articles_pageInfo;
  readonly totalCount: number;
  readonly nodes: ReadonlyArray<ListArticlesQuery_diary_articles_nodes>;
}

export interface ListArticlesQuery_diary {
  readonly __typename: "Diary";
  readonly articles: ListArticlesQuery_diary_articles;
}

export interface ListArticlesQuery {
  readonly diary: ListArticlesQuery_diary | null;
}

export interface ListArticlesQueryVariables {
  readonly diaryID: string;
  readonly currentPage: number;
  readonly perPage: number;
  readonly order: ArticleOrder;
}
