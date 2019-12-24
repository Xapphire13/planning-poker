import React, { useState, useEffect } from "react";
import ProgressCircle from "../components/ProgressCircle";
import { RouteComponentProps } from "@reach/router";

const { ipcRenderer } = window.require("electron");

export type VotePageProps = RouteComponentProps;

export default function VotePage({ location }: VotePageProps) {
  const [numberOfPeopleReady, setNumberOfPeopleReady] = useState(0);
  const numberOfPeople: number = location?.state?.numberOfPeople ?? 100;

  useEffect(() => {
    const voteCastListener = () => setNumberOfPeopleReady(prev => prev + 1);
    ipcRenderer.on("vote-cast", voteCastListener);

    // Cleanup
    return () => {
      ipcRenderer.removeListener("vote-cast", voteCastListener);
    }
  }, []);

  return <div>
    <ProgressCircle value={numberOfPeopleReady} max={numberOfPeople} />
  </div>;
}