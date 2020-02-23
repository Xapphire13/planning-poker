import React from 'react';
import { storiesOf } from '@storybook/react';
import HStack from 'pancake-layout/dist/HStack';
import color from 'color';
import createStory from ':storybook/CreateStory';
import VoteButton from './VoteButton';

storiesOf('VoteButton', module)
  .add(
    'default',
    createStory(() => (
      <>
        <VoteButton value={13} onPress={() => {}} />
      </>
    ))
  )
  .add(
    'many',
    createStory(() => (
      <>
        <HStack style={{ width: 300 }} wrap hGap={4} vGap={2}>
          <VoteButton value={1} onPress={() => {}} backgroundColor="#9768D1" />
          <VoteButton
            value={2}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            value={3}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            value={5}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            value={8}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            value={13}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            value={21}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            value="Infinity"
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
        </HStack>
      </>
    ))
  )
  .add(
    'vertical',
    createStory(() => (
      <>
        <HStack style={{ width: 500 }} wrap hGap={4} vGap={2} justify="center">
          <VoteButton
            vertical
            value={1}
            onPress={() => {}}
            backgroundColor="#9768D1"
          />
          <VoteButton
            vertical
            value={2}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            vertical
            value={3}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            vertical
            value={5}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            vertical
            value={8}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            vertical
            value={13}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            vertical
            value={21}
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
          <VoteButton
            vertical
            value="Infinity"
            onPress={() => {}}
            backgroundColor={color('#9768D1')
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .darken(0.1)
              .hex()}
          />
        </HStack>
      </>
    ))
  );
