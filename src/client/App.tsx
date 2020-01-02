import React from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import { Router } from '@reach/router';

import VoteResultsPage from './pages/VoteResultsPage';
import createStylesFn from '../shared/theme/createStylesFn';
import WelcomePage from './pages/WelcomePage';
import VotePage from './pages/VotePage';

const stylesFn = createStylesFn(({ color, fontFamily }) => ({
  container: {
    '@import':
      "url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap')",
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
