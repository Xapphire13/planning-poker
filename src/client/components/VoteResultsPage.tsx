import React from "react";
import VoteDistributions from "./VoteDistributions";
import { createStylesFn } from "../theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { RouteComponentProps } from "@reach/router";

const votes = {
  3: 2,
  5: 5,
  8: 1
};

export type VoteResultsPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between"
  },
  averageVoteContainer: {
    margin: `${unit}px 0`,
    textAlign: "center"
  }
}));

function averageOfVotes(votes: Record<number, number>) {
  let count = 0;
  let total = 0;
  Object.keys(votes).forEach(key => {
    count += votes[+key];
    total += votes[+key] * +key;
  });

  return total / count;
}

export default function VoteResultsPage({ }: VoteResultsPageProps) {
  const { css, styles } = useStyles({ stylesFn });

  return <div {...css(styles.container)}>
    <div {...css(styles.averageVoteContainer)}>Average: {averageOfVotes(votes).toPrecision(1)}</div>
    <div>
      <VoteDistributions votes={votes} />
    </div>
    <PrimaryButton>New vote</PrimaryButton>
  </div>
}