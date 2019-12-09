import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Layout } from "../templates/Layout";
import clsx from "clsx";

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
  return (
    <Layout>
      <Grid item xs={12} sm={6}>
        <Paper className={clsx(classes.paper, classes.fixedHeight)}>Root</Paper>
      </Grid>
    </Layout>
  );
};
