import React, { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Container from '@material-ui/core/Container';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import HStack from 'pancake-layout/dist/HStack';
import color from 'color';
import useMeasure from 'react-use/lib/useMeasure';
import VoteButton, { CARD_RATIO } from ':web/components/VoteButton';
import createStylesFn from ':web/theme/createStylesFn';
import { VoteValues, Vote } from ':web/Vote';
import {
  CastVote,
  CastVoteVariables,
  SessionState,
} from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';
import useSessionState from ':web/hooks/useSessionState';
import Theme from ':web/theme/DefaultTheme';

export type VotePageProps = RouteComponentProps;

const BUTTON_COLOR = '#9768D1';
const NUMBER_OF_CARDS = 8;
const CARDS_PER_ROW_HORIZONTAL = 2;
const CARDS_PER_ROW_VERTICAL = Math.ceil(NUMBER_OF_CARDS / 2);

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
    marginBottom: unit,
    position: 'relative',
    height: `calc(100% - ${2 * unit}px)`,
  },
  fillHeight: {
    height: '100%',
  },
  // TODO, remove once Pancake-Layout supports align content
  centerContent: {
    alignContent: 'center',
  },
}));

function calculateCardWidth(
  availableWidth: number,
  availableHeight: number,
  vertical: boolean
) {
  // Note: RATIO = SHORT_EDGE/LONG_EDGE

  // Remove margins from available height
  availableHeight -= 2 * Theme.unit; // eslint-disable-line no-param-reassign
  let idealWidth = 0;
  let idealHeight = 0;
  let numberOfRows = 0;

  // Try to fit width
  if (!vertical) {
    numberOfRows = Math.ceil(NUMBER_OF_CARDS / CARDS_PER_ROW_HORIZONTAL);
    idealWidth = Math.floor(
      (availableWidth - CARDS_PER_ROW_HORIZONTAL * 4) / CARDS_PER_ROW_HORIZONTAL
    );
    idealHeight = Math.floor(idealWidth * CARD_RATIO);
  } else {
    numberOfRows = Math.ceil(NUMBER_OF_CARDS / CARDS_PER_ROW_VERTICAL);
    idealWidth = Math.floor(
      (availableWidth - CARDS_PER_ROW_VERTICAL * 4) / CARDS_PER_ROW_VERTICAL
    );
    idealHeight = Math.floor(idealWidth / CARD_RATIO);
  }

  // If ideal width makes the cards not fit height-wise, fit by height
  if (idealHeight * numberOfRows + numberOfRows * 4 > availableHeight) {
    idealHeight = Math.floor(
      (availableHeight - numberOfRows * 4) / numberOfRows
    );

    if (!vertical) {
      idealWidth = Math.floor(idealHeight / CARD_RATIO);
    } else {
      idealWidth = Math.floor(CARD_RATIO * idealHeight);
    }
  }

  return idealWidth;
}

export default function VotePage({ navigate }: VotePageProps) {
  const [castVote] = useMutation<CastVote, CastVoteVariables>(VOTE_MUTATION);
  const { css, styles } = useStyles({ stylesFn });
  const [stackRef, { width, height }] = useMeasure();
  const sessionId = StorageUtil.local.getItem<string>('sessionId');
  const sessionState = useSessionState(sessionId);
  const showVerticalCards = width > height; // Show vertical cards in landscape windows
  const buttonWidth =
    width > 0
      ? calculateCardWidth(width, height, showVerticalCards)
      : undefined;

  useEffect(() => {
    if (sessionState === SessionState.WAITING) {
      navigate?.('/waiting');
    }
  }, [navigate, sessionState]);

  const handleVoteButtonPressed = (vote: Vote) => {
    if (!sessionId) {
      return;
    }

    (async () => {
      await castVote({
        variables: {
          vote: String(vote),
          sessionId,
        },
      });

      navigate?.('/waiting', {
        replace: true,
      });
    })();
  };

  return (
    <Container maxWidth="md" {...css(styles.container)}>
      <div ref={stackRef} {...css(styles.fillHeight)}>
        <HStack
          wrap
          hGap={4}
          justify="center"
          {...css(styles.fillHeight, styles.centerContent)}
        >
          {VoteValues.map((val, i) => (
            <VoteButton
              key={val}
              value={val}
              onPress={() => handleVoteButtonPressed(val)}
              vertical={showVerticalCards}
              width={buttonWidth}
              backgroundColor={color(BUTTON_COLOR)
                .darken(1 - 0.9 ** i) // Each tile 10% darker than the last
                .hex()}
            />
          ))}
        </HStack>
      </div>
    </Container>
  );
}
