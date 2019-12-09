import React, { FC, Dispatch, SetStateAction } from "react";
import Drawer from "@material-ui/core/Drawer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import clsx from "clsx";
import { DrawerMenuList } from "./DrawerMenuList";

const useStyles = makeStyles<Theme, { drawerWidth: number }>(theme => ({
  drawerPaper: {
    position: "relative",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    whiteSpace: "nowrap",
    width: ({ drawerWidth }): number => drawerWidth,
  },
  drawerPaperClose: () => ({
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  }),
  toolbarIcon: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
}));

interface DrawerMenuProps {
  readonly open: boolean;
  readonly setOpen: Dispatch<SetStateAction<boolean>>;
  readonly drawerWidth: number;
}

export const DrawerMenu: FC<DrawerMenuProps> = ({
  open,
  setOpen,
  drawerWidth,
}) => {
  const classes = useStyles({ drawerWidth });
  const handleDrawerClose = (): void => setOpen(false);

  return (
    <Drawer
      variant="permanent"
      open={open}
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <DrawerMenuList />
    </Drawer>
  );
};
