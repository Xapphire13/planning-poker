import React from 'react';
import Grid from '@material-ui/core/Grid';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
// import VoteDistributionRow from './VoteDistributionRow';
import User from ':web/User';
import createStylesFn from ':web/theme/createStylesFn';

export type VoteDistributionsProps = {
  results: any[]; // TODO
  users: User[];
};

const stylesFn = createStylesFn(() => ({
  row: {
    width: '100%'
  }
}));

export default function VoteDistributions({
  results,
  users
}: VoteDistributionsProps) {
  const { css, styles } = useStyles({ stylesFn });

  if (css && styles && results && users) {
    // TODO
  }

  return (
    <Grid container direction="column" spacing={1}>
      {/* {Object.keys(votes)
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
        })} */}
    </Grid>
  );
}
