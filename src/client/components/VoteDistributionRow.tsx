import React from "react";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import { CSSProperties } from "react-with-styles";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Tooltip from "@material-ui/core/Tooltip";

const STORYPOINT_BORDER_WIDTH = 2;

export type VoteDistributionRowProps = {
  storyPoints: number;
  votes: number;
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

export default function VoteDistributionRow({ storyPoints, votes, totalVotes, isWinningVote = false }: VoteDistributionRowProps) {
  const { css, styles } = useStyles({ stylesFn });

  const percentage = Math.ceil(votes / totalVotes * 100);
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
        {[...new Array(votes).keys()].map((_, i) => <Tooltip title="Steven H" key={i}><Avatar {...css(styles.avatar)}>SH</Avatar></Tooltip>)}
      </AvatarGroup>
    </div>
  </div>;
}