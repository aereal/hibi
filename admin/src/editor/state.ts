import { Editor } from "slate";
import { ReactEditor } from "slate-react";
import { MarkFormat } from "./formats";

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
