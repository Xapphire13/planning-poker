import React from "react";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import { CSSProperties } from "react-with-styles";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Tooltip from "@material-ui/core/Tooltip";
import { colors, Color } from "@material-ui/core";
import { muiTheme } from ":shared/theme/DefaultTheme";
import hashSum from "hash-sum";
import User from ":shared/User";

const STORYPOINT_BORDER_WIDTH = 2;

function getColorsForUser(user: User) {
  const colorKeys = Object.keys(colors).filter(key => key !== "common");
  const index = Number.parseInt(`0x${hashSum(user.name)}`) % colorKeys.length;
  const key = colorKeys[index];
  const background = ((colors as any)[key] as Color)[500];
  const foreground = muiTheme.palette.getContrastText(background);

  return { background, foreground };
}

function getInitials(user: User) {
  const parts = user.name.split(/\s+/);

  return parts.slice(0, 2).map(part => part[0].toLocaleUpperCase()).join("");
}

export type VoteDistributionRowProps = {
  storyPoints: number;
  voters: User[];
  totalVotes: number;
  isWinningVote?: boolean;
}

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  storyPointsContainer: {
    position: "relative",
    width: 50,
    flexShrink: 0,
    padding: `${unit * 2}px 0px`,
    borderTop: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderRight: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderBottom: `${STORYPOINT_BORDER_WIDTH}px solid #fff`,
    borderTopRightRadius: unit / 2,
    borderBottomRightRadius: unit / 2,
    overflow: "hidden"
  },
  storyPointsBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    background: "#555555"
  },
  winningVoteContainer: {
    borderColor: "#F2C84B"
  },
  storyPointsContent: {
    position: "relative",
    textAlign: "center",
    fontWeight: "bold"
  },
  avatarContainer: {
    paddingLeft: 2 * unit
  },
  avatarGroup: {
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
  }
}))

export default function VoteDistributionRow({ storyPoints, voters, totalVotes, isWinningVote = false }: VoteDistributionRowProps) {
  const { css, styles } = useStyles({ stylesFn });

  const numberOfVotes = voters.length;
  const percentage = Math.ceil(numberOfVotes / totalVotes * 100);
  const computedBackgroundStyle: CSSProperties = {
    width: `${percentage}%`
  }

  return <div {...css(styles.container)}>
    <div {...css(styles.storyPointsContainer, isWinningVote && styles.winningVoteContainer)}>
      <div {...css(styles.storyPointsBackground, computedBackgroundStyle)}></div>
      <div {...css(styles.storyPointsContent)}>
        {storyPoints}
      </div>
    </div>
    <div {...css(styles.avatarContainer)}>
      <AvatarGroup {...css(styles.avatarGroup)}>
        {voters.map((voter, i) => {
          const colors = getColorsForUser(voter);

          const computedStyles: CSSProperties = {
            color: colors.foreground,
            backgroundColor: colors.background
          }

          return <Tooltip title={voter.name} key={i} {...css(computedStyles)}><Avatar {...css(styles.avatar)}>{getInitials(voter)}</Avatar></Tooltip>
        })}
      </AvatarGroup>
    </div>
  </div>;
}