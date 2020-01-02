import React from 'react';
import SimpsonsNames from 'simpsons-names';
import uuid from 'uuid/v4';
import VoteDistributions from ':client/components/VoteDistributions';
import CreateStory from ':storybook/CreateStory';
import User from ':shared/User';

export default {
  title: 'Vote Distributions',
};

function generateVoters(number: number) {
  return SimpsonsNames.random(number).map<User>((name) => ({
    id: uuid(),
    name,
  }));
}

export const Default = CreateStory(() => (
  <VoteDistributions votes={{
    1: generateVoters(1),
    2: generateVoters(3),
    3: generateVoters(2),
    5: generateVoters(6),
    8: generateVoters(2),
  }}
  />
));

export const Overflowing = CreateStory(() => (
  <VoteDistributions votes={{
    3: generateVoters(1),
    5: generateVoters(50),
  }}
  />
));
