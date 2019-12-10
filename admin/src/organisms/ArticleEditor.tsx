import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FormEventHandler } from "react";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface ArticleEditorProps {
  readonly onSubmit: FormEventHandler;
}

export const ArticleEditor: FC<ArticleEditorProps> = ({ onSubmit }) => {
  const classes = useStyles();

  return (
    <form noValidate className={classes.form} onSubmit={onSubmit}>
      <Grid container spacing={0}>
        <Grid item sm={12} spacing={0}>
          <TextField
            variant="outlined"
            name="title"
            required
            fullWidth
            id="title"
            label="題"
            placeholder="今日の日記"
          />
        </Grid>
        <Grid item sm={12} spacing={0}>
          <TextField
            variant="outlined"
            name="body"
            required
            fullWidth
            id="body"
            placeholder="…"
            multiline
            rows={12}
          />
        </Grid>
        <Grid container justify="flex-start" spacing={0}>
          <Grid item spacing={0}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              公開する
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
