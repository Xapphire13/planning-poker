import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import User from ":shared/User";
import LocalStorageUtils from ":web/LocalStorageUtils";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typeography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import gql from "graphql-tag";
export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  marginTop: {
    marginTop: unit
  },
  button: {
    marginTop: unit,
    marginLeft: "auto",
    marginRight: "auto",
    display: "block"
  }
}));

const JOIN_MUTATION = gql`
mutation JoinSession($name: String!){
  join(name: $name) {
    success
  }
}
`;

export default function WelcomePage({ navigate }: WelcomePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [name, setName] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [joinSession] = useMutation(JOIN_MUTATION);

  useEffect(() => {
    let user = LocalStorageUtils.getItem<User>("user")!;

    setName(user.name);
    setUserId(user.id);
  }, []);

  const handleJoin = () => {
    LocalStorageUtils.setItem<User>("user", {
      id: userId!,
      name: name!
    });

    (async () => {
      await joinSession({
        variables: {
          name
        }
      });

      navigate?.("/waiting");
    })();
  };

  return <>
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typeography variant="h6">Planning poker</Typeography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="sm" {...css(styles.marginTop)}>
      <TextField label="Name" required fullWidth value={name ?? ''} onChange={(ev) => setName(ev.target.value)} />
      <Button {...css(styles.button)} variant="contained" color="primary" disabled={!name || !userId} onClick={handleJoin}>Join</Button>
    </Container>
  </>;
}