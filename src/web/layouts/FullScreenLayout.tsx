import React from 'react';
import Container from '@material-ui/core/Container';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import Theme from ':web/theme/DefaultTheme';

export type FullScreenLayoutProps = {
  children: React.ReactNode | React.ReactNodeArray;
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    height: '100%',
    padding: Theme.unit
  }
});

export default function FullScreenLayout({ children }: FullScreenLayoutProps) {
  const styles = useStyles();

  return (
    <Container maxWidth="xs" className={classNames(styles.container)}>
      {children}
    </Container>
  );
}
