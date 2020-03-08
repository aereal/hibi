import React, { FC, useState } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Route } from "type-route";
import Helmet from "react-helmet";
import { Layout } from "../templates/Layout";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { ArticleEditor } from "../organisms/ArticleEditor";
import { CompletedNotification } from "../organisms/CompletedNotification";
import { routes } from "../routes";
import query from "../queries/GetArticleQuery.gql";
import {
  GetArticleQuery,
  GetArticleQueryVariables,
} from "../queries/__generated__/GetArticleQuery";
import { useQuery } from "@apollo/react-hooks";

interface EditArticlePageContentProps {
  readonly articleID: string;
  readonly diaryID: string;
}

const EditArticlePageContent: FC<EditArticlePageContentProps> = ({
  diaryID,
  articleID,
}) => {
  const { data, error, loading } = useQuery<
    GetArticleQuery,
    GetArticleQueryVariables
  >(query, {
    variables: {
      diaryID,
      articleID: normalizeArticleID(articleID),
    },
  });
  const [published, setPublished] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  if (error) {
    return <>! ${JSON.stringify(error)}</>;
  }

  if (loading) {
    return <LinearProgress />;
  }

  if (!data?.diary?.article) {
    return <>Not Found</>;
  }

  const onPublished = (): void => setPublished(true);
  const onClosePublishedNotification = (): void => setPublished(false);

  const onDraftSaved = (): void => setDraftSaved(true);
  const onCloseSavedNotification = (): void => setDraftSaved(false);

  return (
    <>
      <ArticleEditor
        onPublished={onPublished}
        onDraftSaved={onDraftSaved}
        defaultTitle={data.diary.article.title ?? ""}
        defaultBodyHTML={data.diary.article.body.html}
        articleID={articleID}
      />
      <CompletedNotification
        open={published}
        onClose={onClosePublishedNotification}
        message="公開しました"
      />
      <CompletedNotification
        open={draftSaved}
        onClose={onCloseSavedNotification}
        message="保存しました"
      />
    </>
  );
};

interface EditArticlePageProps {
  readonly editArticlePageRoute: Route<typeof routes.editArticle>;
}

export const EditArticlePage: FC<EditArticlePageProps> = ({
  editArticlePageRoute: {
    params: { articleID },
  },
}) => (
  <>
    <Helmet>
      <title>日記を編集 ({articleID}) - hibi</title>
    </Helmet>
    <Layout>
      <Grid item xs={12} spacing={0}>
        <ProvideAuthenApolloClientOrRedirect
          onLoading={() => <LinearProgress />}
        >
          <EditArticlePageContent
            diaryID="gZJXFGCS7fONfpIKXWYn"
            articleID={articleID}
          />
        </ProvideAuthenApolloClientOrRedirect>
      </Grid>
    </Layout>
  </>
);

const normalizeArticleID = (id: string): string =>
  !id.includes("%") ? encodeURIComponent(id) : id;
