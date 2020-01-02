import React, { useRef, useEffect, useState } from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import { CSSProperties } from 'react-with-styles';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import { colors, Color } from '@material-ui/core';
import hashSum from 'hash-sum';
import Grid from '@material-ui/core/Grid';
import Theme, { muiTheme } from ':shared/theme/DefaultTheme';
import User from ':shared/User';
import createStylesFn from '../../shared/theme/createStylesFn';


const STORYPOINT_BORDER_WIDTH = 2;
const AVATAR_SIZE = 5 * Theme.unit;

function getColorsForUser(user: User) {
  const colorKeys = Object.keys(colors).filter((key) => key !== 'common');
  const index = Number.parseInt(`0x${hashSum(user.name)}`, 16) % colorKeys.length;
  const key = colorKeys[index];
  const background = ((colors as any)[key] as Color)[500];
  const foreground = muiTheme.palette.getContrastText(background);

  return { background, foreground };
}

function getInitials(user: User) {
  const parts = user.name.split(/\s+/);

  return parts.slice(0, 2).map((part) => part[0].toLocaleUpperCase()).join('');
}

export type VoteDistributionRowProps = {
  storyPoints: number;
  voters: User[];
  totalVotes: number;
  isWinningVote?: boolean;
};

const stylesFn = createStylesFn(({ unit, color }) => ({
  container: {
    overflowX: 'hidden',
  },
  storyPointsContainer: {
    borderTop: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderRight: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderBottom: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderTopRightRadius: unit / 2,
    borderBottomRightRadius: unit / 2,
    overflow: 'hidden',
    flexShrink: 0,
  },
  storyPointsText: {
    textAlign: 'center',
    position: 'relative',
    padding: `0 ${2 * unit}px`,
    width: `calc(100% - ${4 * unit}px)`,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  winningVoteContainer: {
    backgroundColor: color.primary,
    color: muiTheme.palette.getContrastText(color.primary),
  },
  storyPointsContent: {
    position: 'relative',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  avatarContainer: {
    paddingLeft: unit,
  },
  avatarGroup: {
    position: 'relative',
    top: '50%',
    left: unit,
    transform: 'translateY(-50%)',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  overflowAvatar: {
    backgroundColor: colors.grey[500],
    color: muiTheme.palette.getContrastText(colors.grey[500]),
  },
}));

export default function VoteDistributionRow({ storyPoints, voters, isWinningVote = false }: VoteDistributionRowProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [maxAvatars, setMaxAvatars] = useState<number>();
  const containerRef = useRef<HTMLDivElement>();
  const avatarContainerRef = useRef<HTMLDivElement>();

  const configureMaxAvatarSpace = () => {
    if (containerRef.current && avatarContainerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const avatarContainerRect = avatarContainerRef.current.getBoundingClientRect();
      const maxAvatarSpace = containerRect.width - avatarContainerRect.left - Theme.unit;
      const fullAvatarSize = AVATAR_SIZE + 4;
      const condensedAvatarSize = AVATAR_SIZE - 4;
      // Max space - <firstAvatar> - <+X avatar>
      const availableSpace = (maxAvatarSpace - fullAvatarSize - condensedAvatarSize);
      setMaxAvatars(Math.floor(availableSpace / condensedAvatarSize));
    }
  };

  useEffect(() => {
    window.addEventListener('resize', configureMaxAvatarSpace);

    return () => {
      window.removeEventListener('resize', configureMaxAvatarSpace);
    };
  }, []);

  useEffect(configureMaxAvatarSpace);

  const avatarsToDisplay = voters.slice(0, maxAvatars);
  const hiddenAvatars = voters.slice(maxAvatars);

  return (
    <div {...css(styles.container)} ref={containerRef}>
      <Grid container wrap="nowrap">
        <Grid item {...css(styles.storyPointsContainer, isWinningVote && styles.winningVoteContainer)}>
          <div {...css(styles.storyPointsText)}>
            {storyPoints}
          </div>
        </Grid>
        <Grid item {...css(styles.avatarContainer)} ref={avatarContainerRef}>
          <AvatarGroup {...css(styles.avatarGroup)}>
            {[...avatarsToDisplay.map((voter) => {
              const { background, foreground } = getColorsForUser(voter);

              const computedStyles: CSSProperties = {
                color: foreground,
                backgroundColor: background,
              };

              return <Tooltip title={voter.name} key={voter.id} {...css(computedStyles)}><Avatar {...css(styles.avatar)}>{getInitials(voter)}</Avatar></Tooltip>;
            }),
            hiddenAvatars.length > 0 && (
            <Tooltip title={hiddenAvatars.map((user) => <div key={user.id}>{user.name}</div>)} key="hidden">
              <Avatar {...css(styles.avatar, styles.overflowAvatar)}>
+
                {hiddenAvatars.length}
              </Avatar>
            </Tooltip>
            )]}
          </AvatarGroup>
        </Grid>
      </Grid>
    </div>
  );
}
