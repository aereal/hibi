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
import { BlockFormat, isLinkElement, Mark } from "../editor/formats";
import {
  SerializedMark,
  blockSerializers,
  isDeserializable,
  blockDeserializers,
  deserializeMark,
} from "../editor/conversion";
import { withLink } from "../editor/link";
import { flatMap } from "../flat-map";

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

const serializeAsHTML = (node: SlateNode): ReactChild | null => {
  if (SlateText.isText(node)) {
    return <SerializedMark leaf={node}>{node.text}</SerializedMark>;
  }

  const children = node.children.map(n => serializeAsHTML(n));

  if (isLinkElement(node)) {
    return <a href={node.url}>{children}</a>;
  }

  const blockSerializer = blockSerializers[node["type"] as BlockFormat];
  if (blockSerializer) {
    return blockSerializer({ children, element: node });
  }

  return <>{children}</>;
};

const serialize = (nodes: SlateNode[]): string =>
  renderToStaticMarkup(<>{nodes.map(n => serializeAsHTML(n))}</>);

const isTextNode = (node: Node): node is Text =>
  node.nodeType === Node.TEXT_NODE;

const isElementNode = (node: Node): node is Element =>
  node.nodeType === Node.ELEMENT_NODE;

const textElement = (node: Node): SlateText => ({
  text: node.textContent ?? "",
});

const deserialize = (el: Node): Array<ReturnType<typeof jsx>> => {
  if (isTextNode(el)) {
    return [textElement(el)];
  }

  if (isElementNode(el)) {
    const children = flatMap(Array.from(el.childNodes), deserialize);

    const { nodeName } = el;
    if (isDeserializable(nodeName)) {
      return [blockDeserializers[nodeName]({ children, element: el })];
    }

    switch (el.nodeName) {
      case "BODY":
        return jsx("fragment", {}, children);
      case "BR":
        return [{ text: "\n" }];
      default:
        return [deserializeMark(el)];
    }
  }

  return [];
};

const deserializeHTML = (input: string): any =>
  deserialize(new DOMParser().parseFromString(input, "text/html").body);
