import React from 'react';
import SimpsonsNames from 'simpsons-names';
import { v4 as uuidv4 } from 'uuid';
import VoteDistributions from ':web/components/VoteDistributions';
import createStory from ':storybook/CreateStory';
import User from ':web/User';

export default {
  title: 'Vote Distributions',
};

function generateVoters(number: number) {
  return SimpsonsNames.random(number).map<User>((name) => ({
    id: uuidv4(),
    name,
  }));
}

function generateVote(start: number = 1, end?: number) {
  return (user: User) => ({
    userId: user.id,
    vote: (start + Math.floor((end ?? start + 10) * Math.random())).toString(),
  });
}

export const Default = createStory(() => {
  const users = generateVoters(5);

  return (
    <VoteDistributions results={users.map(generateVote())} users={users} />
  );
});

export const Overflowing = createStory(() => {
  const users = generateVoters(50);
  return (
    <VoteDistributions results={users.map(generateVote(1, 1))} users={users} />
  );
});
