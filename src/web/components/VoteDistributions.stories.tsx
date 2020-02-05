import React from 'react';
import SimpsonsNames from 'simpsons-names';
import uuid from 'uuid/v4';
import VoteDistributions from ':web/components/VoteDistributions';
import CreateStory from ':storybook/CreateStory';
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
export const Default = CreateStory(() => (
  <VoteDistributions results={[]} users={[]} />
));

// TODO
export const Overflowing = CreateStory(() => (
  <VoteDistributions users={generateVoters(50)} results={[]} />
));
