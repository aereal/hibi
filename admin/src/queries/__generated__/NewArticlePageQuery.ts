/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NewArticlePageQuery
// ====================================================

export interface NewArticlePageQuery_diary {
  readonly __typename: "Diary";
  readonly name: string;
}

export interface NewArticlePageQuery {
  readonly diary: NewArticlePageQuery_diary | null;
}

export interface NewArticlePageQueryVariables {
  readonly diaryID: string;
}
