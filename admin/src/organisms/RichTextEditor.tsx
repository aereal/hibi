import React, {
  FC,
  useCallback,
  useMemo,
  useState,
  CSSProperties,
  ReactChild,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createEditor, Node as SlateNode, Text as SlateText } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { jsx } from "slate-hyperscript";
import Paper from "@material-ui/core/Paper";
import { EditorActionToolbar } from "./EditorActionToolbar";
import { Block, BlockFormat } from "../editor/formats";
import { SerializedMark, blockSerializers } from "../editor/conversion";

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
  const editor = useMemo(() => withReact(createEditor()), []);
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
  const blockSerializer = blockSerializers[element["type"] as BlockFormat];
  if (blockSerializer) {
    return blockSerializer({ children, attributes });
  }
  return null;
};

const Leaf: FC<RenderLeafProps> = ({ attributes, children, leaf }) => (
  <span {...attributes}>
    <SerializedMark leaf={leaf}>{children}</SerializedMark>
  </span>
);

const serializeAsHTML = (node: SlateNode): ReactChild | null => {
  if (SlateText.isText(node)) {
    return <SerializedMark leaf={node}>{node.text}</SerializedMark>;
  }

  const children = node.children.map(n => serializeAsHTML(n));

  const blockSerializer = blockSerializers[node["type"] as BlockFormat];
  if (blockSerializer) {
    return blockSerializer({ children });
  }

  return <>{children}</>;
};

const serialize = (nodes: SlateNode[]): string =>
  renderToStaticMarkup(<>{nodes.map(n => serializeAsHTML(n))}</>);

const isTextNode = (node: Node): node is Text =>
  node.nodeType === Node.TEXT_NODE;

const isElementNode = (node: Node): node is Element =>
  node.nodeType === Node.ELEMENT_NODE;

const deserialize = (el: Node): any => {
  if (isTextNode(el)) {
    return el.textContent;
  }

  if (isElementNode(el)) {
    const children = Array.from(el.childNodes).map(deserialize);

    switch (el.nodeName) {
      case "BODY":
        return jsx("fragment", {}, children);
      case "BR":
        return "\n";
      case "BLOCKQUOTE":
        return jsx("element", { type: Block.Quote }, children);
      case "P":
        return jsx("element", { type: Block.Paragraph }, children);
      case "A":
        return jsx(
          "element",
          { type: "link", url: el.getAttribute("href") },
          children
        );
      default:
        return el.textContent;
    }
  }

  return null;
};

const deserializeHTML = (input: string): any =>
  deserialize(new DOMParser().parseFromString(input, "text/html").body);
