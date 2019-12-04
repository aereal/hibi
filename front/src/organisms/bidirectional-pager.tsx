import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import { BidirectionalPageInfo } from "./__generated__/BidirectionalPageInfo";
import { BlockLink } from "../atoms/block-link";

interface BidirectionalPagerProps {
  readonly baseURL: string;
  readonly pageInfo: BidirectionalPageInfo;
}

export const BidirectionalPager: FC<BidirectionalPagerProps> = ({
  baseURL,
  pageInfo,
}) => {
  const previousURL = getPreviousURL(baseURL, pageInfo);
  const nextURL = getNextURL(baseURL, pageInfo);
  return (
    <Grid container alignItems="center">
      {previousURL !== null ? (
        <BlockLink href={previousURL}>Previous</BlockLink>
      ) : null}
      {nextURL !== null ? <BlockLink href={nextURL}>Next</BlockLink> : null}
    </Grid>
  );
};

const getNextURL = (
  baseURL: string,
  pageInfo: BidirectionalPageInfo
): string | null => generateURL(baseURL, pageInfo.endCursor);

const getPreviousURL = (
  baseURL: string,
  pageInfo: BidirectionalPageInfo
): string | null => generateURL(baseURL, pageInfo.startCursor);

const generateURL = (baseURL: string, cursor: string | null): string | null =>
  cursor !== null ? `${baseURL}?page=${encodeURIComponent(cursor)}` : null;
