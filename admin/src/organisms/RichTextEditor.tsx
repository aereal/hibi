import React, {
  FC,
  useCallback,
  useMemo,
  useState,
  CSSProperties,
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
      <Editable
        style={style}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={false}
      />
    </Slate>
  );
};

const Element: FC<RenderElementProps> = ({ element, attributes, children }) => {
  switch (element["type"]) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf: FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf["bold"]) {
    children = <strong>{children}</strong>;
  }
  if (leaf["code"]) {
    children = <code>{children}</code>;
  }
  if (leaf["italic"]) {
    children = <em>{children}</em>;
  }
  if (leaf["underline"]) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

const serializeAsHTML = (node: SlateNode): string => {
  if (SlateText.isText(node)) {
    return node.text; // TODO: escape
  }

  const children = node.children.map(n => serializeAsHTML(n)).join("");

  switch (node["type"]) {
    case "block-quote":
      return renderToStaticMarkup(<blockquote>{children}</blockquote>);
    case "paragraph":
      return renderToStaticMarkup(<p>{children}</p>);
    default:
      return children;
  }
};

const serialize = (nodes: SlateNode[]): string =>
  nodes.map(n => serializeAsHTML(n)).join("");

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
        return jsx("element", { type: "quote" }, children);
      case "P":
        return jsx("element", { type: "paragraph" }, children);
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
