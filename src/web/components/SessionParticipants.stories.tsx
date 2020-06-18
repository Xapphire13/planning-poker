/* eslint-disable global-require */
import React from 'react';
import { storiesOf } from '@storybook/react';
import shortid from 'shortid';
import SimpsonNames from 'simpsons-names';
import rewiremock from 'rewiremock/webpack';
import createStory from ':storybook/CreateStory';
import _SessionParticipants from './SessionParticipants';

import { UserWithConnectionStatus } from ':web/User';
import { ConnectionStatus } from '../../__generated__/graphql';

function generateUser(
  overrides: Partial<UserWithConnectionStatus> = {}
): UserWithConnectionStatus {
  return {
    id: shortid(),
    name: SimpsonNames.random(),
    connectionStatus: ConnectionStatus.CONNECTED,
    ...overrides,
  };
}

storiesOf('SessionParticipants', module).add(
  'default',
  createStory(() => {
    const SessionParticipants = rewiremock.proxy(
      () => require('./SessionParticipants'),
      {
        '../hooks/useConnectedUsers': () => [
          generateUser({ name: '🐝' }),
          generateUser(),
          generateUser(),
          generateUser({ connectionStatus: ConnectionStatus.DISCONNECTED }),
        ],
      }
    ).default as typeof _SessionParticipants;

    return <SessionParticipants sessionId="12345" />;
  })
);
