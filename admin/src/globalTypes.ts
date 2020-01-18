/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ArticleOrderField {
  PUBLISHED_AT = "PUBLISHED_AT",
}

export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export interface ArticleOrder {
  readonly field: ArticleOrderField;
  readonly direction: OrderDirection;
}

export interface ArticleToPost {
  readonly title: string;
  readonly bodyHTML: string;
}

export interface DiarySettings {
  readonly name: string;
}

export interface NewArticle {
  readonly diaryID: string;
  readonly title: string;
  readonly bodyHTML: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
