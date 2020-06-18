import React from 'react';
import Typography from '@material-ui/core/Typography';
import color from 'color';
import { styled } from 'linaria/react';
import { Vote } from ':web/Vote';
import { muiTheme } from ':web/theme/DefaultTheme';

export const CARD_RATIO = 9 / 14;
const BASE_WIDTH = 140;
const BASE_WIDTH_VERTICAL = 90;

export type VoteButtonProps = {
  value: Vote;
  onPress: () => void;
  backgroundColor?: string;
  width?: number;
  vertical?: boolean;
};

const Container = styled.button<{
  width: number;
  vertical: boolean;
  backgroundColor: string;
}>`
  width: ${({ width }) => width}px;
  height: ${({ width, vertical }) =>
    vertical
      ? Math.round(width / CARD_RATIO)
      : Math.round(width * CARD_RATIO)}px;
  border-radius: ${({ width }) => Math.round((width / BASE_WIDTH) * 5)}px;
  border: none;
  cursor: pointer;
  position: relative;
  background-color: ${({ backgroundColor }) => backgroundColor};

  &:hover,
  &:focus {
    background-color: ${({ backgroundColor }) => {
      const clr = color(backgroundColor);

      return clr.isLight() ? clr.darken(0.3).hex() : clr.lighten(0.3).hex();
    }};
  }
`;

const TextContainer = styled.div<{ backgroundColor: string }>`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ backgroundColor }) =>
    muiTheme.palette.getContrastText(backgroundColor)};
`;

export default function VoteButton({
  value,
  onPress,
  backgroundColor = '#FFFFFF',
  vertical = false,
  width = vertical ? BASE_WIDTH_VERTICAL : BASE_WIDTH,
}: VoteButtonProps) {
  const valueText = value === 'Infinity' ? '∞' : value;

  return (
    <Container
      type="button"
      onClick={onPress}
      width={width}
      vertical={vertical}
      backgroundColor={backgroundColor}
    >
      <TextContainer backgroundColor={backgroundColor}>
        <Typography variant="h5">{valueText}</Typography>
      </TextContainer>
    </Container>
  );
}
