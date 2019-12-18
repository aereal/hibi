import React, { FC, FormEventHandler } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export interface ChangeItem {
  readonly name: "title" | "markdownBody";
  readonly value: string;
}

interface ArticleEditorProps {
  readonly onSubmit: FormEventHandler;
  readonly loading: boolean;
  readonly title: string;
  readonly markdownBody: string;
  readonly onChange: (item: ChangeItem) => void;
}

export const ArticleEditor: FC<ArticleEditorProps> = ({
  onSubmit,
  loading,
  title,
  markdownBody,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <form
      noValidate
      className={classes.form}
      onSubmit={event => onSubmit(event)}
    >
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
            value={title}
            disabled={loading}
            onChange={event =>
              onChange({ name: "title", value: event.target.value })
            }
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
            value={markdownBody}
            disabled={loading}
            onChange={event =>
              onChange({ name: "markdownBody", value: event.target.value })
            }
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
              disabled={loading}
            >
              公開する
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
