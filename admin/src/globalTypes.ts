/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ArticleOrderField {
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
}

export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum PublishState {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface ArticleOrder {
  readonly field: ArticleOrderField;
  readonly direction: OrderDirection;
}

export interface ArticleToPost {
  readonly title: string;
  readonly bodyHTML: string;
  readonly publishState?: PublishState | null;
}

export interface DiarySettings {
  readonly name: string;
}

export interface NewArticle {
  readonly diaryID: string;
  readonly title: string;
  readonly bodyHTML: string;
  readonly isDraft: boolean;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
