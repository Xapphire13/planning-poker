import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import {
  PersonJoined,
  PersonDisconnected,
  SessionUsers,
  SessionUsersVariables,
  PersonJoinedVariables,
  PersonDisconnectedVariables
} from ':__generated__/graphql';

const SESSION_USERS_QUERY = gql`
  query SessionUsers($sessionId: String!) {
    session(sessionId: $sessionId) {
      users {
        id
      }
    }
  }
`;

const PERSON_JOINED_SUBSCRIPTION = gql`
  subscription PersonJoined($sessionId: String!) {
    users: personJoined(sessionId: $sessionId) {
      id
    }
  }
`;

const PERSON_DISCONNECTED_SUBSCRIPTION = gql`
  subscription PersonDisconnected($sessionId: String!) {
    users: personDisconnected(sessionId: $sessionId) {
      id
    }
  }
`;

export default function useConnectedCount(sessionId: string | undefined) {
  const [count, setCount] = useState(0);
  const [
    triggerQuery,
    { data: sessionUsersData, subscribeToMore }
  ] = useLazyQuery<SessionUsers, SessionUsersVariables>(SESSION_USERS_QUERY);

  useEffect(() => {
    if (sessionId) {
      triggerQuery({ variables: { sessionId } });
    }
  }, [sessionId, triggerQuery]);

  useEffect(() => {
    if (sessionId && subscribeToMore) {
      subscribeToMore<PersonJoined, PersonJoinedVariables>({
        document: PERSON_JOINED_SUBSCRIPTION,
        variables: {
          sessionId
        },
        updateQuery: (prev, { subscriptionData }) => {
          setCount(
            prevCount => subscriptionData.data.users?.length ?? prevCount
          );

          return prev;
        }
      });

      subscribeToMore<PersonDisconnected, PersonDisconnectedVariables>({
        document: PERSON_DISCONNECTED_SUBSCRIPTION,
        variables: { sessionId },
        updateQuery: (prev, { subscriptionData }) => {
          setCount(
            prevCount => subscriptionData.data.users?.length ?? prevCount
          );

          return prev;
        }
      });
    }
  }, [sessionId, subscribeToMore]);

  useEffect(() => {
    setCount(
      prevCount => sessionUsersData?.session?.users?.length ?? prevCount
    );
  }, [sessionUsersData]);

  return count;
}
