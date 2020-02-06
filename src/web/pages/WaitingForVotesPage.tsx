import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TimerIcon from '@material-ui/icons/Timer';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import createStylesFn from ':web/theme/createStylesFn';
import ProgressCircle from '../components/ProgressCircle';

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
  subscription VoteCastSubscription {
    voteCast(sessionId: "") {
      id
    }
  }
`;

export default function WaitingForVotesPage({
  navigate
}: WaitingForVotesPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const { data: voteCastData } = useSubscription(VOTE_CAST_SUBSCRIPTION);
  const countdown = useCallback(() => {
    setTimeRemaining(prev => {
      if (prev > 0) {
        setTimeout(countdown, 1000);

        return prev - 1;
      }

      return prev;
    });
  }, []);

  const numberOfPeopleReady: number = voteCastData?.voteCast?.length;

  useEffect(() => {
    if (numberOfPeopleReady > 0) {
      setCountdownStarted(true);
    }
  }, [countdown, numberOfPeopleReady]);

  useEffect(() => {
    if (countdownStarted) {
      setTimeout(countdown, 1000);
    }
  }, [countdown, countdownStarted]);

  useEffect(() => {
    // TODO
    if (timeRemaining === 0 || numberOfPeopleReady === 100) {
      navigate?.('/results');
    }
  }, [navigate, numberOfPeopleReady, timeRemaining]);

  return (
    <Container maxWidth="xs" {...css(styles.contentContainer)}>
      <Typography variant="h6">Waiting for votes</Typography>
      <div {...css(styles.circleContainer)}>
        <ProgressCircle
          value={numberOfPeopleReady}
          // TODO
          max={100}
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
