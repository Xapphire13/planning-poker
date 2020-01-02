import React from 'react';
import Grid from '@material-ui/core/Grid';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import VoteDistributionRow from './VoteDistributionRow';
import User from ':shared/User';
import createStylesFn from ':shared/theme/createStylesFn';
import { Vote } from ':shared/Vote';

export type VoteDistributionsProps = {
  votes: Partial<Record<Vote, User[]>>;
};

const stylesFn = createStylesFn(() => ({
  row: {
    width: '100%'
  }
}));

export default function VoteDistributions({ votes }: VoteDistributionsProps) {
  const { css, styles } = useStyles({ stylesFn });
  const winningVoteCount = Math.max(
    ...Object.keys(votes).map(key => {
      const vote = key === 'Infinity' ? 'Infinity' : (+key as Vote);
      return votes[vote]!.length;
    })
  );

  return (
    <Grid container direction="column" spacing={1}>
      {Object.keys(votes)
        .map(key => (key === 'Infinity' ? 'Infinity' : (+key as Vote)))
        .sort((a, b) => {
          if (a === 'Infinity') {
            return -1;
          }
          if (b === 'Infinity') {
            return 1;
          }

          return b - a;
        })
        .map(storyPoints => {
          const numberOfVotes = votes[storyPoints]!.length;

          return (
            <Grid item key={storyPoints} {...css(styles.row)}>
              <VoteDistributionRow
                storyPoints={storyPoints}
                voters={votes[storyPoints]!}
                isWinningVote={numberOfVotes === winningVoteCount}
              />
            </Grid>
          );
        })}
    </Grid>
  );
}
