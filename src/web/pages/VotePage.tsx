import React, { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import VoteButton from ':web/components/VoteButton';
import { createStylesFn } from ':shared/theme/createStylesFn';

const FIBONACCI_NUMBERS = [1, 2, 3, 5, 8, 13, 21];

export type VotePageProps = RouteComponentProps;

const VOTE_MUTATION = gql`
  mutation CastVote($vote: Int!) {
    vote(vote: $vote) {
      success
    }
  }
`;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    marginTop: unit,
    marginBottom: unit,
  },
}));

export default function VotePage({ navigate }: VotePageProps) {
  const [castVote] = useMutation(VOTE_MUTATION);
  const { css, styles } = useStyles({ stylesFn });

  const handleVoteButtonPressed = (vote: number) => {
    (async () => {
      await castVote({
        variables: {
          vote,
        },
      });

      navigate?.('/waiting', {
        replace: true,
      });
    })();
  };

  return (
    <Container maxWidth="sm" {...css(styles.container)}>
      <Grid container spacing={1} justify="center">
        {FIBONACCI_NUMBERS.map((val) => (
          <Grid key={val} item>
            <VoteButton value={val} onPress={() => handleVoteButtonPressed(val)} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
