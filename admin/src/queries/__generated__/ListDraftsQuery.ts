/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ArticleOrder } from "./../../globalTypes";

// ====================================================
// GraphQL query operation: ListDraftsQuery
// ====================================================

export interface ListDraftsQuery_diary_drafts_pageInfo {
  readonly __typename: "OffsetBasePageInfo";
  readonly hasNextPage: boolean;
  readonly nextPage: number | null;
}

export interface ListDraftsQuery_diary_drafts_nodes {
  readonly __typename: "Draft";
  readonly id: string;
  readonly title: string | null;
  readonly createdAt: any;
}

export interface ListDraftsQuery_diary_drafts {
  readonly __typename: "DraftConnection";
  readonly pageInfo: ListDraftsQuery_diary_drafts_pageInfo;
  readonly totalCount: number;
  readonly nodes: ReadonlyArray<ListDraftsQuery_diary_drafts_nodes>;
}

export interface ListDraftsQuery_diary {
  readonly __typename: "Diary";
  readonly drafts: ListDraftsQuery_diary_drafts;
}

export interface ListDraftsQuery {
  readonly diary: ListDraftsQuery_diary | null;
}

export interface ListDraftsQueryVariables {
  readonly diaryID: string;
  readonly currentPage: number;
  readonly perPage: number;
  readonly order: ArticleOrder;
}
