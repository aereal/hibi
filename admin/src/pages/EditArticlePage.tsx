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
import query from "./GetArticleQuery.gql";
import {
  GetArticleQuery,
  GetArticleQueryVariables,
} from "./__generated__/GetArticleQuery";
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
      articleID,
    },
  });
  const [completed, setCompleted] = useState(false);

  if (error) {
    return <>! ${JSON.stringify(error)}</>;
  }

  if (loading) {
    return <LinearProgress />;
  }

  if (!data?.diary?.article) {
    return <>Not Found</>;
  }

  const onSubmit = (): void => {
    setCompleted(true);
  };

  const onCloseNotification = () => {
    setCompleted(false);
  };

  return (
    <>
      <ArticleEditor
        onSubmit={onSubmit}
        defaultTitle={data.diary.article.title ?? ""}
        defaultBodyHTML={data.diary.article.body.html}
        articleID={articleID}
      />
      <CompletedNotification
        open={completed}
        onClose={onCloseNotification}
        message="公開しました"
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
