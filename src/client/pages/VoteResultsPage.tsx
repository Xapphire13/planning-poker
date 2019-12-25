import React from "react";
import VoteDistributions from "../components/VoteDistributions";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { RouteComponentProps } from "@reach/router";
import { Stack, StackItem } from "office-ui-fabric-react/lib/Stack";

const votes = {
  3: 2,
  5: 5,
  8: 1
};

export type VoteResultsPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  contentContainer: {
    padding: unit,
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

export default function VoteResultsPage({ navigate }: VoteResultsPageProps) {
  const { css, styles } = useStyles({ stylesFn });

  return <Stack verticalFill verticalAlign="space-between">
    <div {...css(styles.contentContainer)}>
      <div>Average: {averageOfVotes(votes).toPrecision(1)}</div>
    </div>
    <div>
      <VoteDistributions votes={votes} />
    </div>
    <PrimaryButton onClick={() => navigate?.("/vote")}>New vote</PrimaryButton>
  </Stack>;
}