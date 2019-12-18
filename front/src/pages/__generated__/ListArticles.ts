/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListArticles
// ====================================================

export interface ListArticles_diary_articles_nodes_body {
  readonly __typename: "ArticleBody";
  readonly html: string;
}

export interface ListArticles_diary_articles_nodes {
  readonly __typename: "Article";
  readonly title: string | null;
  readonly publishedAt: any;
  readonly body: ListArticles_diary_articles_nodes_body;
}

export interface ListArticles_diary_articles_pageInfo {
  readonly __typename: "OffsetBasePageInfo";
  readonly hasNextPage: boolean;
  readonly nextPage: number | null;
}

export interface ListArticles_diary_articles {
  readonly __typename: "ArticleConnection";
  readonly nodes: ReadonlyArray<ListArticles_diary_articles_nodes>;
  readonly pageInfo: ListArticles_diary_articles_pageInfo;
}

export interface ListArticles_diary {
  readonly __typename: "Diary";
  readonly name: string;
  readonly articles: ListArticles_diary_articles;
}

export interface ListArticles {
  readonly diary: ListArticles_diary | null;
}

export interface ListArticlesVariables {
  readonly diaryID: string;
  readonly articlesCount: number;
  readonly currentPage: number;
}
