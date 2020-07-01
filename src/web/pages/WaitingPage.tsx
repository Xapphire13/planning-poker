import React, { useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Button from '@material-ui/core/Button';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import createStylesFn from ':web/theme/createStylesFn';
import {
  LeaveSession,
  LeaveSessionVariables,
  SessionState,
} from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';
import useSessionState from ':web/hooks/useSessionState';

export type WaitingPageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    textAlign: 'center',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  icon: {
    fontSize: 100,
  },
  changeVoteButton: {
    marginBottom: unit,
  },
  blockButton: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const LEAVE_SESSION_MUTATION = gql`
  mutation LeaveSession($sessionId: String!) {
    leave(sessionId: $sessionId) {
      success
    }
  }
`;

export default function WaitingPage({ navigate, location }: WaitingPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const sessionId = StorageUtil.local.getItem<string>('sessionId');
  const [leaveSession] = useMutation<LeaveSession, LeaveSessionVariables>(
    LEAVE_SESSION_MUTATION
  );
  const sessionState = useSessionState(sessionId);
  const fromVotePage = !!location?.state?.fromVotePage;

  useEffect(() => {
    if (sessionState === SessionState.VOTING) {
      navigate?.('/vote');
    }
  }, [navigate, sessionState]);

  const handleChangeVotePressed = () => {
    navigate?.('/vote', { state: { changingVote: true } });
  };

  const handleLeavePressed = () => {
    if (sessionId) {
      leaveSession({
        variables: {
          sessionId,
        },
      }).then(() => navigate?.('/'));
    }
  };

  return (
    <Container maxWidth="sm" {...css(styles.container)}>
      <Typography>Waiting for vote to start</Typography>
      <HourglassEmpty {...css(styles.icon)} />
      {fromVotePage && (
        <Button
          {...css(styles.blockButton, styles.changeVoteButton)}
          variant="outlined"
          onClick={handleChangeVotePressed}
        >
          Change Vote
        </Button>
      )}
      <Button
        variant="outlined"
        {...css(styles.blockButton)}
        onClick={handleLeavePressed}
      >
        Leave session
      </Button>
    </Container>
  );
}
