import React from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import HStack from 'pancake-layout/dist/HStack';
import HStackItem from 'pancake-layout/dist/HStackItem';
import { muiTheme } from ':web/theme/DefaultTheme';
import User from ':web/User';
import createStylesFn from '../theme/createStylesFn';
import UserAvatarGroup from './UserAvatarGroup';

const STORYPOINT_BORDER_WIDTH = 2;

export type VoteDistributionRowProps = {
  storyPoints: string;
  voters: User[];
  isWinningVote?: boolean;
};

const stylesFn = createStylesFn(({ unit, color }) => ({
  container: {
    overflowX: 'hidden'
  },
  storyPointsContainer: {
    borderTop: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderRight: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderBottom: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderTopRightRadius: unit / 2,
    borderBottomRightRadius: unit / 2,
    overflow: 'hidden',
    flexShrink: 0,
    width: 7 * unit
  },
  storyPointsText: {
    textAlign: 'center',
    position: 'relative',
    padding: `0 ${2 * unit}px`,
    width: `calc(100% - ${4 * unit}px)`,
    top: '50%',
    transform: 'translateY(-50%)'
  },
  winningVoteContainer: {
    backgroundColor: color.primary,
    color: muiTheme.palette.getContrastText(color.primary)
  },
  avatarContainer: {
    paddingLeft: unit
  }
}));

export default function VoteDistributionRow({
  storyPoints,
  voters,
  isWinningVote = false
}: VoteDistributionRowProps) {
  const { css, styles } = useStyles({ stylesFn });

  return (
    <div {...css(styles.container)}>
      <HStack>
        <HStackItem
          {...css(
            styles.storyPointsContainer,
            isWinningVote && styles.winningVoteContainer
          )}
        >
          <div {...css(styles.storyPointsText)}>
            {storyPoints === 'Infinity' ? '∞' : storyPoints}
          </div>
        </HStackItem>
        <HStackItem grow {...css(styles.avatarContainer)}>
          <UserAvatarGroup users={voters} />
        </HStackItem>
      </HStack>
    </div>
  );
}
