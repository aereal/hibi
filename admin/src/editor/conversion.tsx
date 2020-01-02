import React, { FC, ReactNode } from "react";
import { Text } from "slate";
import { Mark } from "./formats";

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
