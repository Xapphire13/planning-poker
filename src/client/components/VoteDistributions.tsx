import React from "react";
import VoteDistributionRow from "./VoteDistributionRow";
import User from ":shared/User";
import Grid from "@material-ui/core/Grid";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";

export type VoteDistributionsProps = {
  votes: Record<number, User[]>;
};

const stylesFn = createStylesFn(() => ({
  row: {
    width: "100%"
  }
}));

export default function VoteDistributions({ votes }: VoteDistributionsProps) {
  const { css, styles } = useStyles({ stylesFn });
  const totalVotes = Object.keys(votes).reduce((total, key) => total + votes[+key].length, 0);
  const winningVoteCount = Math.max(...Object.keys(votes).map(key => votes[+key].length));

  return <Grid container direction="column" spacing={1}>
    {Object.keys(votes).map(key => +key).sort((a, b) => b - a).map((storyPoints) => {
      const numberOfVotes = votes[storyPoints].length;

      return <Grid item key={storyPoints} {...css(styles.row)}>
        <VoteDistributionRow storyPoints={storyPoints} voters={votes[storyPoints]} totalVotes={totalVotes} isWinningVote={numberOfVotes === winningVoteCount} />
      </Grid>
    })}
  </Grid>;
}