import { useMutation } from "@apollo/react-hooks";
import {
  PostArticleMutation,
  PostArticleMutationVariables,
} from "./__generated__/PostArticleMutation";
import {
  UpdateArticleMutation,
  UpdateArticleMutationVariables,
} from "./__generated__/UpdateArticleMutation";
import postNewMutation from "./PostArticleMutation.gql";
import updateMutation from "./UpdateArticleMutation.gql";

interface ArticleUpdatePayload {
  readonly title: string;
  readonly bodyHTML: string;
}

export const usePostMutation = (diaryID: string, articleID?: string) => {
  if (articleID !== undefined) {
    const [doMutation, { error, loading }] = useMutation<
      UpdateArticleMutation,
      UpdateArticleMutationVariables
    >(updateMutation);
    return {
      error,
      loading,
      doMutation: (toUpdate: ArticleUpdatePayload) =>
        doMutation({
          variables: {
            diaryID,
            articleID,
            articleToUpdate: toUpdate,
          },
        }),
    };
  } else {
    const [doMutation, { error, loading }] = useMutation<
      PostArticleMutation,
      PostArticleMutationVariables
    >(postNewMutation);
    return {
      error,
      loading,
      doMutation: (newArticle: ArticleUpdatePayload) =>
        doMutation({
          variables: {
            newArticle: {
              diaryID,
              ...newArticle,
            },
          },
        }),
    };
  }
};
