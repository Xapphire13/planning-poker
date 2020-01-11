import React from 'react';
import CreateStory from ':storybook/CreateStory';
import ConnectionStepsCard from './ConnectionStepsCard';

export default {
  title: 'Connection Steps Card'
};

export const Default = CreateStory(() => (
  <div style={{ width: 300 }}>
    <ConnectionStepsCard
      connectionInterfaces={[
        {
          name: 'WiFi',
          address: 'http://192.168.0.1:4000'
        },
        {
          name: 'NGrok',
          address: 'http://deadbeef.ngrok.io'
        }
      ]}
      toggleNgrok={() => Promise.resolve()}
    />
  </div>
));

export const SingleChoice = CreateStory(() => (
  <div style={{ width: 300 }}>
    <ConnectionStepsCard
      connectionInterfaces={[
        {
          name: 'WiFi',
          address: 'http://192.168.0.1:4000'
        }
      ]}
      toggleNgrok={() => Promise.resolve()}
    />
  </div>
));
