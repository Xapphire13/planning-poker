import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { colors, Color } from '@material-ui/core';
import hashSum from 'hash-sum';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import useMeasure from 'react-use/lib/useMeasure';
import { styled } from 'linaria/react';
import { css } from 'linaria';
import Theme, { muiTheme } from ':web/theme/DefaultTheme';
import User from ':web/User';

export const AVATAR_SIZE = 5 * Theme.unit;
const TOTAL_AVATAR_BORDER_SIZE = 4;
const CONDENSED_AVATAR_WIDTH = AVATAR_SIZE - 4;

function getColorsForName(name: string) {
  const colorKeys = Object.keys(colors).filter((key) => key !== 'common');
  const index = Number.parseInt(`0x${hashSum(name)}`, 16) % colorKeys.length;
  const key = colorKeys[index];
  const background = ((colors as any)[key] as Color)[500];
  const foreground = muiTheme.palette.getContrastText(background);

  return { background, foreground };
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);

  return parts
    .slice(0, 2)
    .filter((part) => part.length > 0)
    .map((part) => [...part][0].toUpperCase())
    .join('');
}

const Container = styled.div`
  overflow-x: hidden;
`;

const avatarGroup = css`
  padding-left: ${Theme.unit}px;
`;

const avatar = css`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
`;

const overflowAvatar = css`
  background-color: ${colors.grey[500]};
  color: ${muiTheme.palette.getContrastText(colors.grey[500])};
`;

function calculateMaxNumberOfAvatars(availableWidth: number) {
  if (availableWidth < AVATAR_SIZE + TOTAL_AVATAR_BORDER_SIZE) return 0;

  return (
    1 +
    Math.floor(
      (availableWidth - (AVATAR_SIZE + TOTAL_AVATAR_BORDER_SIZE)) /
        CONDENSED_AVATAR_WIDTH
    )
  );
}

type UserAvatarGroupProps = {
  users: (User & {
    customClassName?: string;
  })[];
};

export default function UserAvatarGroup({ users }: UserAvatarGroupProps) {
  const [containerRef, { width: availableWidth }] = useMeasure();

  const maxAvatarsPerRow = calculateMaxNumberOfAvatars(availableWidth);

  const usersToDisplay = users.slice(
    0,
    maxAvatarsPerRow < users.length ? maxAvatarsPerRow - 1 : maxAvatarsPerRow
  );
  const hiddenUsers = users.slice(usersToDisplay.length);

  return (
    <Container ref={(ref) => ref && containerRef(ref)}>
      <AvatarGroup className={avatarGroup}>
        {usersToDisplay.map(({ id, name, customClassName }) => {
          const { background, foreground } = getColorsForName(name);

          return (
            <Tooltip
              title={<Typography variant="caption">{name}</Typography>}
              key={id}
              className={customClassName}
              style={{ backgroundColor: background, color: foreground }}
            >
              <Avatar className={avatar}>
                <Typography>{getInitials(name)}</Typography>
              </Avatar>
            </Tooltip>
          );
        })}
        {hiddenUsers.length > 0 && (
          <Tooltip
            title={hiddenUsers.map((user) => (
              <div>
                <Typography variant="caption" key={user.id}>
                  {user.name}
                </Typography>
              </div>
            ))}
            key="hidden-users"
            className={overflowAvatar}
          >
            <Avatar className={avatar}>
              <Typography>+{hiddenUsers.length}</Typography>
            </Avatar>
          </Tooltip>
        )}
      </AvatarGroup>
    </Container>
  );
}
