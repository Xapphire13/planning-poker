import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { Vote } from ':web/Vote';
import PokerCard, { PokerCardProps } from './PokerCard';

export type VoteButtonProps = {
  value: Vote;
  onPress: () => void;
} & Omit<PokerCardProps, 'value'>;

const useStyles = createUseStyles({
  button: {
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0
  }
});

export default function VoteButton({
  value,
  onPress,
  ...pokerCardProps
}: VoteButtonProps) {
  const styles = useStyles();

  const valueText = value === 'Infinity' ? '∞' : String(value);

  return (
    <button
      type="button"
      onClick={onPress}
      className={classNames(styles.button)}
    >
      <PokerCard value={valueText} {...pokerCardProps} />
    </button>
  );
}
