type ValueType<T extends {}> = T[keyof T];

export const Mark = {
  Bold: "bold",
  Italic: "italic",
  Underlined: "underlined",
  Code: "code",
} as const;
export type MarkFormat = ValueType<typeof Mark>;

// TODO: block format

export type Format = MarkFormat;
