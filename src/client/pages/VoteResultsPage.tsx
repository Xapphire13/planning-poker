import React, { useState, useEffect } from "react";
import VoteDistributions from "../components/VoteDistributions";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { RouteComponentProps } from "@reach/router";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import IpcChannel from ":shared/IpcChannel";
import User from ":shared/User";

const { ipcRenderer } = window.require("electron");

export type VoteResultsPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  contentContainer: {
    padding: unit,
  }
}));

function averageOfVotes(votes: Record<number, number>) {
  let count = 0;
  let total = 0;
  Object.keys(votes).forEach(key => {
    count += votes[+key];
    total += votes[+key] * +key;
  });

  return total / count;
}

function numberOfVotes(votes: Record<number, number>) {
  return Object.keys(votes).reduce((res, key) => res + votes[+key], 0);
}

export default function VoteResultsPage({ navigate }: VoteResultsPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [votes, setVotes] = useState<Record<number, number>>();

  useEffect(() => {
    (async () => {
      const usersAndVote: [User, number][] = await ipcRenderer.invoke(IpcChannel.GetResults);

      const results = usersAndVote.reduce<Record<number, number>>((result, [user, vote]) => {
        if (!result[vote]) {
          result[vote] = 0;
        }

        result[vote]++;

        return result;
      }, {});

      setVotes(results);
    })();
  }, []);

  return <>
    {votes && <Stack verticalFill verticalAlign="space-between">
      <div {...css(styles.contentContainer)}>
        <div>Average: {averageOfVotes(votes).toPrecision(1)}</div>
      </div>
      <div>
        <VoteDistributions votes={votes} />
      </div>
      <PrimaryButton onClick={() => navigate?.("/vote", { state: { numberOfPeople: numberOfVotes(votes) } })}>New vote</PrimaryButton>
    </Stack>}
  </>;
}