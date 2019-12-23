import React from "react";
import { Styles } from "react-with-styles";
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import VoteResultsPage from "./components/VoteResultsPage";
import { createStylesFn } from "./theme/createStylesFn";

const stylesFn = createStylesFn(() => ({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: "#242426",
    color: "#ffffff"
  }
}));

export default function App() {
  const { css, styles } = useStyles({ stylesFn });

  return <div {...css(styles.container)}><VoteResultsPage /></div>;
}