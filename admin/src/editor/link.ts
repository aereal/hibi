import { Editor, Transforms, Range } from "slate";
import { ReactEditor } from "slate-react";
import { LinkElement, isLinkElement, Block } from "./formats";

export const isLinkActive = (editor: ReactEditor): boolean => {
  const [matched] = Editor.nodes(editor, {
    match: isLinkElement,
  });
  return !!matched;
};

export const unwrapLink = (editor: ReactEditor): void =>
  Transforms.unwrapNodes(editor, { match: isLinkElement });

const wrapLink = (editor: ReactEditor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection !== null && Range.isCollapsed(selection);
  const linkEl: LinkElement = {
    type: Block.Link,
    children: isCollapsed ? [{ text: url }] : [],
    url,
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, linkEl);
  } else {
    Transforms.wrapNodes(editor, linkEl, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const insertLink = (editor: ReactEditor, url: string): void => {
  if (editor.selection === null) {
    return;
  }
  wrapLink(editor, url);
};

export const withLink = <T extends ReactEditor>(editor: T): ReactEditor => {
  const { isInline } = editor;

  editor.isInline = (element): boolean => {
    return isLinkElement(element) ? true : isInline(element);
  };

  return editor;
};
