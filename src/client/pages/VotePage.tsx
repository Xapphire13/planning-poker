import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TimerIcon from '@material-ui/icons/Timer';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import createStylesFn from ':shared/theme/createStylesFn';
import IpcChannel from ':shared/IpcChannel';
import ProgressCircle from '../components/ProgressCircle';

const { ipcRenderer } = window.require('electron');

export type VotePageProps = RouteComponentProps;

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

export default function VotePage({ location, navigate }: VotePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [numberOfPeopleReady, setNumberOfPeopleReady] = useState(0);
  const numberOfPeople: number | undefined = location?.state?.numberOfPeople;
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const countdown = useCallback(() => {
    setTimeRemaining(prev => {
      if (prev > 0) {
        setTimeout(countdown, 1000);

        return prev - 1;
      }

      return prev;
    });
  }, []);

  useEffect(() => {
    const voteCastListener = () => setNumberOfPeopleReady(prev => prev + 1);
    ipcRenderer.on(IpcChannel.VoteCast, voteCastListener);

    // Cleanup
    return () => {
      ipcRenderer.removeListener(IpcChannel.VoteCast, voteCastListener);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.send(IpcChannel.StartVoting);
  }, []);

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
    if (timeRemaining === 0 || numberOfPeopleReady === numberOfPeople) {
      navigate?.('/results');
    }
  }, [navigate, numberOfPeople, numberOfPeopleReady, timeRemaining]);

  if (!numberOfPeople) {
    throw new Error("Can't vote without people");
  }

  return (
    <Container maxWidth="xs" {...css(styles.contentContainer)}>
      <Typography variant="h6">Waiting for votes</Typography>
      <div {...css(styles.circleContainer)}>
        <ProgressCircle value={numberOfPeopleReady} max={numberOfPeople} />
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
