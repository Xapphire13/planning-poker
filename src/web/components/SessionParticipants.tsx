import React from 'react';

import VStack from 'pancake-layout/dist/VStack';
import HStack from 'pancake-layout/dist/HStack';
import Typography from '@material-ui/core/Typography';
import purple from '@material-ui/core/colors/purple';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import UserAvatarGroup from './UserAvatarGroup';
import { ConnectionStatus } from ':__generated__/graphql';
import useConnectedUsers from ':web/hooks/useConnectedUsers';

const disconnectedUser = css`
  filter: saturate(0.5) brightness(0.5);
`;

const SessionCode = styled.span`
  color: ${purple['300']};
`;

type SessionParticipantsProps = {
  sessionId: string;
};

export default function SessionParticipants({
  sessionId,
}: SessionParticipantsProps) {
  const users = useConnectedUsers(sessionId);

  return (
    <VStack>
      <HStack justify="space-between">
        <Typography variant="caption">Session Participants</Typography>
        <Typography variant="caption">
          Session Code: <SessionCode>{sessionId}</SessionCode>
        </Typography>
      </HStack>
      {users.length <= 0 && (
        <Typography align="center">0 people connected</Typography>
      )}
      {users.length > 0 && (
        <UserAvatarGroup
          users={users.map((user) => {
            return {
              ...user,
              customClassName:
                user.connectionStatus === ConnectionStatus.DISCONNECTED
                  ? disconnectedUser
                  : undefined,
            };
          })}
        />
      )}
    </VStack>
  );
}
