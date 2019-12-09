import React, { FC, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import { DrawerMenu } from "../organisms/DrawerMenu";

const useStyles = makeStyles<Theme, { drawerWidth: number }>(theme => ({
  appBar: () => ({
    transition: theme.transitions.create(["width", "margin"], {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    zIndex: theme.zIndex.drawer + 1,
  }),
  appBarShift: {
    marginLeft: ({ drawerWidth }): number => drawerWidth,
    transition: theme.transitions.create(["width", "margin"], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: ({ drawerWidth }): string => `calc(100% - ${drawerWidth}px)`,
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24,
  },
  title: {
    flexGrow: 1,
  },
}));

export const Layout: FC = ({ children }) => {
  const drawerWidth = 240;
  const classes = useStyles({ drawerWidth });
  const [openDrawer, setOpenDrawer] = useState(true);
  const handleDrawerOpen = (): void => setOpenDrawer(true);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        className={clsx(classes.appBar, openDrawer && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open Menu"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              openDrawer && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Hibi
          </Typography>
        </Toolbar>
      </AppBar>
      <DrawerMenu
        open={openDrawer}
        setOpen={setOpenDrawer}
        drawerWidth={drawerWidth}
      />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {children}
          </Grid>
        </Container>
      </main>
    </div>
  );
};
