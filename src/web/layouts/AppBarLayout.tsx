import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import VStack from 'pancake-layout/dist/VStack';
import VStackItem from 'pancake-layout/dist/VStackItem';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GitHubIcon from '@material-ui/icons/GitHub';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import Theme from '../theme/DefaultTheme';

const DRAWER_WIDTH = 240;

const useStyles = createUseStyles({
  contentContainer: {
    marginTop: Theme.unit,
    marginBottom: Theme.unit,
    height: `calc(100% - ${2 * Theme.unit}px)`,
    position: 'relative'
  },
  closeMenuButton: {
    position: 'absolute !important',
    right: 0
  },
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0
  },
  slideContainer: {
    position: 'relative',
    height: '100%',
    overflowX: 'hidden'
  },
  slideContainerMenuOpen: {
    left: DRAWER_WIDTH
  },
  fullHeight: {
    height: '100%'
  }
});

export type AppBarLayoutProps = {
  children: React.ReactNode | React.ReactNodeArray;

  fullWidth?: boolean;
};

export default function AppBarLayout({
  children,
  fullWidth
}: AppBarLayoutProps) {
  const styles = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={classNames(styles.slideContainer)}>
      <VStack
        className={classNames(
          styles.fullHeight,
          drawerOpen && styles.slideContainerMenuOpen
        )}
      >
        <AppBar position="static">
          <Toolbar variant="dense">
            {!drawerOpen && (
              <IconButton onClick={() => setDrawerOpen(true)} edge="start">
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">Planning Poker</Typography>
          </Toolbar>
        </AppBar>
        <VStackItem grow>
          <Container
            disableGutters={fullWidth}
            maxWidth={!fullWidth && 'xs'}
            className={classNames(styles.contentContainer)}
          >
            {children}
          </Container>
        </VStackItem>
      </VStack>

      <Drawer
        anchor="left"
        variant="persistent"
        open={drawerOpen}
        PaperProps={{ className: classNames(styles.drawer) }}
      >
        <Toolbar variant="dense">
          <IconButton
            className={classNames(styles.closeMenuButton)}
            onClick={() => setDrawerOpen(false)}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() =>
              window.open(
                'https://github.com/Xapphire13/planning-poker',
                '_blank'
              )
            }
          >
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary="Source Code" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
