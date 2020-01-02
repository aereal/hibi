import React, { FC } from "react";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";

export const ActionButton: FC<IconButtonProps> = ({ children, ...props }) => (
  <IconButton disableRipple edge={false} {...props}>
    {children}
  </IconButton>
);
