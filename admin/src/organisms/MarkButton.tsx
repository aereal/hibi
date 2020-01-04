import React, { FC, ReactNode, MouseEventHandler } from "react";
import { useSlate } from "slate-react";
import { ActionButton } from "../atoms/ActionButton";
import { MarkFormat } from "../editor/formats";
import { toggleMark, isMarkActive } from "../editor/state";

interface MarkButtonProps {
  readonly icon: ReactNode;
  readonly format: MarkFormat;
}

export const MarkButton: FC<MarkButtonProps> = ({ icon, format }) => {
  const editor = useSlate();
  const onClick: MouseEventHandler<HTMLElement> = event => {
    event.preventDefault();
    toggleMark(editor, format);
  };
  return (
    <ActionButton
      color={isMarkActive(editor, format) ? "primary" : "default"}
      onClick={onClick}
    >
      {icon}
    </ActionButton>
  );
};
