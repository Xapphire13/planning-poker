import React from 'react';
import { Router } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import WelcomePage from ':web/pages/WelcomePage';
import createStylesFn from ':web/theme/createStylesFn';
import WaitingPage from ':web/pages/WaitingPage';
import VotePage from ':web/pages/VotePage';
import HostPage from ':web/pages/HostPage';
import WaitingForVotesPage from './pages/WaitingForVotesPage';
import VoteResultsPage from './pages/VoteResultsPage';

const stylesFn = createStylesFn(({ color, fontFamily }) => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: color.background,
    color: color.text.default,
    fontFamily,
    overflowY: 'auto'
  }
}));

export default function App() {
  const { css, styles } = useStyles({ stylesFn });

  return (
    <Router {...css(styles.container)}>
      <WelcomePage path="/" />
      <HostPage path="/host" />
      <WaitingPage path="/waiting" />
      <WaitingForVotesPage path="/waitingForVotes" />
      <VotePage path="/vote" />
      <VoteResultsPage path="/results" />
    </Router>
  );
}
