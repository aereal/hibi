import React, { FC } from "react";
import Link, { LinkProps } from "@material-ui/core/Link";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  blockLink: {
    display: "run-in",
  },
});

export const BlockLink: FC<LinkProps> = ({ children, ...props }) => {
  const { blockLink } = useStyles();
  return (
    <Link className={blockLink} {...props}>
      {children}
    </Link>
  );
};
