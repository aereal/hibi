/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DiarySettingsQuery
// ====================================================

export interface DiarySettingsQuery_diary {
  readonly __typename: "Diary";
  readonly name: string;
}

export interface DiarySettingsQuery {
  readonly diary: DiarySettingsQuery_diary | null;
}

export interface DiarySettingsQueryVariables {
  readonly diaryID: string;
}
