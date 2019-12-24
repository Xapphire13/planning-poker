import React from "react";
import VoteDistributions from "./VoteDistributions";
import { createStylesFn } from "../theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

const votes = {
  3: 2,
  5: 5,
  8: 1
};

const stylesFn = createStylesFn(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between"
  },
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

export default function VoteResultsPage() {
  const { css, styles } = useStyles({ stylesFn });

  return <div {...css(styles.container)}>
    <div>Average: {averageOfVotes(votes).toPrecision(1)}</div>
    <div>
      <VoteDistributions votes={votes} />
    </div>
    <PrimaryButton>New vote</PrimaryButton>
  </div>
}