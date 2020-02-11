import React from 'react';
import Typography from '@material-ui/core/Typography';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import color from 'color';
import { Vote } from ':web/Vote';
import { muiTheme } from ':web/theme/DefaultTheme';

export type VoteButtonProps = {
  value: Vote;
  onPress: () => void;
  backgroundColor?: string;
};

type StyleProps = {
  backgroundColor: string;
};

const useStyles = createUseStyles({
  container: {
    width: 140,
    height: 90,
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: ({ backgroundColor }: StyleProps) => backgroundColor,
    '&:hover, &:focus': {
      backgroundColor: ({ backgroundColor }: StyleProps) => {
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

export default function VoteButton({
  value,
  onPress,
  backgroundColor
}: VoteButtonProps) {
  const styles = useStyles({
    backgroundColor: backgroundColor ?? '#FFFFFF'
  } as StyleProps);
  const valueText = value === 'Infinity' ? '∞' : value;

  return (
    <button
      type="button"
      className={classnames(styles.container)}
      onClick={onPress}
    >
      <div className={classnames(styles.textContainer)}>
        <Typography variant="h5">{valueText}</Typography>
      </div>
    </button>
  );
}
