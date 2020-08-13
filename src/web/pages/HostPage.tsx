import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import ConnectionStepsCard from ':web/components/ConnectionStepsCard';
import createStylesFn from '../theme/createStylesFn';
import {
  CreateSession,
  CreateSessionVariables,
  VoteSequenceType,
} from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';
import useConnectedUsers from ':web/hooks/useConnectedUsers';
import AppBarLayout from '../layouts/AppBarLayout';
import SessionParticipantsLayout from ':web/layouts/SessionParticipantsLayout';
import { DEFAULT_TIME_LIMIT, DEFAULT_COLOR } from ':web/constants';

export type HostPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  readyButton: {
    marginTop: unit,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  fullHeight: {
    height: '100%',
  },
}));

const CREATE_SESSION_MUTATION = gql`
  mutation CreateSession(
    $timeLimit: Int!
    $sequence: String!
    $colorHex: String!
  ) {
    createSession(
      timeLimit: $timeLimit
      sequence: $sequence
      colorHex: $colorHex
    ) {
      id
    }
  }
`;

export default function WelcomePage({ navigate }: HostPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const timeLimit: number =
    StorageUtil.session.getItem('sessionTimeLimit') ?? DEFAULT_TIME_LIMIT;
  const sequence =
    StorageUtil.session.getItem('sessionSequence') ??
    VoteSequenceType.FIBONACCI;
  const colorHex = StorageUtil.session.getItem('sessionColor') ?? DEFAULT_COLOR;
  const [sessionId, setSessionId] = useState<string | undefined>(
    StorageUtil.session.getItem('sessionId')
  );
  const [createSession] = useMutation<CreateSession, CreateSessionVariables>(
    CREATE_SESSION_MUTATION
  );
  const connectedUsers = useConnectedUsers(sessionId);

  useEffect(() => {
    if (!sessionId) {
      (async () => {
        const result = await createSession({
          variables: {
            timeLimit,
            sequence,
            colorHex,
          },
        });

        if (result.data?.createSession?.id) {
          setSessionId(result.data.createSession.id);
          StorageUtil.session.setItem(
            'sessionId',
            result.data.createSession.id
          );
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSession, sessionId]);

  const handleStartVoteClicked = () => {
    navigate?.('/waitingForVotes');
  };

  const numberOfPeopleConnected = connectedUsers.length;

  return (
    <AppBarLayout>
      <SessionParticipantsLayout sessionId={sessionId}>
        {sessionId && <ConnectionStepsCard sessionId={sessionId} />}

        <Button
          variant="contained"
          color="primary"
          disabled={numberOfPeopleConnected < 2}
          onClick={handleStartVoteClicked}
          {...css(styles.readyButton)}
        >
          Ready!
        </Button>
      </SessionParticipantsLayout>
    </AppBarLayout>
  );
}
