import React, { FC, ChangeEventHandler, FormEventHandler } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

interface InputURLDialogProps {
  readonly open: boolean;
  readonly close: () => void;
  readonly submit: () => void;
  readonly setURL: (url: string) => void;
}

export const InputURLDialog: FC<InputURLDialogProps> = ({
  open,
  setURL,
  close,
  submit,
}) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = event =>
    setURL(event.target.value);

  const handleSubmit: FormEventHandler<HTMLElement> = event => {
    event.preventDefault();
    event.stopPropagation();
    submit();
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>URL to link</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            onChange={handleChange}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={submit} color="primary">
          Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};
