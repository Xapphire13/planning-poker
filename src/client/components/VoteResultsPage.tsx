import React from "react";
import VoteDistributions from "./VoteDistributions";
import { createStylesFn } from "../theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";

const votes = {
  3: 2,
  5: 5,
  8: 1
};

const stylesFn = createStylesFn(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  stretch: {
    flexGrow: 1
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

export default function VoteResultsPage() {
  const { css, styles } = useStyles({ stylesFn });

  return <div {...css(styles.container)}>
    <div>Average: {averageOfVotes(votes).toPrecision(1)}</div>
    <div {...css(styles.stretch)}>
      <VoteDistributions votes={votes} />
    </div>
    <div>TODO -> New vote button</div>
  </div>
}