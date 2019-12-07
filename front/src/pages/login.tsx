import React, { FC } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { DefaultAuthenticationProvider } from "../effects/authentication";
import { AuthenticatedScreen } from "../organisms/authenticated-screen";

const useStyles = makeStyles(theme => ({
  pageTitle: {
    margin: theme.spacing(3, 0),
  },
}));

export const LoginPage: FC = () => {
  const { pageTitle } = useStyles();
  return (
    <DefaultAuthenticationProvider>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography className={pageTitle}>Login</Typography>
        <AuthenticatedScreen />
      </Container>
    </DefaultAuthenticationProvider>
  );
};
