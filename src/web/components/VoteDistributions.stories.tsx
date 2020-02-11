import React from 'react';
import SimpsonsNames from 'simpsons-names';
import uuid from 'uuid/v4';
import VoteDistributions from ':web/components/VoteDistributions';
import createStory from ':storybook/CreateStory';
import User from ':web/User';

export default {
  title: 'Vote Distributions'
};

function generateVoters(number: number) {
  return SimpsonsNames.random(number).map<User>(name => ({
    id: uuid(),
    name
  }));
}

// TODO
export const Default = createStory(() => (
  <VoteDistributions results={[]} users={[]} />
));

// TODO
export const Overflowing = createStory(() => (
  <VoteDistributions users={generateVoters(50)} results={[]} />
));
