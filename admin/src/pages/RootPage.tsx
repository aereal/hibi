import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import clsx from "clsx";
import Helmet from "react-helmet";
import { Layout } from "../templates/Layout";
import {
  useAuthentication,
  isSignedIn,
  isUnauthenticated,
} from "../effects/authentication";
import { routes, getCurrentRoute } from "../routes";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export const RootPage: FC = () => {
  const classes = useStyles();
  const status = useAuthentication();

  if (isUnauthenticated(status)) {
    const { name: currentRouteName } = getCurrentRoute();
    routes.signIn.push({
      callbackRoute: currentRouteName === false ? undefined : currentRouteName,
    });
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Hibi</title>
      </Helmet>
      <Layout>
        <Grid item xs={12} sm={6}>
          {isSignedIn(status) ? (
            <Paper className={clsx(classes.paper, classes.fixedHeight)}>
              <List component="nav">
                <ListItem button {...routes.diarySettings.link()}>
                  <ListItemText primary="設定" />
                </ListItem>
              </List>
            </Paper>
          ) : null}
        </Grid>
      </Layout>
    </>
  );
};
