type ValueType<T extends {}> = T[keyof T];

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
} as const;
export type BlockFormat = ValueType<typeof Block>;

export const isList = (block: BlockFormat): boolean =>
  block === Block.NumberedList || block === Block.BulletedList;

export type Format = MarkFormat | BlockFormat;
