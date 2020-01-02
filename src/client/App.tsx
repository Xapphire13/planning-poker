import React from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import { Router } from '@reach/router';

import VoteResultsPage from './pages/VoteResultsPage';
import createStylesFn from '../shared/theme/createStylesFn';
import WelcomePage from './pages/WelcomePage';
import VotePage from './pages/VotePage';

const stylesFn = createStylesFn(({ color, fontFamily }) => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: color.background,
    color: color.text.default,
    fontFamily
  }
}));

export default function App() {
  const { css, styles } = useStyles({ stylesFn });

  return (
    <Router {...css(styles.container)}>
      <WelcomePage path="/" />
      <VotePage path="/vote" />
      <VoteResultsPage path="/results" />
    </Router>
  );
}
