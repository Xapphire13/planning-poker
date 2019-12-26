import React from "react";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import TextField from "@material-ui/core/TextField";

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

export default function UserDetailsInput({ name = '', onNameChanged }: UserDetailsInputProps) {
  const { css, styles } = useStyles({ stylesFn });

  return <>
    <div {...css(styles.headerContainer)}>
      <h2 {...css(styles.header)}>Please enter your information</h2>
    </div>
    <div {...css(styles.fieldContainer)}>
      <TextField label="Name" required fullWidth value={name} onChange={(ev) => onNameChanged(ev.target.value)} />
    </div>
  </>;
}