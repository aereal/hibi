import React, { FC } from "react";
import NextLink from "next/link";
import MaterialLink from "@material-ui/core/Link";

interface ArticleLinkProps {
  readonly slug: string;
}

export const ArticleLink: FC<ArticleLinkProps> = ({ children, slug }) => (
  <NextLink
    href={`/articles?slug=${encodeURIComponent(slug)}`}
    as={`/articles/${encodeURIComponent(slug)}`}
  >
    <MaterialLink href={`/articles/${encodeURIComponent(slug)}`}>
      {children}
    </MaterialLink>
  </NextLink>
);
