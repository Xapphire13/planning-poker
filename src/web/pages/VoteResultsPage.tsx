import React, { useState, useEffect } from 'react';
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
import VStackItem from 'pancake-layout/dist/VStackItem';
import VStack from 'pancake-layout/dist/VStack';
import Divider from '@material-ui/core/Divider';
import { css } from 'linaria';
import VoteDistributions from '../components/VoteDistributions';
import {
  SessionResults,
  SessionResultsVariables,
} from ':__generated__/graphql';
import nonNull from ':web/utils/nonNull';
import StorageUtil from ':web/utils/storageUtil';
import AppBarLayout from ':web/layouts/AppBarLayout';
import SessionParticipants from ':web/components/SessionParticipants';
import Theme from ':web/theme/DefaultTheme';
import { VoteValues } from ':web/Vote';

export type VoteResultsPageProps = RouteComponentProps;

const container = css`
  height: 100%;
`;

const contentContainer = css`
  padding: ${Theme.unit}px 0;
  height: 100%;
`;

const button = css`
  display: block !important;
  margin-left: auto !important;
  margin-right: auto !important;
`;

function averageOfVotes(votes: { vote: string }[]) {
  let total: number | undefined;
  let numericVotes = votes.length;
  votes.forEach(({ vote }) => {
    const numericVote = parseInt(vote, 10);

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(numericVote)) {
      numericVotes--;
      return;
    }

    if (total == null) total = 0;

    total += numericVote;
  });

  if (total == null) return undefined;

  const average = Math.round(total / numericVotes);
  return VoteValues.find(
    (voteValue) => voteValue === 'Infinity' || voteValue >= average
  );
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
  const sessionId = StorageUtil.session.getItem('sessionId');
  const [showUnanimousNotification, setShowUnanimousNotification] = useState(
    false
  );
  const { width, height } = useWindowSize();
  const { data: sessionResultsData } = useQuery<
    SessionResults,
    SessionResultsVariables
  >(SESSION_RESULTS_QUERY, {
    fetchPolicy: 'no-cache',
    skip: !sessionId,
    variables: {
      sessionId: sessionId ?? '',
    },
  });

  const results = sessionResultsData?.session?.results?.filter(nonNull);
  const users = sessionResultsData?.session?.users?.filter(nonNull);
  const isUnanimous =
    results?.every((it) => it.vote === results[0].vote) ?? false;

  useEffect(() => {
    setShowUnanimousNotification(isUnanimous);
  }, [isUnanimous]);

  const handleNewVote = () => {
    navigate?.('/waitingForVotes');
  };

  return (
    <>
      <AppBarLayout fullWidth>
        <VStack justify="space-between" className={container}>
          <VStackItem grow>
            {results && users && (
              <Grid
                container
                justify="space-between"
                direction="column"
                className={contentContainer}
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
                    onClick={handleNewVote}
                    className={button}
                  >
                    New vote
                  </Button>
                </Grid>
              </Grid>
            )}
          </VStackItem>
          <>
            {sessionId && (
              <Container maxWidth="xs">
                <Divider />
                <SessionParticipants sessionId={sessionId} />
              </Container>
            )}
          </>
        </VStack>
      </AppBarLayout>
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
              vertical: 'bottom',
            }}
          />
        </>
      )}
    </>
  );
}
