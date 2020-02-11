import React from 'react';
import { RouteComponentProps } from '@reach/router';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Container from '@material-ui/core/Container';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import HStack from 'pancake-layout/dist/HStack';
import color from 'color';
import VoteButton from ':web/components/VoteButton';
import createStylesFn from ':web/theme/createStylesFn';
import { VoteValues, Vote } from ':web/Vote';
import { CastVote, CastVoteVariables } from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';

export type VotePageProps = RouteComponentProps;

const BUTTON_COLOR = '#9768D1';

const VOTE_MUTATION = gql`
  mutation CastVote($vote: String!, $sessionId: String!) {
    vote(vote: $vote, sessionId: $sessionId) {
      success
    }
  }
`;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    marginTop: unit,
    marginBottom: unit
  },
  stack: {
    maxWidth: 300,
    left: '50%',
    transform: 'translateX(-50%)'
  }
}));

export default function VotePage({ navigate }: VotePageProps) {
  const [castVote] = useMutation<CastVote, CastVoteVariables>(VOTE_MUTATION);
  const { css, styles } = useStyles({ stylesFn });
  const sessionId = StorageUtil.local.getItem<string>('sessionId');

  const handleVoteButtonPressed = (vote: Vote) => {
    if (!sessionId) {
      return;
    }

    (async () => {
      await castVote({
        variables: {
          vote: String(vote),
          sessionId
        }
      });

      navigate?.('/waiting', {
        replace: true
      });
    })();
  };

  return (
    <Container maxWidth="sm" {...css(styles.container)}>
      <HStack {...css(styles.stack)} wrap hGap={4} vGap={2}>
        {VoteValues.map((val, i) => (
          <VoteButton
            value={val}
            onPress={() => handleVoteButtonPressed(val)}
            backgroundColor={color(BUTTON_COLOR)
              .darken(1 - 0.9 ** i) // Each tile 10% darker than the last
              .hex()}
          />
        ))}
      </HStack>
    </Container>
  );
}
