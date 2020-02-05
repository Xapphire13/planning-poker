import React, { useState, useEffect } from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import { RouteComponentProps } from '@reach/router';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import Snackbar from '@material-ui/core/Snackbar';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import User from ':web/User';
import createStylesFn from '../theme/createStylesFn';
import VoteDistributions from '../components/VoteDistributions';
import { Vote } from ':web/Vote';

export type VoteResultsPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    padding: `${unit}px 0`,
    height: '100%'
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

const SESSION_RESULTS_QUERY = gql`
  query SessionResults($sessionId: String!) {
    session(sessionId: $sessionId) {
      users {
        id
        name
      }
      results {
        userId
        vote
      }
    }
  }
`;

export default function VoteResultsPage({ navigate }: VoteResultsPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [showUnanimousNotification, setShowUnanimousNotification] = useState(
    false
  );
  const { width, height } = useWindowSize();
  const { data: sessionResultsData } = useQuery(SESSION_RESULTS_QUERY);

  const results = sessionResultsData?.session?.results;
  const users = sessionResultsData?.session?.users;
  const isUnanimous = false; // TODO

  useEffect(() => {
    setShowUnanimousNotification(isUnanimous);
  }, [isUnanimous]);

  return (
    <>
      {results && users && (
        <Grid
          container
          justify="space-between"
          direction="column"
          {...css(styles.container)}
        >
          <Grid item>
            <Container>
              <Typography variant="h6">
                Average: {averageOfVotes(results)}
              </Typography>
            </Container>
          </Grid>
          <Grid item>
            <VoteDistributions results={results} users={users} />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate?.('/vote')}
              {...css(styles.button)}
            >
              New vote
            </Button>
          </Grid>
        </Grid>
      )}
      {isUnanimous && (
        <>
          <Confetti width={width} height={height} />
          <Snackbar
            open={showUnanimousNotification}
            onClose={() => setShowUnanimousNotification(false)}
            autoHideDuration={5000}
            message="Unanimous vote! 🎉"
            anchorOrigin={{
              horizontal: 'center',
              vertical: 'bottom'
            }}
          />
        </>
      )}
    </>
  );
}
