/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ArticleToPost } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateArticleMutation
// ====================================================

export interface UpdateArticleMutation {
  readonly updateArticle: boolean;
}

export interface UpdateArticleMutationVariables {
  readonly diaryID: string;
  readonly articleID: string;
  readonly articleToUpdate: ArticleToPost;
}
