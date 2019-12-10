import React, { FC, FormEventHandler } from "react";
import Grid from "@material-ui/core/Grid";
import { Layout } from "../templates/Layout";
import {
  useAuthentication,
  isSignedIn,
  isUnauthenticated,
} from "../effects/authentication";
import { routes, getCurrentRoute } from "../routes";
import { ArticleEditor } from "../organisms/ArticleEditor";

export const NewArticlePage: FC = () => {
  const status = useAuthentication();

  if (isUnauthenticated(status)) {
    const { name: currentRouteName } = getCurrentRoute();
    routes.signIn.push({
      callbackRoute: currentRouteName === false ? undefined : currentRouteName,
    });
    return null;
  }

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
  };

  return (
    <Layout>
      <Grid item xs={12} spacing={0}>
        {isSignedIn(status) ? <ArticleEditor onSubmit={onSubmit} /> : null}
      </Grid>
    </Layout>
  );
};
