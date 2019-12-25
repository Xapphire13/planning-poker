import React from "react";
import { Router } from "@reach/router";
import WelcomePage from ":web/pages/WelcomePage";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";

const stylesFn = createStylesFn(({ color, fontFamily }) => ({
  container: {
    "@import": "url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap')",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: color.background,
    color: color.text.default,
    fontFamily: fontFamily
  }
}));

export default function App() {
  const { css, styles } = useStyles({ stylesFn });

  return <Router {...css(styles.container)}>
    <WelcomePage path="/" />
  </Router>
}