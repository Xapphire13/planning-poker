import React from "react";
import { Router } from "@reach/router";
import WelcomePage from ":web/pages/WelcomePage";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import WaitingPage from ":web/pages/WaitingPage";
import VotePage from ":web/pages/VotePage";

const stylesFn = createStylesFn(({ color, fontFamily }) => ({
  container: {
    "@import": "url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap')",
    position: "relative",
    width: "100%",
    height: "100%",
    background: color.background,
    color: color.text.default,
    fontFamily: fontFamily,
    overflowY: "auto"
  }
}));

export default function App() {
  const { css, styles } = useStyles({ stylesFn });

  return <Router {...css(styles.container)}>
    <WelcomePage path="/" />
    <WaitingPage path="/waiting" />
    <VotePage path="/vote" />
  </Router>
}