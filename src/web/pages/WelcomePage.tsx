import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import UserDetailsInput from ":web/components/UserDetailsInput";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Stack, StackItem } from "office-ui-fabric-react/lib/Stack";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  contentContainer: {
    padding: unit
  },
  heading: {
    marginTop: 0
  }
}));

export default function WelcomePage({ }: WelcomePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [name, setName] = useState<string>();

  return <Stack verticalFill>
    <StackItem grow {...css(styles.contentContainer)}>
      <h1 {...css(styles.heading)}>Planning Poker</h1>
      <UserDetailsInput name={name} onNameChanged={setName} />
    </StackItem>
    <PrimaryButton disabled={!name}>Join</PrimaryButton>
  </Stack>;
}