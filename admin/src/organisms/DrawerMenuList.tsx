import React, { FC } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import SettingsIcon from "@material-ui/icons/Settings";
import { signOut } from "../effects/authentication";
import { routes } from "../routes";

const signOutWithConfirmation = () => {
  if (window.confirm("ログアウトしますか?")) {
    signOut();
  }
};

export const DrawerMenuList: FC = () => (
  <>
    <Divider />
    <List>
      <ListItem button {...routes.newArticle.link()}>
        <ListItemIcon>
          <CreateIcon />
        </ListItemIcon>
        <ListItemText primary="記事を書く" />
      </ListItem>
      <ListItem button {...routes.diarySettings.link()}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="設定" />
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
