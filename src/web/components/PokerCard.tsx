import React from 'react';
import { createUseStyles } from 'react-jss';
import color from 'color';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import { muiTheme } from ':web/theme/DefaultTheme';

export const CARD_RATIO = 9 / 14;
const BASE_WIDTH = 140;
const BASE_WIDTH_VERTICAL = 90;

export type PokerCardProps = {
  value: string;
  className?: string;
  backgroundColor?: string;
  width?: number;
  vertical?: boolean;
  showHoverEffects?: boolean;
  largeText?: boolean;
};

type StyleProps = {
  backgroundColor: string;
  width: number;
  vertical: boolean;
  showHoverEffects: boolean;
};

const useStyles = createUseStyles({
  container: {
    width: ({ width }: StyleProps) => width,
    height: ({ width, vertical }: StyleProps) =>
      vertical
        ? Math.round(width / CARD_RATIO)
        : Math.round(width * CARD_RATIO),
    borderRadius: ({ width }: StyleProps) =>
      Math.round((width / BASE_WIDTH) * 5),
    border: 'none',
    position: 'relative',
    backgroundColor: ({ backgroundColor }: StyleProps) => backgroundColor,
    '&:hover': {
      backgroundColor: ({ backgroundColor, showHoverEffects }: StyleProps) => {
        if (!showHoverEffects) return 'none';

        const clr = color(backgroundColor);

        return clr.isLight() ? clr.darken(0.3).hex() : clr.lighten(0.3).hex();
      }
    }
  },
  textContainer: {
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    color: ({ backgroundColor }: StyleProps) =>
      muiTheme.palette.getContrastText(backgroundColor)
  }
});

export default function PokerCard({
  value,
  backgroundColor = '#FFF',
  vertical = false,
  width = vertical ? BASE_WIDTH_VERTICAL : BASE_WIDTH,
  showHoverEffects = true,
  className,
  largeText
}: PokerCardProps) {
  const styles = useStyles({
    backgroundColor,
    width,
    vertical,
    showHoverEffects
  } as StyleProps);

  return (
    <div className={classnames(styles.container, className)}>
      <div className={classnames(styles.textContainer)}>
        <Typography variant={largeText ? 'h3' : 'h5'}>{value}</Typography>
      </div>
    </div>
  );
}
