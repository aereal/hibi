import React, { FC, MouseEventHandler, useState } from "react";
import LinkIcon from "@material-ui/icons/Link";
import { useSlate } from "slate-react";
import { Range, Transforms } from "slate";
import { ActionButton } from "../atoms/ActionButton";
import { insertLink, isLinkActive, unwrapLink } from "../editor/link";
import { InputURLDialog } from "./InputURLDialog";

export const LinkActionButton: FC = () => {
  const editor = useSlate();
  const [openDialog, setOpenDialog] = useState(false);
  const [url, setURL] = useState<string>();
  const [currentSelection, setCurrentSelection] = useState<Range>();
  const isActive = isLinkActive(editor);
  const handleClick: MouseEventHandler<HTMLElement> = event => {
    event.preventDefault();
    if (isLinkActive(editor)) {
      unwrapLink(editor);
      return;
    }
    if (url === undefined) {
      setOpenDialog(true);
      setCurrentSelection(editor.selection ?? undefined);
      return;
    }
  };
  const doClose = (): void => {
    setOpenDialog(false);
    setURL(undefined);
  };
  const doSubmit = (): void => {
    setOpenDialog(false);
    if (url !== undefined && currentSelection !== undefined) {
      Transforms.select(editor, currentSelection);
      insertLink(editor, url);
    }
    setURL(undefined);
    setCurrentSelection(undefined);
  };
  return (
    <>
      <ActionButton
        color={isActive ? "primary" : "default"}
        onClick={handleClick}
      >
        <LinkIcon />
      </ActionButton>
      <InputURLDialog
        open={openDialog}
        close={doClose}
        submit={doSubmit}
        setURL={setURL}
      />
    </>
  );
};
