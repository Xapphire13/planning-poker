import React, { useState, useEffect } from "react";
import ProgressCircle from "../components/ProgressCircle";
import { RouteComponentProps } from "@reach/router";
import IpcChannel from ":shared/IpcChannel";
import { Stack, StackItem } from "office-ui-fabric-react/lib/Stack";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { createStylesFn } from ":client/theme/createStylesFn";

const { ipcRenderer } = window.require("electron");

export type VotePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  contentContainer: {
    padding: unit,
    height: `calc(100% - ${2 * unit}px)`,
  },
  header: {
    fontSize: 3 * unit,
    textAlign: "center",
    marginBottom: unit
  },
}));

export default function VotePage({ location, navigate }: VotePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [numberOfPeopleReady, setNumberOfPeopleReady] = useState(0);
  const numberOfPeople: number = location?.state?.numberOfPeople ?? 100;

  useEffect(() => {
    const voteCastListener = () => setNumberOfPeopleReady(prev => prev + 1);
    ipcRenderer.on(IpcChannel.VoteCast, voteCastListener);

    // Cleanup
    return () => {
      ipcRenderer.removeListener(IpcChannel.VoteCast, voteCastListener);
    }
  }, []);

  return <Stack verticalFill>
    <StackItem grow>
      <div {...css(styles.contentContainer)}>
        <Stack verticalFill verticalAlign="center">
          <div {...css(styles.header)}>Waiting for votes</div>
          <div>
            <ProgressCircle value={numberOfPeopleReady} max={numberOfPeople} />
          </div>
        </Stack>
      </div>
    </StackItem>
    <DefaultButton onClick={() => navigate?.("/")}>Cancel</DefaultButton>
  </Stack>;
}