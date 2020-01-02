import React, { FC } from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CodeIcon from "@material-ui/icons/Code";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import { MarkButton } from "./MarkButton";
import { Mark } from "../editor/formats";

export const EditorActionToolbar: FC = () => {
  return (
    <>
      <ButtonGroup size="large" disableRipple>
        <MarkButton
          format={Mark.Bold}
          aria-label="bold"
          icon={<FormatBoldIcon />}
        />
        <MarkButton
          format={Mark.Italic}
          aria-label="italic"
          icon={<FormatItalicIcon />}
        />
        <MarkButton
          format={Mark.Underlined}
          aria-label="underlined"
          icon={<FormatUnderlinedIcon />}
        />
        <MarkButton format={Mark.Code} aria-label="code" icon={<CodeIcon />} />
      </ButtonGroup>
    </>
  );
};
