import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TimerIcon from '@material-ui/icons/Timer';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import createStylesFn from ':web/theme/createStylesFn';
import ProgressCircle from '../components/ProgressCircle';
import {
  VoteCastSubscription,
  VoteCastSubscriptionVariables,
  StartVoting,
  StartVotingVariables,
  EndRound,
  EndRoundVariables
} from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';
import useConnectedCount from ':web/hooks/useConnectedCount';

export type WaitingForVotesPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  contentContainer: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    textAlign: 'center'
  },
  circleContainer: {
    margin: `${2 * unit}px 0`
  },
  button: {
    marginTop: 2 * unit
  }
}));

function formatTimeRemaining(seconds: number) {
  const duration = moment.duration(seconds, 's');
  const minutesPart = duration
    .minutes()
    .toString()
    .padStart(2, '0');
  const secondsPart = duration
    .seconds()
    .toString()
    .padStart(2, '0');

  return `${minutesPart}:${secondsPart}`;
}

const VOTE_CAST_SUBSCRIPTION = gql`
  subscription VoteCastSubscription($sessionId: String!) {
    voteCast(sessionId: $sessionId) {
      id
    }
  }
`;

const START_VOTING_MUTATION = gql`
  mutation StartVoting($sessionId: String!) {
    startVoting(sessionId: $sessionId) {
      success
    }
  }
`;

const END_ROUND_MUTATION = gql`
  mutation EndRound($sessionId: String!) {
    endRound(sessionId: $sessionId) {
      success
    }
  }
`;

export default function WaitingForVotesPage({
  navigate
}: WaitingForVotesPageProps) {
  const sessionId = StorageUtil.session.getItem<string>('sessionId');
  const { css, styles } = useStyles({ stylesFn });
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [startVoting] = useMutation<StartVoting, StartVotingVariables>(
    START_VOTING_MUTATION
  );
  const [endRound] = useMutation<EndRound, EndRoundVariables>(
    END_ROUND_MUTATION
  );
  const numberOfPeopleInSession = useConnectedCount(sessionId);
  const { data: voteCastData } = useSubscription<
    VoteCastSubscription,
    VoteCastSubscriptionVariables
  >(VOTE_CAST_SUBSCRIPTION, {
    skip: !sessionId,
    variables: {
      sessionId: sessionId ?? ''
    }
  });
  const countdown = useCallback(() => {
    // TODO, stop timeout after unmount
    setTimeRemaining(prev => {
      if (prev > 0) {
        window.setTimeout(countdown, 1000);

        return prev - 1;
      }

      return prev;
    });
  }, []);

  const numberOfPeopleReady: number = voteCastData?.voteCast?.length ?? 0;

  // Redirect if no session id
  useEffect(() => {
    if (!sessionId) {
      navigate?.('/host');
    }
  }, [navigate, sessionId]);

  // Signal that voting has started
  useEffect(() => {
    if (sessionId) {
      startVoting({ variables: { sessionId } });
    }
  }, [sessionId, startVoting]);

  // Start countdown when first person is done voting
  useEffect(() => {
    if (numberOfPeopleReady > 0) {
      setCountdownStarted(true);
    }
  }, [countdown, numberOfPeopleReady]);

  // Start countdown
  useEffect(() => {
    let timeout: number;
    if (countdownStarted) {
      timeout = window.setTimeout(countdown, 0);
    }

    return () => {
      if (timeout != null) clearTimeout(timeout);
    };
  }, [countdown, countdownStarted]);

  // Show results when time runs out or all votes are in (min 2 votes)
  useEffect(() => {
    if (
      timeRemaining === 0 ||
      (numberOfPeopleInSession > 1 &&
        numberOfPeopleReady === numberOfPeopleInSession)
    ) {
      if (sessionId) {
        endRound({ variables: { sessionId } }).then(() => {
          navigate?.('/results');
        });
      }
    }
  }, [
    endRound,
    navigate,
    numberOfPeopleInSession,
    numberOfPeopleReady,
    sessionId,
    timeRemaining
  ]);

  return (
    <Container maxWidth="xs" {...css(styles.contentContainer)}>
      <Typography variant="h6">Waiting for votes</Typography>
      <div {...css(styles.circleContainer)}>
        <ProgressCircle
          value={numberOfPeopleReady}
          max={numberOfPeopleInSession}
        />
      </div>
      <Grid
        container
        alignItems="center"
        wrap="nowrap"
        justify="center"
        spacing={1}
      >
        <Grid item>
          <TimerIcon />
        </Grid>
        <Grid item>
          <Typography>{formatTimeRemaining(timeRemaining)}</Typography>
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        onClick={() => navigate?.('/')}
        {...css(styles.button)}
      >
        Cancel
      </Button>
    </Container>
  );
}
