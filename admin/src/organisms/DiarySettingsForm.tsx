import React, { FC, useState, ChangeEventHandler, FormEvent } from "react";
import { useMutation } from "@apollo/react-hooks";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  UpdateDiarySettingsMutation,
  UpdateDiarySettingsMutationVariables,
} from "./__generated__/UpdateDiarySettingsMutation";
import mutation from "./UpdateDiarySettingsMutation.gql";

interface Fields {
  readonly name: string;
}

interface DiarySettingsFormProps {
  readonly defaultValues: Fields;
  readonly diaryID: string;
  readonly notifyCompleted: () => void;
}

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const DiarySettingsForm: FC<DiarySettingsFormProps> = ({
  notifyCompleted,
  defaultValues,
  diaryID,
}) => {
  const classes = useStyles();
  const [doMutation, { error, loading }] = useMutation<
    UpdateDiarySettingsMutation,
    UpdateDiarySettingsMutationVariables
  >(mutation);
  const [name, setName] = useState(defaultValues.name);

  if (error) {
    return (
      <>
        <div>! Error</div>
        <pre>{JSON.stringify(error)}</pre>
      </>
    );
  }

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    await doMutation({ variables: { diaryID, settings: { name } } });
    notifyCompleted();
  };

  return (
    <form noValidate className={classes.form} onSubmit={handleSubmit}>
      <Grid container spacing={0}>
        <Grid item sm={12} spacing={0}>
          <TextField
            variant="outlined"
            name="name"
            required
            fullWidth
            id="name"
            disabled={loading}
            value={name}
            onChange={handleChangeName}
          />
        </Grid>
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
            保存する
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
