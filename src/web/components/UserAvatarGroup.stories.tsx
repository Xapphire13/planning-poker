import React from 'react';
import { storiesOf } from '@storybook/react';
import shortid from 'shortid';
import SimpsonsNames from 'simpsons-names';
import createStory from ':storybook/CreateStory';
import User from ':web/User';
import UserAvatarGroup from './UserAvatarGroup';

function generateUsers(number: number) {
  return SimpsonsNames.random(number).map<User>((name) => ({
    id: shortid(),
    name,
  }));
}

storiesOf('UserAvatarGroup', module)
  .add(
    'default',
    createStory(() => <UserAvatarGroup users={generateUsers(10)} />)
  )
  .add(
    'overflowing',
    createStory(() => <UserAvatarGroup users={generateUsers(100)} />)
  );
