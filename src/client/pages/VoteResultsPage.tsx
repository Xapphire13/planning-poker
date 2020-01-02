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

const { ipcRenderer } = window.require('electron');

export type VoteResultsPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    margin: `${unit}px 0`,
    height: `calc(100% - ${2 * unit}px)`,
  },
  button: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

function averageOfVotes(votes: Record<number, User[]>) {
  let count = 0;
  let total = 0;
  Object.keys(votes).forEach((key) => {
    count += votes[+key].length;
    total += votes[+key].length * +key;
  });

  return total / count;
}

function numberOfVotes(votes: Record<number, User[]>) {
  return Object.keys(votes).reduce((res, key) => res + votes[+key].length, 0);
}

export default function VoteResultsPage({ navigate }: VoteResultsPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [votes, setVotes] = useState<Record<number, User[]>>();

  useEffect(() => {
    (async () => {
      const usersAndVote: [User, number][] = await ipcRenderer.invoke(IpcChannel.GetResults);

      const results = usersAndVote.reduce<Record<number, User[]>>((result, [user, vote]) => {
        if (!result[vote]) {
          // eslint-disable-next-line no-param-reassign
          result[vote] = [];
        }

        result[vote].push(user);

        return result;
      }, {});

      setVotes(results);
    })();
  }, []);

  return (
    <>
      {votes
      && (
      <Grid container justify="space-between" direction="column" {...css(styles.container)}>
        <Grid item>
          <Container>
            <Typography variant="h6">
Average:
              {averageOfVotes(votes).toPrecision(1)}
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <VoteDistributions votes={votes} />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => navigate?.('/vote', { state: { numberOfPeople: numberOfVotes(votes) } })} {...css(styles.button)}>New vote</Button>
        </Grid>
      </Grid>
      )}
    </>
  );
}
