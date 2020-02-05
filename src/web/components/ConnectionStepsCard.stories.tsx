import React from 'react';
import CreateStory from ':storybook/CreateStory';
import ConnectionStepsCard from './ConnectionStepsCard';

export default {
  title: 'Connection Steps Card'
};

// TODO
export const Default = CreateStory(() => (
  <div style={{ width: 300 }}>
    <ConnectionStepsCard sessionId="DEADBEEF" />
  </div>
));
