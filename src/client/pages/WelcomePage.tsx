import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { createStylesFn } from "../theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import Theme from "../theme/DefaultTheme";
import IpcChannel from ":shared/IpcChannel";

const { ipcRenderer } = window.require("electron");

export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    padding: unit
  },
  header: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: unit * 4
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

    (async () => {
      const count: number = await ipcRenderer.invoke(IpcChannel.GetConnectedCount);
      setNumberOfPeopleConnected(prev => prev + count);

      ipcRenderer.addListener(IpcChannel.PersonConnected, personConnectedListener);
    })();

    // Cleanup
    return () => {
      ipcRenderer.removeListener(IpcChannel.PersonConnected, personConnectedListener);
    };
  }, []);

  return <>
    {!isLoading && <div {...css(styles.container)}>
      <div {...css(styles.header)}>
        Planning Poker
      </div>
      <Stack gap={Theme.unit}>
        <div>
          To join, go to: http://{ipAddress}
        </div>
        <div>
          {numberOfPeopleConnected} people connected
      </div>
        <PrimaryButton disabled={numberOfPeopleConnected < 2} onClick={() => navigate?.("/vote", { state: { numberOfPeople: numberOfPeopleConnected } })}>Ready!</PrimaryButton>
      </Stack>
    </div>}
  </>
}