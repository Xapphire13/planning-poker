import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Button from '@material-ui/core/Button';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import createStylesFn from ':web/theme/createStylesFn';
import {
  OnVotingStarted,
  OnVotingStartedVariables,
  LeaveSession,
  LeaveSessionVariables
} from ':__generated__/graphql';
import StorageUtil from ':web/utils/storageUtil';

export type WaitingPageProps = RouteComponentProps;

const stylesFn = createStylesFn(() => ({
  container: {
    textAlign: 'center',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  icon: {
    fontSize: 100
  },
  cancelButton: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}));

const VOTING_STARTED_SUBSCRIPTION = gql`
  subscription OnVotingStarted($sessionId: String!) {
    votingStarted(sessionId: $sessionId) {
      success
    }
  }
`;

const LEAVE_SESSION_MUTATION = gql`
  mutation LeaveSession($sessionId: String!) {
    leave(sessionId: $sessionId) {
      success
    }
  }
`;

export default function WaitingPage({ navigate }: WaitingPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const sessionId = StorageUtil.local.getItem<string>('sessionId');
  const [leaveSession] = useMutation<LeaveSession, LeaveSessionVariables>(
    LEAVE_SESSION_MUTATION
  );
  useSubscription<OnVotingStarted, OnVotingStartedVariables>(
    VOTING_STARTED_SUBSCRIPTION,
    {
      skip: !sessionId,
      variables: {
        sessionId: sessionId ?? ''
      },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData?.data?.votingStarted?.success) {
          navigate?.('/vote');
        }
      }
    }
  );

  const handleLeavePressed = () => {
    if (sessionId) {
      leaveSession({
        variables: {
          sessionId
        }
      }).then(() => navigate?.('/'));
    }
  };

  return (
    <Container maxWidth="sm" {...css(styles.container)}>
      <Typography>Waiting for vote to start</Typography>
      <HourglassEmpty {...css(styles.icon)} />
      <Button
        variant="outlined"
        {...css(styles.cancelButton)}
        onClick={handleLeavePressed}
      >
        Leave session
      </Button>
    </Container>
  );
}
