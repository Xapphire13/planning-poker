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
import { css, cx } from 'linaria';
import { styled } from 'linaria/react';
import Theme from '../theme/DefaultTheme';

const DRAWER_WIDTH = 240;

const contentContainer = css`
  margin-top: ${Theme.unit}px;
  margin-bottom: ${Theme.unit}px;
  height: calc(100% - ${2 * Theme.unit}px);
  position: relative;
`;

const closeMenuButton = css`
  position: absolute !important;
  right: 0;
`;

const drawer = css`
  width: ${DRAWER_WIDTH}px;
  flex-shrink: 0;
`;

const SlideContainer = styled.div`
  position: relative;
  height: 100%;
  overflow-x: hidden;
`;

const slideContainerMenuOpen = css`
  left: ${DRAWER_WIDTH}px;
`;

const fullHeight = css`
  height: 100%;
`;

export type AppBarLayoutProps = {
  children: React.ReactNode | React.ReactNodeArray;

  fullWidth?: boolean;
};

export default function AppBarLayout({
  children,
  fullWidth,
}: AppBarLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SlideContainer>
      <VStack className={cx(fullHeight, drawerOpen && slideContainerMenuOpen)}>
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
            className={contentContainer}
          >
            <>{children}</>
          </Container>
        </VStackItem>
      </VStack>

      <Drawer
        anchor="left"
        variant="persistent"
        open={drawerOpen}
        PaperProps={{ className: drawer }}
      >
        <Toolbar variant="dense">
          <IconButton
            className={closeMenuButton}
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
    </SlideContainer>
  );
}
