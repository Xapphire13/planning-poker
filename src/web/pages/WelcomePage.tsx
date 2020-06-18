import React, { useState, useEffect } from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import { useMutation } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import { RouteComponentProps } from '@reach/router';
import StorageUtil from ':web/utils/storageUtil';
import createStylesFn from ':web/theme/createStylesFn';
import isSsr from ':web/utils/isSsr';
import User from ':web/User';
import {
  JoinSession,
  JoinSessionVariables,
  SessionState,
} from ':__generated__/graphql';
import AppBarLayout from ':web/layouts/AppBarLayout';

export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  marginTop: {
    marginTop: unit,
  },
  button: {
    marginTop: unit,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
}));

const JOIN_MUTATION = gql`
  mutation JoinSession($name: String!, $sessionId: String!) {
    sessionState: join(name: $name, sessionId: $sessionId)
  }
`;

/**
 * Gets value entered into an input box after SSR and before React hydrated the page
 *
 * @param inputId The DOM id of the input
 */
function getValueEnteredBeforeScriptLoad(inputId: string) {
  if (isSsr()) {
    return undefined;
  }

  const input = document.getElementById(inputId) as HTMLInputElement | null;

  return input?.value;
}

export default function WelcomePage({ navigate }: WelcomePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [name, setName] = useState(() =>
    getValueEnteredBeforeScriptLoad('name-input')
  );
  const [userId, setUserId] = useState(() =>
    getValueEnteredBeforeScriptLoad('session-id-input')
  );
  const [sessionId, setSessionId] = useState<string>();
  const [joinSession] = useMutation<JoinSession, JoinSessionVariables>(
    JOIN_MUTATION
  );

  useEffect(() => {
    const user = StorageUtil.local.getItem<User>('user')!;

    if (user.name) {
      setName(user.name);
    }
    setUserId(user.id);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const restoredSessionId =
      searchParams.get('sessionId') || StorageUtil.local.getItem('sessionId');

    if (restoredSessionId) {
      setSessionId(restoredSessionId);
    }
  }, []);

  const handleJoin = () => {
    if (!name || !sessionId) {
      return;
    }

    StorageUtil.local.setItem<User>('user', {
      id: userId!,
      name: name!,
    });

    (async () => {
      const sessionState = (
        await joinSession({
          variables: {
            name,
            sessionId,
          },
        })
      )?.data?.sessionState;

      StorageUtil.local.setItem('sessionId', sessionId);

      if (sessionState === SessionState.VOTING) {
        navigate?.('/vote');
      } else {
        navigate?.('/waiting');
      }
    })();
  };

  const handleHostSession = () => {
    navigate?.('/host');
  };

  return (
    <AppBarLayout>
      <TextField
        id="session-id-input"
        label="Session ID"
        required
        fullWidth
        value={sessionId ?? ''}
        onChange={(ev) => setSessionId(ev.target.value)}
        autoFocus
      />
      <TextField
        id="name-input"
        label="Name"
        {...css(styles.marginTop)}
        required
        fullWidth
        value={name ?? ''}
        onChange={(ev) => setName(ev.target.value)}
      />
      <Button
        {...css(styles.button)}
        variant="contained"
        color="primary"
        disabled={!name || !sessionId || !userId}
        onClick={handleJoin}
      >
        Join
      </Button>
      <Button
        {...css(styles.button)}
        variant="text"
        color="secondary"
        onClick={handleHostSession}
      >
        or host new session
      </Button>
    </AppBarLayout>
  );
}
