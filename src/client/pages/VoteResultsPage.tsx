import React, { useState, useEffect } from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import { RouteComponentProps } from '@reach/router';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import User from ':shared/User';
import IpcChannel from ':shared/IpcChannel';
import createStylesFn from '../../shared/theme/createStylesFn';
import VoteDistributions from '../components/VoteDistributions';
import { Vote } from ':shared/Vote';

const { ipcRenderer } = window.require('electron');

export type VoteResultsPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    margin: `${unit}px 0`,
    height: `calc(100% - ${2 * unit}px)`
  },
  button: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}));

function averageOfVotes(votes: Partial<Record<Vote, User[]>>) {
  let count = 0;
  let total = 0;
  Object.keys(votes).forEach(key => {
    const vote = key === 'Infinity' ? 'Infinity' : (+key as Vote);
    if (vote === 'Infinity') {
      return;
    }

    count += votes[vote]!.length;
    total += votes[vote]!.length * vote;
  });

  return Math.round(total / count);
}

function numberOfVotes(votes: Partial<Record<Vote, User[]>>) {
  return Object.keys(votes).reduce((res, key) => {
    const vote = key === 'Infinity' ? 'Infinity' : (+key as Vote);
    return res + votes[vote]!.length;
  }, 0);
}

export default function VoteResultsPage({ navigate }: VoteResultsPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [votes, setVotes] = useState<Partial<Record<Vote, User[]>>>();

  useEffect(() => {
    (async () => {
      const usersAndVote: [User, Vote][] = await ipcRenderer.invoke(
        IpcChannel.GetResults
      );

      const results = usersAndVote.reduce<Partial<Record<Vote, User[]>>>(
        (result, [user, vote]) => {
          if (!result[vote]) {
            // eslint-disable-next-line no-param-reassign
            result[vote] = [];
          }

          result[vote]!.push(user);

          return result;
        },
        {}
      );

      setVotes(results);
    })();
  }, []);

  return (
    <>
      {votes && (
        <Grid
          container
          justify="space-between"
          direction="column"
          {...css(styles.container)}
        >
          <Grid item>
            <Container>
              <Typography variant="h6">
                Average: {averageOfVotes(votes)}
              </Typography>
            </Container>
          </Grid>
          <Grid item>
            <VoteDistributions votes={votes} />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate?.('/vote', {
                  state: { numberOfPeople: numberOfVotes(votes) }
                })
              }
              {...css(styles.button)}
            >
              New vote
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}
