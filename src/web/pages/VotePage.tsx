import React from 'react';
import { RouteComponentProps } from '@reach/router';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import VoteButton from ':web/components/VoteButton';
import createStylesFn from ':web/theme/createStylesFn';
import { VoteValues, Vote } from ':web/Vote';
import { CastVote, CastVoteVariables } from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';

export type VotePageProps = RouteComponentProps;

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
      <Grid container spacing={1} justify="center">
        {VoteValues.map(val => (
          <Grid key={val} item>
            <VoteButton
              value={val}
              onPress={() => handleVoteButtonPressed(val)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
