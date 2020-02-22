import React from 'react';
import { storiesOf } from '@storybook/react';
import shortid from 'shortid';
import SimpsonNames from 'simpsons-names';
import createStory from ':storybook/CreateStory';
import SessionParticipants from './SessionParticipants';
import { UserWithConnectionStatus } from ':web/User';
import { ConnectionStatus } from '../../__generated__/graphql';

// TODO
// @ts-ignore
function generateUser(
  overrides: Partial<UserWithConnectionStatus> = {}
): UserWithConnectionStatus {
  return {
    id: shortid(),
    name: SimpsonNames.random(),
    connectionStatus: ConnectionStatus.CONNECTED,
    ...overrides
  };
}

storiesOf('SessionParticipants', module).add(
  'default',
  createStory(() => (
    <SessionParticipants
      sessionId="12345"
      // TODO
      // users={[
      //   generateUser({ name: '🐝' }),
      //   generateUser(),
      //   generateUser(),
      //   generateUser({ connectionStatus: ConnectionStatus.DISCONNECTED })
      // ]}
    />
  ))
);
