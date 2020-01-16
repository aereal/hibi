import { Element as SlateElement, Node } from "slate";

type ValueType<T extends {}> = T[keyof T];

export interface LinkElement extends SlateElement {
  readonly type: "link";
  readonly url: string;
}

export const Mark = {
  Bold: "bold",
  Italic: "italic",
  Underlined: "underlined",
  Code: "code",
} as const;
export type MarkFormat = ValueType<typeof Mark>;

export const Block = {
  H1: "heading1",
  H2: "heading2",
  H3: "heading3",
  Quote: "quote",
  NumberedList: "numbered-list",
  BulletedList: "bulleted-list",
  ListItem: "list-item",
  Paragraph: "paragraph",
  Link: "link",
} as const;
export type BlockFormat = ValueType<typeof Block>;

export const isList = (block: BlockFormat): boolean =>
  block === Block.NumberedList || block === Block.BulletedList;

export const isLinkElement = (node: Node): node is LinkElement =>
  node["type"] === Block.Link;

export type Format = MarkFormat | BlockFormat;

const blockTagMapping = {
  [Block.H1]: "H1",
  [Block.H2]: "H2",
  [Block.H3]: "H3",
  [Block.Quote]: "BLOCKQUOTE",
  [Block.NumberedList]: "OL",
  [Block.BulletedList]: "UL",
  [Block.ListItem]: "LI",
  [Block.Link]: "A",
  [Block.Paragraph]: "P",
} as const;
export type BlockTagType = ValueType<typeof blockTagMapping>;

const markTagMapping = {
  [Mark.Bold]: "STRONG",
  [Mark.Code]: "CODE",
  [Mark.Italic]: "EM",
  [Mark.Underlined]: "U",
} as const;
export type MarkTagType = ValueType<typeof markTagMapping>;

export const tagMapping = {
  ...blockTagMapping,
  ...markTagMapping,
} as const;
export type TagType = BlockTagType | MarkTagType;
