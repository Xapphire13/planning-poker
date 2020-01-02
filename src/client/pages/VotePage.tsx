import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
    textAlign: 'center',
  },
  circleContainer: {
    margin: `${2 * unit}px 0`,
  },
}));

export default function VotePage({ location, navigate }: VotePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [numberOfPeopleReady, setNumberOfPeopleReady] = useState(0);
  const numberOfPeople: number | undefined = location?.state?.numberOfPeople;

  useEffect(() => {
    const voteCastListener = () => setNumberOfPeopleReady((prev) => prev + 1);
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
    if (numberOfPeopleReady === numberOfPeople) {
      navigate?.('/results');
    }
  }, [numberOfPeopleReady]);

  if (!numberOfPeople) {
    throw new Error("Can't vote without people");
  }

  return (
    <Container maxWidth="xs" {...css(styles.contentContainer)}>
      <Typography variant="h6">Waiting for votes</Typography>
      <div {...css(styles.circleContainer)}>
        <ProgressCircle value={numberOfPeopleReady} max={numberOfPeople} />
      </div>
      <Button variant="outlined" onClick={() => navigate?.('/')}>Cancel</Button>
    </Container>
  );
}
