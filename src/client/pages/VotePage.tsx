import React, { useState, useEffect } from "react";
import ProgressCircle from "../components/ProgressCircle";
import { RouteComponentProps } from "@reach/router";
import IpcChannel from ":shared/IpcChannel";

const { ipcRenderer } = window.require("electron");

export type VotePageProps = RouteComponentProps;

export default function VotePage({ location }: VotePageProps) {
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

  return <div>
    <ProgressCircle value={numberOfPeopleReady} max={numberOfPeople} />
  </div>;
}