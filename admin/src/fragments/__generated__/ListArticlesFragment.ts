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

export interface ListArticlesFragment_articles_nodes {
  readonly __typename: "Article";
  readonly id: string;
  readonly title: string | null;
  readonly publishedAt: any;
}

export interface ListArticlesFragment_articles {
  readonly __typename: "ArticleConnection";
  readonly pageInfo: ListArticlesFragment_articles_pageInfo;
  readonly nodes: ReadonlyArray<ListArticlesFragment_articles_nodes>;
}

export interface ListArticlesFragment {
  readonly __typename: "Diary";
  readonly articles: ListArticlesFragment_articles;
}
