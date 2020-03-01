import React, { useState, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import VStack from 'pancake-layout/dist/VStack';
import purple from '@material-ui/core/colors/deepPurple';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import VStackItem from 'pancake-layout/dist/VStackItem';
import SwipeableViews from 'react-swipeable-views';
import { Vote, VoteValues } from ':web/Vote';
import PokerCard from './PokerCard';

export type VoteConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;

  vote?: Vote;
  onConfirm?: (vote: Vote) => void;
};

const useStyles = createUseStyles({
  container: {
    padding: 8
  },
  cancelButtonContainer: {
    textAlign: 'right'
  },
  pokerCard: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  carouselWrapper: {
    width: '100%'
  }
});

export default function VoteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  vote
}: VoteConfirmationDialogProps) {
  const styles = useStyles();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (vote) {
      setActiveSlide(VoteValues.indexOf(vote));
    }
  }, [vote]);

  const handleConfirm = () => {
    const selectedVote = VoteValues[activeSlide];

    onConfirm?.(selectedVote);
  };

  return (
    <Drawer open={open} onClose={onClose} anchor="bottom">
      <VStack gap={8} className={classNames(styles.container)}>
        <VStackItem className={classNames(styles.cancelButtonContainer)}>
          <IconButton onClick={onClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </VStackItem>
        <VStack gap={8} alignItems="center">
          <VStackItem className={classNames(styles.carouselWrapper)}>
            <SwipeableViews
              enableMouseEvents
              index={activeSlide}
              onChangeIndex={setActiveSlide}
            >
              {VoteValues.map<string>(String).map(value => (
                <PokerCard
                  key={value}
                  className={classNames(styles.pokerCard)}
                  width={300}
                  value={value}
                  showHoverEffects={false}
                  backgroundColor={purple['400']}
                  vertical
                  largeText
                />
              ))}
            </SwipeableViews>
          </VStackItem>
          <Button onClick={handleConfirm}>Confirm</Button>
        </VStack>
      </VStack>
    </Drawer>
  );
}
