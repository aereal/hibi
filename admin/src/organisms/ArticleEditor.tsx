import React, {
  FC,
  FormEvent,
  useState,
  ChangeEventHandler,
  MouseEvent,
} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { RichTextEditor } from "./RichTextEditor";
import { usePostMutation } from "../mutations/usePostArticleMutation";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  saveAsDraft: {
    margin: theme.spacing(3, 1, 2),
  },
}));

interface ArticleEditorProps {
  readonly onPublished: () => void;
  readonly onDraftSaved: () => void;
  readonly defaultTitle: string;
  readonly defaultBodyHTML: string;
  readonly articleID?: string;
}

export const ArticleEditor: FC<ArticleEditorProps> = ({
  onPublished,
  onDraftSaved,
  defaultTitle,
  defaultBodyHTML,
  articleID,
}) => {
  const classes = useStyles();
  const { doMutation, error, loading } = usePostMutation(
    "gZJXFGCS7fONfpIKXWYn",
    articleID
  );
  const [title, setTitle] = useState(defaultTitle);
  const [bodyHTML, setBodyHTML] = useState(defaultBodyHTML);

  const handleChangeBody = (body: string): void => setBodyHTML(body);

  const handleChangeTitle: ChangeEventHandler<HTMLInputElement> = event =>
    setTitle(event.target.value);

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    await doMutation({ title, bodyHTML });
    setTitle("");
    setBodyHTML("");
    onPublished();
  };

  const handleSaveAsDraft = async (event: MouseEvent): Promise<void> => {
    event.preventDefault();
    await doMutation({ title, bodyHTML, saveAsDraft: true });
    setTitle("");
    setBodyHTML("");
    onDraftSaved();
  };

  if (error !== undefined) {
    return (
      <>
        <div>! Error</div>
        <pre>{JSON.stringify(error)}</pre>
      </>
    );
  }

  return (
    <form noValidate className={classes.form} onSubmit={handleSubmit}>
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
            onChange={handleChangeTitle}
          />
        </Grid>
        <Grid item sm={12} spacing={0}>
          <RichTextEditor
            defaultValue={bodyHTML}
            onChangeBody={handleChangeBody}
            style={{ minHeight: "50vh" }}
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
          <Grid item spacing={0}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              className={classes.saveAsDraft}
              disabled={loading}
              onClick={handleSaveAsDraft}
            >
              下書きとして保存する
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
