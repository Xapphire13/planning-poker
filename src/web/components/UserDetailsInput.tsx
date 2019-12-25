import React from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import Theme, { officeTheme } from ":shared/theme/DefaultTheme";
import { ITheme } from "office-ui-fabric-react/lib/Styling";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";

const inputTheme: ITheme = {
  ...officeTheme,
  semanticColors: {
    ...officeTheme.semanticColors,
    inputBackground: Theme.color.background,
    inputText: Theme.color.text.default,
  }
};

const stylesFn = createStylesFn(({ color, unit }) => ({
  headerContainer: {
    borderBottom: `1px solid ${color.rule}`
  },
  header: {
    marginTop: 2 * unit,
    marginBottom: unit
  },
  fieldContainer: {
    padding: `0 ${2 * unit}px`
  }
}));

export type UserDetailsInputProps = {
  name: string | undefined;

  onNameChanged: (newName: string | undefined) => void;
}

export default function UserDetailsInput({ name, onNameChanged }: UserDetailsInputProps) {
  const { css, styles } = useStyles({ stylesFn });

  return <>
    <div {...css(styles.headerContainer)}>
      <h2 {...css(styles.header)}>Please enter your information</h2>
    </div>
    <div {...css(styles.fieldContainer)}>
      <Stack>
        <TextField label="Name" required underlined theme={inputTheme} value={name} onChange={(_, newValue) => onNameChanged(newValue)} />
      </Stack>
    </div>
  </>;
}