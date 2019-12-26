import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import HourglassEmpty from "@material-ui/icons/HourglassEmpty";
import { RouteComponentProps } from "@reach/router";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import Button from "@material-ui/core/Button";

export type WaitingPageProps = RouteComponentProps;

const stylesFn = createStylesFn(() => ({
  container: {
    textAlign: "center",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)"
  },
  icon: {
    fontSize: 100
  },
  cancelButton: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
}));

export default function WaitingPage({ }: WaitingPageProps) {
  const { css, styles } = useStyles({ stylesFn });

  return <Container maxWidth="sm" {...css(styles.container)}>
    <Typography>Waiting for vote to start</Typography>
    <HourglassEmpty {...css(styles.icon)} />
    <Button variant="text" {...css(styles.cancelButton)} onClick={() => window.history.back()}>Cancel</Button>
  </Container>;
}