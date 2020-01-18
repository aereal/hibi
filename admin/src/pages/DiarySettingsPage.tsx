import React, { FC, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import clsx from "clsx";
import { useQuery } from "@apollo/react-hooks";
import { Layout } from "../templates/Layout";
import { DiarySettingsForm } from "../organisms/DiarySettingsForm";
import { ProvideAuthenApolloClientOrRedirect } from "../effects/authen-apollo-client";
import { CompletedNotification } from "../organisms/CompletedNotification";
import query from "../queries/DiarySettingsQuery.gql";
import {
  DiarySettingsQuery,
  DiarySettingsQueryVariables,
} from "../queries/__generated__/DiarySettingsQuery";

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

const Content: FC = () => {
  const diaryID = "gZJXFGCS7fONfpIKXWYn";
  const classes = useStyles();
  const [completed, setCompleted] = useState(false);
  const { data, loading } = useQuery<
    DiarySettingsQuery,
    DiarySettingsQueryVariables
  >(query, {
    variables: { diaryID },
  });

  const notifyCompleted = (): void => setCompleted(true);
  const onCloseNotification = (): void => setCompleted(false);

  if (loading || !data?.diary?.name) {
    return <LinearProgress />;
  }

  return (
    <>
      <Paper className={clsx(classes.paper, classes.fixedHeight)}>
        <DiarySettingsForm
          diaryID={diaryID}
          notifyCompleted={notifyCompleted}
          defaultValues={{ name: data.diary.name }}
        />
      </Paper>
      <CompletedNotification
        open={completed}
        message="保存しました"
        onClose={onCloseNotification}
      />
    </>
  );
};

export const DiarySettingsPage: FC = () => {
  return (
    <Layout>
      <Grid item xs={12} sm={6}>
        <ProvideAuthenApolloClientOrRedirect
          onLoading={() => <LinearProgress />}
        >
          <Content />
        </ProvideAuthenApolloClientOrRedirect>
      </Grid>
    </Layout>
  );
};
