import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import { BlockLink } from "../atoms/block-link";
import { MonodirectionalPageInfo } from "./__generated__/MonodirectionalPageInfo";

interface MonodirectionalPagerProps {
  readonly baseURL: string;
  readonly pageInfo: MonodirectionalPageInfo;
}

export const MonodirectionalPager: FC<MonodirectionalPagerProps> = ({
  baseURL,
  pageInfo: { nextPage },
}) => {
  return (
    <Grid container alignItems="center">
      {nextPage !== null ? (
        <BlockLink href={baseURL + `?page=${nextPage}`}>Next</BlockLink>
      ) : null}
    </Grid>
  );
};
