/* eslint-disable react/display-name */

import React, { FC, ReactNode } from "react";
import { Text, Element } from "slate";
import { Mark, Block, BlockFormat } from "./formats";

export const SerializedMark: FC<{ readonly leaf: Text }> = ({
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

interface BlockSerializerProps {
  readonly attributes?: Record<string, any>;
  readonly element: Element;
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
