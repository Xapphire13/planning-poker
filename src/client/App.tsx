import React from "react";
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import {
  Router
} from "@reach/router";

import VoteResultsPage from "./components/VoteResultsPage";
import { createStylesFn } from "./theme/createStylesFn";
import WelcomePage from "./components/WelcomePage";

const stylesFn = createStylesFn(() => ({
  container: {
    "@import": "url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap')",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: "#242426",
    color: "#ffffff",
    fontFamily: ['Roboto', "sans-serif"]
  }
}));

export default function App() {
  const { css, styles } = useStyles({ stylesFn });

  return <Router {...css(styles.container)}>
    <WelcomePage path="/" />
    <VoteResultsPage path="/results" />
  </Router>;
}