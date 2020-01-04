import React, { FC, MouseEventHandler } from "react";
import LinkIcon from "@material-ui/icons/Link";
import { useSlate } from "slate-react";
import { ActionButton } from "../atoms/ActionButton";
import { insertLink, isLinkActive, unwrapLink } from "../editor/link";

export const LinkActionButton: FC = () => {
  const editor = useSlate();
  const isActive = isLinkActive(editor);
  const handleClick: MouseEventHandler<HTMLElement> = event => {
    event.preventDefault();
    if (isLinkActive(editor)) {
      unwrapLink(editor);
      return;
    }
    const url = window.prompt("URL"); // TODO
    if (url === null) {
      return;
    }
    insertLink(editor, url);
  };
  return (
    <ActionButton
      color={isActive ? "primary" : "default"}
      onClick={handleClick}
    >
      <LinkIcon />
    </ActionButton>
  );
};
