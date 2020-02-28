/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ListArticlesFragment
// ====================================================

export interface ListArticlesFragment_articles_pageInfo {
  readonly __typename: "OffsetBasePageInfo";
  readonly hasNextPage: boolean;
  readonly nextPage: number | null;
}

export interface ListArticlesFragment_articles_nodes_PublishedArticle {
  readonly __typename: "PublishedArticle";
  readonly id: string;
  readonly title: string | null;
  readonly createdAt: any;
}

export interface ListArticlesFragment_articles_nodes_Draft {
  readonly __typename: "Draft";
  readonly id: string;
  readonly title: string | null;
  readonly createdAt: any;
}

export type ListArticlesFragment_articles_nodes = ListArticlesFragment_articles_nodes_PublishedArticle | ListArticlesFragment_articles_nodes_Draft;

export interface ListArticlesFragment_articles {
  readonly __typename: "ArticleConnection";
  readonly pageInfo: ListArticlesFragment_articles_pageInfo;
  readonly totalCount: number;
  readonly nodes: ReadonlyArray<ListArticlesFragment_articles_nodes>;
}

export interface ListArticlesFragment {
  readonly __typename: "Diary";
  readonly articles: ListArticlesFragment_articles;
}
