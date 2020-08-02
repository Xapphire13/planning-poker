import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TimerIcon from '@material-ui/icons/Timer';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import VStack from 'pancake-layout/dist/VStack';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import ProgressCircle from '../components/ProgressCircle';
import {
  VoteCastSubscription,
  VoteCastSubscriptionVariables,
  StartVoting,
  StartVotingVariables,
  EndRound,
  EndRoundVariables,
} from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';
import Theme from ':web/theme/DefaultTheme';
import FullScreenLayout from ':web/layouts/FullScreenLayout';
import useConnectedUsers from ':web/hooks/useConnectedUsers';
import SessionParticipantsLayout from ':web/layouts/SessionParticipantsLayout';
import { DEFAULT_TIME_LIMIT } from ':web/constants';

export type WaitingForVotesPageProps = RouteComponentProps;

const container = css`
  height: 100%;
  text-align: center;
`;

const button = css`
  margin-top: ${2 * Theme.unit}px;
`;

const CircleContainer = styled.div`
  margin: ${2 * Theme.unit}px 0;
`;

function formatTimeRemaining(seconds: number) {
  const duration = moment.duration(seconds, 's');
  const minutesPart = duration.minutes().toString().padStart(2, '0');
  const secondsPart = duration.seconds().toString().padStart(2, '0');

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
  navigate,
}: WaitingForVotesPageProps) {
  const sessionId = StorageUtil.session.getItem<string>('sessionId');
  const [timeRemaining, setTimeRemaining] = useState<number>(
    StorageUtil.session.getItem('sessionTimeLimit') ?? DEFAULT_TIME_LIMIT
  );
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [startVoting] = useMutation<StartVoting, StartVotingVariables>(
    START_VOTING_MUTATION
  );
  const [endRound] = useMutation<EndRound, EndRoundVariables>(
    END_ROUND_MUTATION
  );
  const users = useConnectedUsers(sessionId);
  const { data: voteCastData } = useSubscription<
    VoteCastSubscription,
    VoteCastSubscriptionVariables
  >(VOTE_CAST_SUBSCRIPTION, {
    skip: !sessionId,
    variables: {
      sessionId: sessionId ?? '',
    },
  });
  const countdown = useCallback(() => {
    // TODO, stop timeout after unmount
    setTimeRemaining((prev) => {
      if (prev > 0) {
        window.setTimeout(countdown, 1000);

        return prev - 1;
      }

      return prev;
    });
  }, []);

  const numberOfPeopleReady: number = voteCastData?.voteCast?.length ?? 0;
  const numberOfPeopleInSession = users.length;

  const handleEndRound = useCallback(
    async (nextPage: string) => {
      if (sessionId) {
        await endRound({ variables: { sessionId } }).then(() => {
          navigate?.(nextPage);
        });
      }
    },
    [endRound, navigate, sessionId]
  );

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
      handleEndRound('/results');
    }
  }, [
    handleEndRound,
    numberOfPeopleInSession,
    numberOfPeopleReady,
    timeRemaining,
  ]);

  return (
    <FullScreenLayout>
      <SessionParticipantsLayout sessionId={sessionId}>
        <VStack className={container} justify="center">
          <Typography variant="h6">Waiting for votes</Typography>
          <CircleContainer>
            <ProgressCircle
              value={numberOfPeopleReady}
              max={numberOfPeopleInSession}
            />
          </CircleContainer>
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
          <VStack gap={Theme.unit / 2}>
            <Button
              variant="outlined"
              onClick={() => handleEndRound('/host')}
              className={button}
            >
              Cancel
            </Button>
            <Button variant="text" onClick={() => handleEndRound('/results')}>
              Or manually end round
            </Button>
          </VStack>
        </VStack>
      </SessionParticipantsLayout>
    </FullScreenLayout>
  );
}
