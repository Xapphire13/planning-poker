import React, { useState, useEffect } from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import { useMutation } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typeography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import { RouteComponentProps } from '@reach/router';
import LocalStorageUtils from ':web/LocalStorageUtils';
import createStylesFn from ':shared/theme/createStylesFn';
import isServer from ':shared/isServer';
import User from ':shared/User';

export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  marginTop: {
    marginTop: unit
  },
  button: {
    marginTop: unit,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  }
}));

const JOIN_MUTATION = gql`
  mutation JoinSession($name: String!) {
    join(name: $name) {
      success
    }
  }
`;

export default function WelcomePage({ navigate }: WelcomePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [name, setName] = useState(() => {
    if (isServer()) {
      return undefined;
    }

    const nameInput = document.getElementById(
      'name-input'
    ) as HTMLInputElement | null;

    return nameInput?.value;
  });
  const [userId, setUserId] = useState<string>();
  const [joinSession] = useMutation(JOIN_MUTATION);

  useEffect(() => {
    const user = LocalStorageUtils.getItem<User>('user')!;

    if (user.name) {
      setName(user.name);
    }
    setUserId(user.id);
  }, []);

  const handleJoin = () => {
    LocalStorageUtils.setItem<User>('user', {
      id: userId!,
      name: name!
    });

    (async () => {
      await joinSession({
        variables: {
          name
        }
      });

      navigate?.('/waiting');
    })();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typeography variant="h6">Planning poker</Typeography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" {...css(styles.marginTop)}>
        <TextField
          id="name-input"
          label="Name"
          required
          fullWidth
          value={name ?? ''}
          onChange={ev => setName(ev.target.value)}
        />
        <Button
          {...css(styles.button)}
          variant="contained"
          color="primary"
          disabled={!name || !userId}
          onClick={handleJoin}
        >
          Join
        </Button>
      </Container>
    </>
  );
}
