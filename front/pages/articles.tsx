import React, { FC } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const LIST_ARTICLES = gql`
  query($diaryID: ID!) {
    diary(id: $diaryID) {
      name
    }
  }
`;

const Articles: FC = () => {
  const { loading, data } = useQuery<any, { diaryID: number }>(LIST_ARTICLES, {
    variables: { diaryID: 126 },
  });
  if (loading) {
    return null;
  }
  return (
    <>
      <h1>Diary: {JSON.stringify(data.diary.name)}</h1>
    </>
  );
};
export default Articles;
