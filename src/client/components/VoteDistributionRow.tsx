import React from "react";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import { CSSProperties } from "react-with-styles";
import { Persona } from "office-ui-fabric-react/lib/Persona";

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
  votesContainer: {
    flexGrow: 1,
    marginLeft: unit,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: -unit,
    marginRight: -unit
  },
  personaContainer: {
    marginRight: unit,
    marginBottom: unit
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
    <div {...css(styles.votesContainer)}>
      {[...new Array(votes).keys()].map((_, i) => <div key={i} {...css(styles.personaContainer)}><Persona imageInitials="SH" hidePersonaDetails /></div>)}
    </div>
  </div>;
}