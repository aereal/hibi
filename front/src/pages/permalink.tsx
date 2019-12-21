import React, { FC } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  PermalinkQuery,
  PermalinkQueryVariables,
} from "./__generated__/PermalinkQuery";
import PERMALINK_QUERY from "./permalink.gql";
import { Article } from "../organisms/article";
import { toSearchParams } from "../parsed-url-query";

const useStyles = makeStyles(theme => ({
  pageTitle: {
    margin: theme.spacing(3, 0),
  },
}));

export const ArticlePermalinkPage: FC = () => {
  const router = useRouter() ?? { query: {} };
  const params = toSearchParams(router.query);
  const slug = params.get("slug");
  const { loading, data } = useQuery<PermalinkQuery, PermalinkQueryVariables>(
    PERMALINK_QUERY,
    {
      variables: {
        diaryID: "gZJXFGCS7fONfpIKXWYn",
        articleID: slug ?? "",
      },
    }
  );
  const classes = useStyles();
  if (loading) {
    return null;
  }
  if (!data) {
    return null;
  }
  if (!data.diary?.article) {
    return <>Not found</>;
  }
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography className={classes.pageTitle} variant="h3">
          {data.diary.name}
        </Typography>
        <Article article={data.diary.article} />
      </Container>
    </>
  );
};
