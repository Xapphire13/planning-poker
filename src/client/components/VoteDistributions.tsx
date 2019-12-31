import React from "react";
import VoteDistributionRow from "./VoteDistributionRow";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import User from ":shared/User";

export type VoteDistributionsProps = {
  votes: Record<number, User[]>;
};

const stylesFn = createStylesFn(({ unit }) => ({
  rowWithGutter: {
    marginTop: unit
  }
}));

export default function VoteDistributions({ votes }: VoteDistributionsProps) {
  const { css, styles } = useStyles({ stylesFn });
  const totalVotes = Object.keys(votes).reduce((total, key) => total + votes[+key].length, 0);
  const winningVoteCount = Math.max(...Object.keys(votes).map(key => votes[+key].length));

  return <div>
    {Object.keys(votes).map(key => +key).sort((a, b) => b - a).map((storyPoints, i) => {
      const numberOfVotes = votes[storyPoints].length;

      return <div key={storyPoints} {...css(i !== 0 && styles.rowWithGutter)}>
        <VoteDistributionRow storyPoints={storyPoints} voters={votes[storyPoints]} totalVotes={totalVotes} isWinningVote={numberOfVotes === winningVoteCount} />
      </div>
    })}
  </div>;
}