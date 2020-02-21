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
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import VStack from 'pancake-layout/dist/VStack';
import VStackItem from 'pancake-layout/dist/VStackItem';
import ConnectionStepsCard from ':web/components/ConnectionStepsCard';
import createStylesFn from '../theme/createStylesFn';
import { CreateSession } from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';
import useConnectedUsers from ':web/hooks/useConnectedUsers';
import SessionParticipants from ':web/components/SessionParticipants';

const DRAWER_WIDTH = 240;

export type HostPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  contentContainer: {
    marginTop: unit,
    marginBottom: unit,
    height: `calc(100% - ${2 * unit}px)`,
    position: 'relative'
  },
  readyButton: {
    marginTop: unit,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  closeMenuButton: {
    position: 'absolute',
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
}));

const CREATE_SESSION_MUTATION = gql`
  mutation CreateSession {
    createSession
  }
`;

export default function WelcomePage({ navigate }: HostPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [sessionId, setSessionId] = useState<string | undefined>(
    StorageUtil.session.getItem('sessionId')
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createSession] = useMutation<CreateSession>(CREATE_SESSION_MUTATION);
  const connectedUsers = useConnectedUsers(sessionId);

  useEffect(() => {
    if (!sessionId) {
      (async () => {
        const result = await createSession();

        if (result.data?.createSession) {
          setSessionId(result.data.createSession);
          StorageUtil.session.setItem('sessionId', result.data.createSession);
        }
      })();
    }
  }, [createSession, sessionId]);

  const handleStartVoteClicked = () => {
    navigate?.('/waitingForVotes');
  };

  const numberOfPeopleConnected = connectedUsers.length;

  return (
    <div {...css(styles.slideContainer)}>
      <VStack
        {...css(styles.fullHeight, drawerOpen && styles.slideContainerMenuOpen)}
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
          <Container maxWidth="xs" {...css(styles.contentContainer)}>
            <VStack justify="space-between" {...css(styles.fullHeight)}>
              <>
                {sessionId && <ConnectionStepsCard sessionId={sessionId} />}

                <Button
                  variant="contained"
                  color="primary"
                  disabled={numberOfPeopleConnected < 2}
                  onClick={handleStartVoteClicked}
                  {...css(styles.readyButton)}
                >
                  Ready!
                </Button>
              </>
              <>
                <Divider />
                <SessionParticipants
                  users={connectedUsers}
                  sessionCode={sessionId ?? ''}
                />
              </>
            </VStack>
          </Container>
        </VStackItem>
      </VStack>

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
