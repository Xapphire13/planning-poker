import React, { useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

export type VotePageProps = RouteComponentProps;

const VOTE_MUTATION = gql`
  mutation CastVote($vote: Int!) {
    vote(vote: $vote) {
      success
    }
  }
`;

export default function VotePage({ }: VotePageProps) {
  const [castVote] = useMutation(VOTE_MUTATION);

  useEffect(() => {
    castVote({
      variables: {
        vote: 10
      }
    })
  }, []);

  return <div />;
}