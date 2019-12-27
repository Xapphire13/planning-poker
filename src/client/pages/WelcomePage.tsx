import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import IpcChannel from ":shared/IpcChannel";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

const { ipcRenderer } = window.require("electron");

export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    margin: `${unit}px 0`,
  },
  ipAddress: {
    fontWeight: "bold"
  },
  readyButton: {
    marginTop: unit,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
}));

export default function WelcomePage({ navigate }: WelcomePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [isLoading, setIsLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState<string>();
  const [numberOfPeopleConnected, setNumberOfPeopleConnected] = useState(0);

  useEffect(() => {
    ipcRenderer.invoke(IpcChannel.GetIp).then((ip: string) => {
      setIpAddress(ip);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const personConnectedListener = () => setNumberOfPeopleConnected(prev => prev + 1);
    const personDisconnectedListener = () => setNumberOfPeopleConnected(prev => prev - 1);

    (async () => {
      const count: number = await ipcRenderer.invoke(IpcChannel.GetConnectedCount);
      setNumberOfPeopleConnected(prev => prev + count);

      ipcRenderer.addListener(IpcChannel.PersonConnected, personConnectedListener);
      ipcRenderer.addListener(IpcChannel.PersonDisconnected, personDisconnectedListener);
    })();

    // Cleanup
    return () => {
      ipcRenderer.removeListener(IpcChannel.PersonConnected, personConnectedListener);
      ipcRenderer.removeListener(IpcChannel.PersonDisconnected, personDisconnectedListener);
    };
  }, []);

  const handleStartVoteClicked = () => {
    navigate?.("/vote", { state: { numberOfPeople: numberOfPeopleConnected } });
  }

  return <>
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6">Planning Poker</Typography>
      </Toolbar>
    </AppBar>
    {!isLoading && <Container maxWidth="xs" {...css(styles.container)}>
      <Typography>
        To join, go to: <span {...css(styles.ipAddress)}>http://{ipAddress}:4000</span>
      </Typography>
      <Typography variant="body2">
        {numberOfPeopleConnected} people connected
      </Typography>
      <Button variant="contained" color="primary" disabled={numberOfPeopleConnected < 2} onClick={handleStartVoteClicked} {...css(styles.readyButton)}>Ready!</Button>
    </Container>}
  </>;
}