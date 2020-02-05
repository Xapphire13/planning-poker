import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import { RouteComponentProps } from '@reach/router';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Button from '@material-ui/core/Button';
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import createStylesFn from ':web/theme/createStylesFn';

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
  subscription onVotingStarted {
    votingStarted {
      success
    }
  }
`;

export default function WaitingPage({ navigate }: WaitingPageProps) {
  const { css, styles } = useStyles({ stylesFn });
  useSubscription(VOTING_STARTED_SUBSCRIPTION, {
    shouldResubscribe: true,
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData?.data?.votingStarted?.success) {
        navigate?.('/vote');
      }
    }
  });

  return (
    <Container maxWidth="sm" {...css(styles.container)}>
      <Typography>Waiting for vote to start</Typography>
      <HourglassEmpty {...css(styles.icon)} />
      <Button
        variant="outlined"
        {...css(styles.cancelButton)}
        onClick={() => navigate?.('/')}
      >
        Cancel
      </Button>
    </Container>
  );
}
