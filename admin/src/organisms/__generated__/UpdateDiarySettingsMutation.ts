/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DiarySettings } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateDiarySettingsMutation
// ====================================================

export interface UpdateDiarySettingsMutation {
  readonly updateDiarySettings: boolean;
}

export interface UpdateDiarySettingsMutationVariables {
  readonly diaryID: string;
  readonly settings: DiarySettings;
}
