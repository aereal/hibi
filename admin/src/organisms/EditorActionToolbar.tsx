import React, { FC } from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CodeIcon from "@material-ui/icons/Code";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import Looks1Icon from "@material-ui/icons/LooksOne";
import Looks2Icon from "@material-ui/icons/LooksTwo";
import Looks3Icon from "@material-ui/icons/Looks3";
import { MarkButton } from "./MarkButton";
import { BlockButton } from "./BlockButton";
import { Mark, Block } from "../editor/formats";
import { LinkActionButton } from "./LinkActionButton";

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
        <LinkActionButton />
      </ButtonGroup>
      <ButtonGroup size="large" disableRipple>
        <BlockButton format={Block.H1} icon={<Looks1Icon />} />
        <BlockButton format={Block.H2} icon={<Looks2Icon />} />
        <BlockButton format={Block.H3} icon={<Looks3Icon />} />
        <BlockButton
          format={Block.BulletedList}
          icon={<FormatListBulletedIcon />}
        />
        <BlockButton
          format={Block.NumberedList}
          icon={<FormatListNumberedIcon />}
        />
        <BlockButton format={Block.Quote} icon={<FormatQuoteIcon />} />
      </ButtonGroup>
    </>
  );
};
