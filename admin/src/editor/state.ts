import { Editor, Node, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { MarkFormat, BlockFormat, isList, Block } from "./formats";

export const toggleMark = (editor: ReactEditor, format: MarkFormat): void => {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMarkActive = (
  editor: ReactEditor,
  format: MarkFormat
): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleBlock = (editor: ReactEditor, format: BlockFormat): void => {
  const isActive = isBlockActive(editor, format);

  Transforms.unwrapNodes(editor, {
    match: (node: Node) => isList(node["type"]),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? Block.Paragraph : isList(format) ? Block.ListItem : format,
  });

  if (!isActive && isList(format)) {
    Transforms.wrapNodes(editor, { type: format, children: [] });
  }
};

export const isBlockActive = (
  editor: ReactEditor,
  format: BlockFormat
): boolean => {
  const [matched] = Editor.nodes(editor, {
    match: (node: Node) => node["type"] === format,
  });
  return !!matched;
};
