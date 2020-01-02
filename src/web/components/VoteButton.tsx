import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import grey from '@material-ui/core/colors/grey';
import createStylesFn from ':shared/theme/createStylesFn';
import { Vote } from ':shared/Vote';

export type VoteButtonProps = {
  value: Vote;
  onPress: () => void;
};

const stylesFn = createStylesFn(() => ({
  container: {
    width: 100,
    height: 100,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: grey[500]
    }
  },
  textContainer: {
    textAlign: 'center',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)'
  }
}));

export default function VoteButton({ value, onPress }: VoteButtonProps) {
  const { css, styles } = useStyles({ stylesFn });
  const valueText = value === 'Infinity' ? '∞' : value;

  return (
    <Paper {...css(styles.container)} onClick={onPress}>
      <div {...css(styles.textContainer)}>
        <Typography variant="h5">{valueText}</Typography>
      </div>
    </Paper>
  );
}
