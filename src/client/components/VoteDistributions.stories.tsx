import React from 'react';
import VoteDistributions from ":client/components/VoteDistributions";
import CreateStory from ':storybook/CreateStory';
import SimpsonsNames from "simpsons-names";
import User from ':shared/User';

export default {
  title: 'Vote Distributions',
};

function generateVoters(number: number) {
  return SimpsonsNames.random(number).map<User>(name => ({
    id: "FAKE",
    name
  }))
}

export const Default = CreateStory(() => <VoteDistributions votes={{
  1: generateVoters(1),
  2: generateVoters(5),
  3: generateVoters(2)
}} />)