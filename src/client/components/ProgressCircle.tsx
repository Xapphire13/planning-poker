import React from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import createStylesFn from '../../shared/theme/createStylesFn';

export type ProgressCircleProps = {
  value: number;
  max: number;
};

const stylesFn = createStylesFn(() => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  circleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  circle: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  lowerCircle: {
    position: 'relative',
    top: '0.5%',
    left: '0.5%',
    width: '99%',
    height: '99%',
    color: grey[500]
  },
  progressText: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    textAlign: 'center'
  }
}));

export default function ProgressCircle({ value, max }: ProgressCircleProps) {
  const { css, styles } = useStyles({ stylesFn });

  const progress = Math.floor((value / max) * 100);
  const progressText = `${value} / ${max}`;

  return (
    <>
      <div {...css(styles.container)}>
        <div {...css(styles.circleContainer)}>
          <CircularProgress
            variant="static"
            color="inherit"
            thickness={0.25}
            value={100}
            {...css(styles.lowerCircle)}
          />
        </div>
        <div {...css(styles.circleContainer)}>
          <CircularProgress
            variant="static"
            thickness={0.75}
            value={progress}
            {...css(styles.circle)}
          />
        </div>
        <Typography {...css(styles.progressText)}>{progressText}</Typography>
      </div>
    </>
  );
}
