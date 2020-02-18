import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import { useState, useEffect } from 'react';
import {
  SessionState,
  SessionStateQuery,
  SessionStateQueryVariables,
  OnSessionStateChanged,
  OnSessionStateChangedVariables
} from ':__generated__/graphql';

const SESSION_STATE_QUERY = gql`
  query SessionStateQuery($sessionId: String!) {
    session(sessionId: $sessionId) {
      state
    }
  }
`;

const SESSION_STATE_CHANGED_SUBSCRIPTION = gql`
  subscription OnSessionStateChanged($sessionId: String!) {
    newState: sessionStateChanged(sessionId: $sessionId)
  }
`;

export default function useSessionState(sessionId: string | undefined) {
  const [sessionState, setSessionState] = useState<SessionState>();
  const [
    triggerQuery,
    { data: sessionStateData, subscribeToMore }
  ] = useLazyQuery<SessionStateQuery, SessionStateQueryVariables>(
    SESSION_STATE_QUERY,
    { fetchPolicy: 'no-cache' }
  );

  useEffect(() => {
    if (sessionId) {
      triggerQuery({ variables: { sessionId } });
    }
  }, [sessionId, triggerQuery]);

  useEffect(() => {
    if (sessionId && subscribeToMore) {
      subscribeToMore<OnSessionStateChanged, OnSessionStateChangedVariables>({
        document: SESSION_STATE_CHANGED_SUBSCRIPTION,
        variables: { sessionId },
        updateQuery: (prev, { subscriptionData }) => {
          setSessionState(
            prevState => subscriptionData?.data?.newState ?? prevState
          );

          return prev;
        }
      });
    }
  });

  useEffect(() => {
    setSessionState(sessionStateData?.session?.state ?? undefined);
  }, [sessionStateData]);

  return sessionState;
}
