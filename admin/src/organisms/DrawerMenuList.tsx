import React, { FC } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";

const signOutWithConfirmation = () => {
  if (window.confirm("ログアウトしますか?")) {
    // TODO
  }
};

export const DrawerMenuList: FC = () => (
  <>
    <Divider />
    <List>
      <ListItem button>
        <ListItemIcon>
          <CreateIcon />
        </ListItemIcon>
        <ListItemText primary="記事を書く" />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button onClick={signOutWithConfirmation}>
        <ListItemIcon>
          <CloseIcon />
        </ListItemIcon>
        <ListItemText primary="ログアウト" />
      </ListItem>
    </List>
  </>
);
