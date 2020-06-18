import React from 'react';
import createStory from ':storybook/CreateStory';
import ConnectionStepsCard from './ConnectionStepsCard';

export default {
  title: 'Connection Steps Card',
};

// TODO
export const Default = createStory(() => (
  <div style={{ width: 300 }}>
    <ConnectionStepsCard sessionId="DEADBEEF" />
  </div>
));
