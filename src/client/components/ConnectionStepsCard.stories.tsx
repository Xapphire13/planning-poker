import React from 'react';
import CreateStory from ':storybook/CreateStory';
import ConnectionStepsCard from './ConnectionStepsCard';

export default {
  title: 'Connection Steps Card',
};

export const Default = CreateStory(() => (
  <div style={{ width: 300 }}>
    <ConnectionStepsCard connectionInfo={{ local: 'http://localhost:4000', remote: 'http://SomeRemote.com' }} />
  </div>
));

export const NoRemote = CreateStory(() => (
  <div style={{ width: 300 }}>
    <ConnectionStepsCard connectionInfo={{ local: 'http://localhost:4000' }} />
  </div>
));
