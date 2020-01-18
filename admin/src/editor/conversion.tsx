/* eslint-disable react/display-name */

import React, { FC, ReactNode, ReactChild } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Text as SlateText,
  Element as SlateElement,
  Node as SlateNode,
} from "slate";
import { jsx } from "slate-hyperscript";
import {
  Mark,
  Block,
  BlockFormat,
  BlockTagType,
  isLinkElement,
} from "./formats";
import { flatMap } from "../flat-map";

export const SerializedMark: FC<{ readonly leaf: SlateText }> = ({
  children,
  leaf,
}) => {
  let ret: ReactNode = children;
  if (leaf[Mark.Bold]) {
    ret = <strong>{ret}</strong>;
  }
  if (leaf[Mark.Code]) {
    ret = <code>{ret}</code>;
  }
  if (leaf[Mark.Italic]) {
    ret = <em>{ret}</em>;
  }
  if (leaf[Mark.Underlined]) {
    ret = <u>{ret}</u>;
  }
  return <>{ret}</>;
};

const deserializeMark = (element: Element): SlateText => {
  const slateNode: SlateText = { text: element.textContent ?? "" };
  switch (element.tagName) {
    case "CODE":
      slateNode[Mark.Code] = true;
      break;
    case "EM":
      slateNode[Mark.Italic] = true;
      break;
    case "STRONG":
      slateNode[Mark.Bold] = true;
      break;
    case "U":
      slateNode[Mark.Underlined] = true;
      break;
  }
  return slateNode;
};

interface BlockSerializerProps {
  readonly attributes?: Record<string, any>;
  readonly element: SlateElement;
}

export const blockSerializers: Record<BlockFormat, FC<BlockSerializerProps>> = {
  [Block.BulletedList]: ({ children, attributes }) => (
    <ul {...attributes}>{children}</ul>
  ),
  [Block.H1]: ({ children, attributes }) => <h1 {...attributes}>{children}</h1>,
  [Block.H2]: ({ children, attributes }) => <h2 {...attributes}>{children}</h2>,
  [Block.H3]: ({ children, attributes }) => <h3 {...attributes}>{children}</h3>,
  [Block.ListItem]: ({ children, attributes }) => (
    <li {...attributes}>{children}</li>
  ),
  [Block.NumberedList]: ({ children, attributes }) => (
    <ol {...attributes}>{children}</ol>
  ),
  [Block.Paragraph]: ({ children, attributes }) => (
    <p {...attributes}>{children}</p>
  ),
  [Block.Quote]: ({ children, attributes }) => (
    <blockquote {...attributes}>{children}</blockquote>
  ),
  [Block.Link]: ({ children, attributes, element }) => (
    <a href={element.url} {...attributes}>
      {children}
    </a>
  ),
};

interface DeserializerProps {
  readonly element: Element;
  readonly children: any;
}

type Deserialzier = (props: DeserializerProps) => ReturnType<typeof jsx>;

const blockDeserializers: Record<BlockTagType, Deserialzier> = {
  A: ({ element, children }) =>
    jsx(
      "element",
      { type: Block.Link, url: element.getAttribute("href") },
      children
    ),
  BLOCKQUOTE: ({ children }) => jsx("element", { type: Block.Quote }, children),
  H1: ({ children }) => jsx("element", { type: Block.H1 }, children),
  H2: ({ children }) => jsx("element", { type: Block.H2 }, children),
  H3: ({ children }) => jsx("element", { type: Block.H3 }, children),
  LI: ({ children }) => jsx("element", { type: Block.ListItem }, children),
  OL: ({ children }) => jsx("element", { type: Block.NumberedList }, children),
  UL: ({ children }) => jsx("element", { type: Block.BulletedList }, children),
  P: ({ children }) =>
    jsx(
      "element",
      { type: Block.Paragraph },
      children.length === 0
        ? [
            { text: " \n" },
          ] /* XXX: if empty children returned, SlateJS raises `Cannot get the start point` error ... */
        : children
    ),
};

const isDeserializable = (x: string): x is BlockTagType =>
  x in blockDeserializers;

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

export const serialize = (nodes: SlateNode[]): string =>
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

export const deserializeHTML = (input: string): any =>
  deserialize(new DOMParser().parseFromString(input, "text/html").body);
