import React, {
  FC,
  useCallback,
  useMemo,
  useState,
  CSSProperties,
} from "react";
import { createEditor, Node as SlateNode } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import Paper from "@material-ui/core/Paper";
import { EditorActionToolbar } from "./EditorActionToolbar";
import { BlockFormat, isLinkElement } from "../editor/formats";
import {
  SerializedMark,
  serialize,
  deserializeHTML,
  blockSerializers,
} from "../editor/conversion";
import { withLink } from "../editor/link";

interface RichTextEditorProps {
  readonly onChangeBody: (body: string) => void;
  readonly defaultValue: string;
  readonly style?: CSSProperties;
}

export const RichTextEditor: FC<RichTextEditorProps> = ({
  onChangeBody,
  defaultValue,
  style,
}) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withLink(withReact(createEditor())), []);
  const [value, setValue] = useState<SlateNode[]>(
    deserializeHTML(defaultValue)
  );

  const handleChange = (nodes: SlateNode[]): void => {
    setValue(nodes);
    onChangeBody(serialize(nodes));
  };

  return (
    <Slate value={value} editor={editor} onChange={handleChange}>
      <EditorActionToolbar />
      <Paper>
        <Editable
          style={style}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly={false}
        />
      </Paper>
      <pre>{serialize(value)}</pre>
    </Slate>
  );
};

const Element: FC<RenderElementProps> = ({ element, attributes, children }) => {
  if (isLinkElement(element)) {
    return (
      <a href={element.url} {...attributes}>
        {children}
      </a>
    );
  }
  const blockSerializer = blockSerializers[element["type"] as BlockFormat];
  if (blockSerializer) {
    return blockSerializer({ children, attributes, element });
  }
  return null;
};

const Leaf: FC<RenderLeafProps> = ({ attributes, children, leaf }) => (
  <span {...attributes}>
    <SerializedMark leaf={leaf}>{children}</SerializedMark>
  </span>
);
