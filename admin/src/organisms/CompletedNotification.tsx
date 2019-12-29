import React, { FC } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import green from "@material-ui/core/colors/green";

interface CompletedNotificationProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly message: string;
}

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
}));

export const CompletedNotification: FC<CompletedNotificationProps> = ({
  open,
  onClose,
  message,
}) => {
  const classes = useStyles();
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <SnackbarContent
        className={classes.success}
        message={
          <span className={classes.message}>
            <CheckCircleIcon className={classes.icon} /> {message}
          </span>
        }
      />
    </Snackbar>
  );
};
