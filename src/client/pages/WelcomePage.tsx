import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GitHubIcon from '@material-ui/icons/GitHub';
// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ConnectionInfo from ':shared/ConnectionInfo';
import ConnectionStepsCard from ':client/components/ConnectionStepsCard';
import IpcChannel from ':shared/IpcChannel';
import createStylesFn from '../../shared/theme/createStylesFn';

const { ipcRenderer } = window.require('electron');

const DRAWER_WIDTH = 240;

export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  contentContainer: {
    marginTop: unit,
    marginBottom: unit
  },
  readyButton: {
    marginTop: unit,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  connectedText: {
    textAlign: 'center'
  },
  closeMenuButton: {
    position: 'absolute',
    right: 0
  },
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0
  },
  container: {
    height: '100%',
    overflowX: 'hidden'
  },
  slideContainer: {
    position: 'relative',
    height: '100%'
  },
  slideContainerMenuOpen: {
    left: DRAWER_WIDTH
  }
}));

export default function WelcomePage({ navigate }: WelcomePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>();
  const [numberOfPeopleConnected, setNumberOfPeopleConnected] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    ipcRenderer
      .invoke(IpcChannel.GetConnectionInfo)
      .then((connInfo: ConnectionInfo) => {
        setConnectionInfo(connInfo);
      });
  }, []);

  useEffect(() => {
    const personConnectedListener = () =>
      setNumberOfPeopleConnected(prev => prev + 1);
    const personDisconnectedListener = () =>
      setNumberOfPeopleConnected(prev => prev - 1);

    (async () => {
      const count: number = await ipcRenderer.invoke(
        IpcChannel.GetConnectedCount
      );
      setNumberOfPeopleConnected(prev => prev + count);

      ipcRenderer.addListener(
        IpcChannel.PersonConnected,
        personConnectedListener
      );
      ipcRenderer.addListener(
        IpcChannel.PersonDisconnected,
        personDisconnectedListener
      );
    })();

    // Cleanup
    return () => {
      ipcRenderer.removeListener(
        IpcChannel.PersonConnected,
        personConnectedListener
      );
      ipcRenderer.removeListener(
        IpcChannel.PersonDisconnected,
        personDisconnectedListener
      );
    };
  }, []);

  const handleStartVoteClicked = () => {
    navigate?.('/vote');
  };

  return (
    <div {...css(styles.container)}>
      <div
        {...css(
          styles.slideContainer,
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
        <div>
          {connectionInfo && (
            <Container maxWidth="xs" {...css(styles.contentContainer)}>
              <ConnectionStepsCard connectionInfo={connectionInfo} />
              <Typography variant="body2" {...css(styles.connectedText)}>
                {numberOfPeopleConnected} people connected
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={numberOfPeopleConnected < 2}
                onClick={handleStartVoteClicked}
                {...css(styles.readyButton)}
              >
                Ready!
              </Button>
            </Container>
          )}
        </div>

        <Drawer
          anchor="left"
          variant="persistent"
          open={drawerOpen}
          PaperProps={...css(styles.drawer)}
        >
          <Toolbar variant="dense">
            <IconButton
              {...css(styles.closeMenuButton)}
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
                shell.openExternal(
                  'https://github.com/Xapphire13/planning-poker'
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
    </div>
  );
}
