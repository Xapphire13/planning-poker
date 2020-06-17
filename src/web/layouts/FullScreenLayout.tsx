import React from 'react';
import Container from '@material-ui/core/Container';
import { css } from 'linaria';
import Theme from ':web/theme/DefaultTheme';

export type FullScreenLayoutProps = {
  children: NonNullable<React.ReactNode> | React.ReactNodeArray;
};

const container = css`
  position: relative;
  height: 100%;
  padding: ${Theme.unit}px;
`;

export default function FullScreenLayout({ children }: FullScreenLayoutProps) {
  return (
    <Container maxWidth="xs" className={container}>
      {children}
    </Container>
  );
}
