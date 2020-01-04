import React, { FC, ReactNode, MouseEventHandler } from "react";
import { useSlate } from "slate-react";
import { ActionButton } from "../atoms/ActionButton";
import { BlockFormat } from "../editor/formats";
import { isBlockActive, toggleBlock } from "../editor/state";

interface BlockButtonProps {
  readonly icon: ReactNode;
  readonly format: BlockFormat;
}

export const BlockButton: FC<BlockButtonProps> = ({ icon, format }) => {
  const editor = useSlate();
  const onClick: MouseEventHandler<HTMLElement> = event => {
    event.preventDefault();
    toggleBlock(editor, format);
  };
  return (
    <ActionButton
      color={isBlockActive(editor, format) ? "primary" : "default"}
      onClick={onClick}
    >
      {icon}
    </ActionButton>
  );
};
