import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { Stack, StackItem } from "office-ui-fabric-react/lib/Stack";
import IpcChannel from ":shared/IpcChannel";

const { ipcRenderer } = window.require("electron");

export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  contentContainer: {
    padding: unit,
    height: `calc(100% - ${2 * unit}px)`
  },
  header: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: unit * 4
  },
  ipAddress: {
    fontWeight: "bold"
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
    {!isLoading && <Stack verticalFill>
      <StackItem grow>
        <div {...css(styles.contentContainer)}>
          <div {...css(styles.header)}>
            Planning Poker
          </div>
          <Stack>
            <div>
              To join, go to: <span {...css(styles.ipAddress)}>http://{ipAddress}</span>
            </div>
            <div>
              {numberOfPeopleConnected} people connected
          </div>
          </Stack>
        </div>
      </StackItem>
      <PrimaryButton disabled={numberOfPeopleConnected < 2} onClick={handleStartVoteClicked}>Ready!</PrimaryButton>
    </Stack>}
  </>;
}