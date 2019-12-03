/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListArticles
// ====================================================

export interface ListArticles_diary_articles_nodes {
  readonly __typename: "Article";
  readonly title: string | null;
}

export interface ListArticles_diary_articles {
  readonly __typename: "ArticleConnection";
  readonly nodes: ReadonlyArray<ListArticles_diary_articles_nodes>;
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
}
