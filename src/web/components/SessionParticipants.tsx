import React from 'react';
import { createUseStyles } from 'react-jss';

import VStack from 'pancake-layout/dist/VStack';
import HStack from 'pancake-layout/dist/HStack';
import Typography from '@material-ui/core/Typography';
import UserAvatarGroup from './UserAvatarGroup';
import { ConnectionStatus } from ':__generated__/graphql';
import useConnectedUsers from ':web/hooks/useConnectedUsers';

const useStyles = createUseStyles({
  disconnectedUser: {
    filter: 'saturate(0.5) brightness(0.5)'
  }
});

type SessionParticipantsProps = {
  sessionId: string;
};

export default function SessionParticipants({
  sessionId
}: SessionParticipantsProps) {
  const styles = useStyles();
  const users = useConnectedUsers(sessionId);

  return (
    <VStack>
      <HStack justify="space-between">
        <Typography variant="caption">Session Participants</Typography>
        <Typography variant="caption">Session Code: {sessionId}</Typography>
      </HStack>
      {users.length <= 0 && (
        <Typography align="center">0 people connected</Typography>
      )}
      {users.length > 0 && (
        <UserAvatarGroup
          users={users.map(user => {
            return {
              ...user,
              customClassName:
                user.connectionStatus === ConnectionStatus.DISCONNECTED
                  ? styles.disconnectedUser
                  : undefined
            };
          })}
        />
      )}
    </VStack>
  );
}
