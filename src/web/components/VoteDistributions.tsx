import React from 'react';
import Grid from '@material-ui/core/Grid';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import VoteDistributionRow from './VoteDistributionRow';
import User from ':web/User';
import createStylesFn from ':web/theme/createStylesFn';
import nonNull from ':web/utils/nonNull';

export type VoteDistributionsProps = {
  results: { userId: string; vote: string }[];
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

  const buckets = results.reduce<Record<string, number>>((agg, { vote }) => {
    if (agg[vote] != null) {
      // eslint-disable-next-line no-param-reassign
      agg[vote]++;
    } else {
      // eslint-disable-next-line no-param-reassign
      agg[vote] = 0;
    }

    return agg;
  }, {});

  const winningVote = (() => {
    let winner = Object.keys(buckets)[0];
    Object.keys(buckets).forEach(key => {
      if (buckets[key] > buckets[winner]) {
        winner = key;
      }
    });

    const winningCount = buckets[winner];

    return Object.values(buckets).filter(count => count === winningCount)
      .length === 1
      ? winner
      : null;
  })();

  return (
    <Grid container direction="column" spacing={1}>
      {Object.keys(buckets)
        .sort((a, b) => {
          const aNum = parseInt(a, 10);
          const bNum = parseInt(b, 10);

          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return bNum - aNum;
          }

          if (a === 'Infinity') {
            return -1;
          }
          if (b === 'Infinity') {
            return 1;
          }

          return b.localeCompare(a);
        })
        .map(vote => {
          return (
            <Grid item key={vote} {...css(styles.row)}>
              <VoteDistributionRow
                storyPoints={vote}
                voters={results
                  .filter(result => result.vote === vote)
                  .map(result => users.find(user => user.id === result.userId))
                  .filter(nonNull)}
                isWinningVote={vote === winningVote}
              />
            </Grid>
          );
        })}
    </Grid>
  );
}
