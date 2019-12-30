import React from 'react';
import VoteDistributions from ":client/components/VoteDistributions";
import CreateStory from ':storybook/CreateStory';

export default {
  title: 'Vote Distributions',
};

export const Default = CreateStory(() => <VoteDistributions votes={{
  1: 1,
  2: 2
}} />)